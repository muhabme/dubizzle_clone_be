export function getEnumValues<T extends Record<string, string | number>>(
  enumObj: T,
): Array<T[keyof T]> {
  return Object.values(enumObj) as Array<T[keyof T]>;
}
