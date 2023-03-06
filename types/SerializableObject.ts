type Primitive = string | number | boolean | null;

function isPrimitive(value: unknown): boolean {
  if (value === null) {
    return true;
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
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

export function _toSerializableObject(
  obj: any,
  _references?: any[],
  enumerableOnly = false
): SerializableObject {
  if (isPrimitive(obj)) {
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
      if (isPrimitive(obj[i])) {
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
      if (isPrimitive(obj[key])) {
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
