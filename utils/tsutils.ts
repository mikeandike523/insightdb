export function arrayHasDuplicate<T>(array: T[]) {
  return array.some((item, idx) => {
    return array.indexOf(item) !== idx;
  });
}

export function getEnvStrict(name: string): string {
  const value = process.env[name];
  if (typeof value === 'undefined') {
    throw new Error(`Environment variable ${name} is undefined.`);
  }
  return value as string;
}

export function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  return (
    arr1.length === arr2.length &&
    arr1.every((element, index) => element === arr2[index])
  );
}

export interface AnyRecord {
  [key: string | number]: any;
}

export function selectSubset(obj: AnyRecord, keys: string[]): AnyRecord {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      (acc as AnyRecord)[key] = obj[key];
    }
    return acc;
  }, {});
}

export function selectInverseSubset(
  obj: AnyRecord,
  excludeKeys: string[]
): AnyRecord {
  const result: AnyRecord = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!excludeKeys.includes(k)) {
      result[k] = v;
    }
  }
  return result;
}

export function stripUndefined(a: any, recursive = true): any {
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
