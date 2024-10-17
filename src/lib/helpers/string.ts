export function toString(value: unknown) {
  return value == null ? '' : String(value);
}
export const stringAfter = (string: string, search: string) => {
  const index = string.indexOf(search);

  if (index === -1) {
    return '';
  }

  return string.slice(index + search.length);
};
