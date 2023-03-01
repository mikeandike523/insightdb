import type { SerializableObject } from '@/types/SerializableObject';

export default function deepMerge(
  A: SerializableObject,
  B: SerializableObject
): SerializableObject {
  const result: SerializableObject = {};

  Object.assign(result, A);

  for (const key in B as object) {
    if (!(key in (A as object))) {
      result[key as keyof SerializableObject] =
        B ?? {}[key as keyof SerializableObject];
    } else {
      if (
        typeof (A ?? {}[key as keyof SerializableObject]) === 'object' &&
        typeof (B ?? {}[key as keyof SerializableObject]) === 'object'
      ) {
        result[key] = deepMerge(
          A ?? ({}[key as keyof SerializableObject] as SerializableObject),
          B ?? ({}[key as keyof SerializableObject] as SerializableObject)
        );
      } else {
        result[key] = B ?? {}[key as keyof SerializableObject];
      }
    }
  }

  return result;
}
