type primitive = string | number | boolean | null;

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
      [key: string | number]: primitive | primitive[] | SerializableObject;
    }
  | primitive
  | SerializableObject[];

export function toSerializableObject(
  obj: any,
  _references?: any[]
): SerializableObject {
  if (isPrimitive(obj)) {
    return obj as SerializableObject;
  }

  const references: any[] =
    typeof _references !== 'undefined' ? _references : [];

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
        result.push(toSerializableObject(obj[i], references));
      }
    }
    return result as SerializableObject;
  } else {
    const result: SerializableObject = {};
    const keys = Object.getOwnPropertyNames(obj);
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
        result[key] = toSerializableObject(obj[key], references);
      }
    }
    return result as SerializableObject;
  }
}
