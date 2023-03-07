/**
 * CYFORM: An object relational mapping library for cypher
 *
 * Notes:
 *
 *
 */

import { arrayHasDuplicate } from '@/utils/tsutils';

export type CYFORMField = {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'date';
  required: boolean;
  nullable: boolean;
};

export type RawValue = string | number | boolean | Date | null;

export function checkTypeMatch(
  requiredType: 'string' | 'number' | 'boolean' | 'date' | 'null',
  found: RawValue
) {
  switch (requiredType) {
    case 'string':
      return typeof found === 'string';
    case 'number':
      return typeof found === 'number';
    case 'boolean':
      return typeof found === 'boolean';
    case 'date':
      return (
        typeof found === 'object' && found !== null && found instanceof Date
      );
    case 'null':
      return typeof found === 'object' && found === null;
  }
}

export type CYFORMFieldValues = {
  [key: string | number]: RawValue;
};

export class CYFORMSchema {
  fields: Array<CYFORMField>;
  options: {
    strict: boolean;
  };

  constructor({
    fields,
    options
  }: {
    fields: Array<CYFORMField>;
    options: {
      strict: boolean;
    };
  }) {
    this.fields = fields;
    this.options = options;
    this.validate();
  }

  fieldNames() {
    return this.fields.map((field) => field.name);
  }

  requiredFieldNames() {
    return this.fields
      .filter((field) => field.required)
      .map((field) => field.name);
  }

  validate() {
    const fieldNames = this.fieldNames();
    if (arrayHasDuplicate(fieldNames)) {
      throw new CYFORMSchemaError({
        code: CYFORMSchemaErrorCode.DUPLICATE_FIELD_NAME,
        message: 'Schema field names must be unique.'
      });
    }
    for (const field of this.fields) {
      if (!field.required && !field.nullable) {
        throw new CYFORMSchemaError({
          code: CYFORMSchemaErrorCode.MALFORMED_FIELD,
          message: `Schema field '${field.name}' cannot be option but not-nullable.`
        });
      }
    }
  }
}

export enum CYFORMSchemaErrorCode {
  UNSPECIFIED,
  CYFORM_FIELD_NOT_FOUND,
  CYFORM_INVALID_VALUE,
  DUPLICATE_FIELD_NAME,
  TYPE_MISMATCH,
  MALFORMED_FIELD
}

export class CYFORMSchemaError extends Error {
  code: CYFORMSchemaErrorCode;
  constructor({
    message,
    code = CYFORMSchemaErrorCode.UNSPECIFIED
  }: {
    message: string;
    code: CYFORMSchemaErrorCode;
  }) {
    super(message);
    this.code = code;
  }
}

function validateDataAgainstSchema(
  schema: CYFORMSchema,
  data: CYFORMFieldValues
) {
  if (schema.options.strict) {
    for (const field of schema.fields) {
      if (field.required) {
        if (!data.hasOwnProperty(field.name)) {
          throw new CYFORMSchemaError({
            code: CYFORMSchemaErrorCode.CYFORM_FIELD_NOT_FOUND,
            message: `Field ${field.name} is required.`
          });
        }
      }
    }
  }
  for (const field of schema.fields) {
    if (!field.required && !data[field.name]) {
      continue;
    }

    if (field.required && typeof data[field.name] === 'undefined') {
      throw new CYFORMSchemaError({
        code: CYFORMSchemaErrorCode.CYFORM_FIELD_NOT_FOUND,
        message: `Field \`${field.name}\` is required.`
      });
    }

    if (field.required && !field.nullable && data[field.name] === null) {
      throw new CYFORMSchemaError({
        code: CYFORMSchemaErrorCode.CYFORM_INVALID_VALUE,
        message: `Field \`${field.name}\` is required and not nullable.`
      });
    }

    if (!checkTypeMatch(field.type, data[field.name])) {
      throw new CYFORMSchemaError({
        code: CYFORMSchemaErrorCode.TYPE_MISMATCH,
        message: `Field \`${field.name}\` must be of type \`${field.type}\`.`
      });
    }
  }
}

export class CYFORMObject {
  schema: CYFORMSchema;
  data: CYFORMFieldValues;
  uuid: string | null = null;
  constructor(schema: CYFORMSchema, data: CYFORMFieldValues) {
    validateDataAgainstSchema(schema, data);
    this.schema = schema;
    this.data = data;
  }
  save() {}
}
