export function arrayHasDuplicate<T>(array: T[]) {
  return array.some((item, idx) => {
    return array.indexOf(item) !== idx;
  });
}
