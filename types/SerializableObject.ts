import {
  AnyRecord,
  arraysAreEqual,
  selectInverseSubset,
  selectSubset
} from '@/utils/tsutils';

type Primitive = string | number | boolean | null;

function isStringifiable(value: unknown): boolean {
  if (value === null) {
    return true;
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    (typeof value === 'object' && 'toJSON' in value)
  ) {
    return true;
  }
  return false;
}

export type SerializableObject =
  | {
      [key: string | number]: Primitive | Primitive[] | SerializableObject;
    }
  | Primitive
  | SerializableObject[];

export type SerializableArray = SerializableObject[];

export type SerializableRecord = {
  [key: string | number]: SerializableObject;
};

export function serializableRecordStrictlySatisfiesInterface<
  T extends SerializableRecord
>(record: SerializableRecord) {
  return arraysAreEqual(Object.keys({} as T), Object.keys(record));
}

export function serializableRecordStrictlyMatches(
  obj1: SerializableRecord,
  obj2: SerializableRecord
) {
  return (
    arraysAreEqual(Object.keys(obj1), Object.keys(obj2)) &&
    arraysAreEqual<any>(
      Object.keys(obj1).map((key) => obj1[key]),
      Object.keys(obj2).map((key) => obj2[key])
    )
  );
}

export function recordSubset(record: SerializableRecord, subset: string[]) {
  return selectSubset(record as AnyRecord, subset) as SerializableRecord;
}

export function recordInverseSubset(
  record: SerializableRecord,
  subset: string[]
) {
  return selectInverseSubset(record as AnyRecord, subset) as SerializableRecord;
}

export type SerializableRecordTree = {
  [key: string | number]:
    | SerializableObject
    | SerializableRecord
    | SerializableRecordTree;
};

export class KeyError extends Error {}

export class TreeAccessor {
  data: SerializableRecordTree;

  constructor(data: SerializableRecordTree) {
    this.data = data;
  }
  get(path: string[], strict = true): SerializableObject | undefined {
    let unwrapped: any = this.data;
    for (let i = 0; i < path.length; i++) {
      const segment = path[i];
      const value = unwrapped[segment];
      if (typeof value === 'undefined') {
        if (strict) {
          throw new KeyError(
            `TreeAccessor: path \`${path.join('.')}\` broke starting\`${path
              .slice(0, i + 1)
              .join('.')}\``
          );
        } else {
          return undefined;
        }
      } else if (typeof value === 'object') {
        unwrapped = value;
      } else {
        if (i == path.length - 1) {
          return value as SerializableObject;
        } else {
          if (strict) {
            throw new KeyError(
              `TreeAccessor: path \`${path.join('.')}\` broke starting\`${path
                .slice(0, i + 1)
                .join('.')}\``
            );
          } else {
            return undefined;
          }
        }
      }
    }
  }
  getStrict(path: string[]): SerializableObject {
    return this.get(path, true) as SerializableObject;
  }
  getLax(path: string[]): SerializableObject | undefined {
    return this.get(path, false);
  }
}

export function TreeAccess(data: SerializableRecordTree) {
  return new TreeAccessor(data);
}

function _toSerializableObject(
  obj: any,
  _references?: any[],
  enumerableOnly = false
): SerializableObject {
  if (isStringifiable(obj)) {
    return obj as SerializableObject;
  }

  const references: any[] =
    typeof _references !== 'undefined' ? _references : [];

  references.push(obj);

  if (Array.isArray(obj)) {
    const result: SerializableObject[] = [];
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'undefined') {
        continue;
      }
      if (references.includes(obj[i])) {
        continue;
      }
      if (isStringifiable(obj[i])) {
        result.push(obj[i]);
      } else {
        result.push(_toSerializableObject(obj[i], references, enumerableOnly));
      }
    }
    return result as SerializableObject;
  } else {
    const result: SerializableObject = {};
    let keys = Object.getOwnPropertyNames(obj);
    if (enumerableOnly) {
      keys = [];
      for (const key in obj) {
        keys.push(key);
      }
    }
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
      const key = keys[keyIdx];

      if (typeof obj[key] === 'undefined') {
        continue;
      }
      if (references.includes(obj[key])) {
        continue;
      }
      if (isStringifiable(obj[key])) {
        result[key] = obj[key];
      } else {
        result[key] = _toSerializableObject(
          obj[key],
          references,
          enumerableOnly
        );
      }
    }
    return result as SerializableObject;
  }
}

export function toSerializableObject(obj: any, _references?: any[]) {
  return _toSerializableObject(obj, _references, false);
}

export function toSerializableObjectEnumerableOnly(
  obj: any,
  _references?: any[]
) {
  return _toSerializableObject(obj, _references, true);
}

export function unroll(
  obj: SerializableObject,
  separator = '.'
): SerializableObject {
  if (typeof obj !== 'object') {
    throw new Error('Cannot unroll non-object');
  }
  const unrollInner = (obj: SerializableObject, prefix = '') => {
    if (typeof obj !== 'object') {
      throw new Error('Cannot unroll non-object');
    }
    const result: SerializableObject = {};
    for (const key in obj) {
      if (typeof obj[key as keyof SerializableObject] === 'object') {
        result[(prefix + key) as keyof SerializableObject] = unrollInner(
          obj[key as keyof SerializableObject],
          prefix + key + separator
        );
      } else {
        result[prefix + key] = obj[key as keyof SerializableObject];
      }
    }
    return result;
  };
  const flatten = (obj: SerializableObject) => {
    const flat: SerializableObject = {};
    for (const key in obj as object) {
      if (typeof (obj as object)[key as keyof object] === 'object') {
        const subobj = flatten((obj as object)[key as keyof object]);
        for (const subkey in subobj) {
          flat[subkey] = subobj[subkey];
        }
      } else {
        flat[key] = (obj as object)[key as keyof object];
      }
    }
    return flat;
  };
  const labeled: SerializableObject = unrollInner(obj, '');
  return flatten(labeled);
}
