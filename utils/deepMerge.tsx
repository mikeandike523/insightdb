import type { SerializableObject } from '@/types/SerializableObject';

export default function deepMerge(A: any, B: any): SerializableObject {
  const result: any = {};

  if (!B) return A;

  for (const key in A) {
    result[key] = A[key];
  }

  for (const key in B) {
    console.log(key);

    if (!(key in A)) {
      result[key] = B[key];
      continue;
    }
    if (typeof A[key] !== 'object' || !A[key]) {
      result[key] = B[key];
      continue;
    }
    if (typeof A[key] !== 'object' || !B[key]) {
      result[key] = B[key];
      continue;
    }
    result[key] = deepMerge(A[key], B[key]);
  }

  console.log([A, B, result]);

  return result as SerializableObject;
}
