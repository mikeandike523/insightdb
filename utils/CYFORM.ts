/**
 * CYFORM
 *
 * A type-safe ORM solution for CYPHER powered graph databases
 */

function hasExtraKeys(obj: { [key: string]: any }, keys: string[]): boolean {
  const objKeys = Object.keys(obj);
  const allowedKeys = new Set(keys);
  return objKeys.some((key) => !allowedKeys.has(key));
}

function stripUndefined(a: any, recursive = true): any {
  const result: any = {};
  for (const [k, v] of Object.entries(a)) {
    if (typeof v === 'undefined') {
      continue;
    }
    if (typeof v === 'object') {
      if (recursive) {
        result[k] = stripUndefined(v, recursive);
      } else {
        result[k] = v;
      }
    }
  }
}

class Collection<T> {
  items: T[];
  constructor(items: T[]) {
    this.items = items;
  }
  valuesFor<TReturn>(key: string | number) {
    return this.items.map(
      (item) => (item as object)[key as keyof object] as TReturn
    );
  }
}

export enum ValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'Date',
  NULL = 'null'
}

export type Field = {
  name: string;
  type: ValueType;
  required: boolean;
  nullable: boolean;
};

export type FieldValue = string | number | boolean | Date | null;

export type FieldValues = {
  [key: string | number]: FieldValue;
};

function valueMatchesType(value: FieldValue, type: ValueType): boolean {
  switch (type) {
    case ValueType.STRING:
      return typeof value === 'string';
    case ValueType.NUMBER:
      return typeof value === 'number';
    case ValueType.BOOLEAN:
      return typeof value === 'boolean';
    case ValueType.DATE:
      return value instanceof Date;
    case ValueType.NULL:
      return value === null;
    default:
      return false;
  }
}

enum SchemaErrorCode {
  UNSPECIFIED,
  INVALID_FIELD_NAME,
  INVALID_FIELD,
  INVALID_OPTION_VALUE
}

class SchemaError extends Error {
  code: SchemaErrorCode;
  message: string;
  constructor({ code, message }: { code?: SchemaErrorCode; message?: string }) {
    super(message ?? '');
    this.code = code ?? SchemaErrorCode.UNSPECIFIED;
    this.message = message ?? '';
  }
}

enum ValidationErrorCode {
  UNSPECIFIED,
  UNRECOGNIZED_FIELD,
  MISSING_FIELD,
  NOT_NULLABLE,
  TYPE_MISMATCH
}

class ValidationError extends Error {
  code: ValidationErrorCode;
  message: string;
  constructor({
    code,
    message
  }: {
    code?: ValidationErrorCode;
    message?: string;
  }) {
    super(message ?? '');
    this.code = code ?? ValidationErrorCode.UNSPECIFIED;
    this.message = message ?? '';
  }
}

/** Default required/nullable combination is required but nullable
 * This helps make a schema appear most like a regular SQL table, but allows for values to be null. Note that undefined/unspecified values must be explicitly converted to null using a helper function. This option seems safer than using a default of not-required + nullable
 *
 * Additionally, unlike mongoose, explicit values of the ValueType enum must be specified by the library user. Strings or type annotations are not supported.
 */

type ShorthandField =
  | {
      type: ValueType;
      required?: boolean;
      nullable?: boolean;
    }
  | ValueType;

function fieldFromShorthand(
  name: string,
  shorthandField: ShorthandField
): Field {
  if (!name) {
    throw new SchemaError({
      code: SchemaErrorCode.INVALID_FIELD_NAME,
      message: `Field name must be specified.`
    });
  }
  const field: Field = {
    name: name,
    type:
      typeof shorthandField === 'object' ? shorthandField.type : shorthandField,
    required: true,
    nullable: true
  };
  if (typeof shorthandField === 'object' && shorthandField.required) {
    field.required = true;
  }
  if (typeof shorthandField === 'object' && shorthandField.nullable) {
    field.nullable = false;
  }
  return field;
}

function validateField(field: Field) {
  if (!field.name) {
    // Prevent names that are defined but blank (i.e. === "")
    throw new SchemaError({
      code: SchemaErrorCode.INVALID_FIELD_NAME,
      message: `Field name must be specified.`
    });
  }
  if (!field.required && !field.nullable) {
    throw new SchemaError({
      code: SchemaErrorCode.INVALID_FIELD,
      message: `Optional field \`${field.name}\` must be nullable.`
    });
  }
}

type SchemaOptionValue = string | number | boolean | Date | null; // Not sure what types of options there will be yet. For now, this union type will do.

// For now, schemas will be saved as JSON in database, and data will have the hierarchical structure. That is why Schema does not currently have owner or name fields
class Schema {
  fields: Field[] = [];
  strict: boolean;
  constructor(
    shorthand: { [name: string]: ShorthandField },
    options: {
      [options: string]: SchemaOptionValue;
    } = {}
  ) {
    for (const [name, shorthandField] of Object.entries(shorthand)) {
      const field = fieldFromShorthand(name, shorthandField);
      validateField(field);
      this.fields.push(field);
    }
    if (
      typeof options.strict !== 'undefined' &&
      typeof options.strict !== 'boolean'
    ) {
      throw new SchemaError({
        code: SchemaErrorCode.INVALID_OPTION_VALUE,
        message: `Schema option \`strict\` must be a boolean.`
      });
    }
    this.strict = (options.strict ?? true) as boolean;
  }
  requiredFields() {
    return this.fields.filter((field) => field.required);
  }
  optionalFields() {
    return this.fields.filter((field) => !field.required);
  }
  fieldNames() {
    return new Collection<Field>(this.fields).valuesFor<string>('name');
  }
  requiredFieldNames() {
    return new Collection<Field>(this.requiredFields()).valuesFor<string>(
      'name'
    );
  }
  optionalFieldNames() {
    return new Collection<Field>(this.optionalFields()).valuesFor<string>(
      'name'
    );
  }
  validateData(data: FieldValues) {
    data = stripUndefined(data) as FieldValues;

    if (this.strict) {
      if (hasExtraKeys(data, this.fieldNames())) {
        throw new ValidationError({
          code: ValidationErrorCode.UNRECOGNIZED_FIELD,
          message: 'Data contains fields not present in strict schema.'
        });
      }
    }

    const requiredFieldNames = this.requiredFieldNames();
    for (const fn of requiredFieldNames) {
      if (!data.hasOwnProperty(fn)) {
        throw new ValidationError({
          code: ValidationErrorCode.MISSING_FIELD,
          message: `Field \`${fn}\` is required.`
        });
      } else {
        const field = this.fields.find((f) => f.name === fn) as Field;
        if (data[fn] === null && !field.nullable) {
          throw new ValidationError({
            code: ValidationErrorCode.NOT_NULLABLE,
            message: `Required field \`${fn}\` is not nullable.`
          });
        }
        if (!valueMatchesType(data[fn], field.type)) {
          throw new ValidationError({
            code: ValidationErrorCode.TYPE_MISMATCH,
            message: `Field \`${fn}\` must be of type \`${field.type}\`.`
          });
        }
      }
    }
  }
  model(owner: string): (data: FieldValues) => CYFORMObject {
    return (data: FieldValues) => {
      return new CYFORMObject(owner, this, data);
    };
  }
  toJSON() {
    return JSON.stringify({
      strict: this.strict,
      fields: this.fields
    });
  }
  static fromJSON(json: string): Schema {
    const obj: any = JSON.parse(json);
    const schema = new Schema({}, { strict: obj.strict });
    schema.fields = obj.fields;
    return schema;
  }
}

class CYFORMObject {
  owner: string;
  schema: Schema;
  data: FieldValues;
  constructor(owner: string, schema: Schema, data: FieldValues) {
    schema.validateData(data);
    this.owner = owner;
    this.schema = schema;
    this.data = data;
  }
  toJSON() {
    return JSON.stringify({
      owner: this.owner,
      schema: this.schema.toJSON(),
      data: this.data
    });
  }
  static fromJSON(json: string): CYFORMObject {
    const obj = JSON.parse(json);
    const schema = Schema.fromJSON(obj.schema);
    const owner = obj.owner;
    const data = obj.data;
    return new CYFORMObject(owner, schema, data);
  }
  async save() {
    // not yet implemented
  }
}
