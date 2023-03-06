import type { SerializableObject } from '@/types/SerializableObject';

export default function deepMerge(A: any, B: any): SerializableObject {
  const result: any = {};

  for (const key in A) {
    result[key] = A[key];
  }

  for (const key in B) {
    if (!(key in A)) {
      result[key] = B[key];
      continue;
    }
    if (typeof A[key] !== 'object') {
      result[key] = B[key];
      continue;
    }
    if (typeof A[key] !== 'object') {
      result[key] = B[key];
      continue;
    }
    result[key] = deepMerge(A[key], B[key]);
  }

  return result as SerializableObject;
}
