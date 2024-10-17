export const mimeTypesUtil = async () => import('mime-types');

export const fileExtension = async (
  typeString: string,
): Promise<string | undefined> => {
  const mime = await mimeTypesUtil();

  typeString = typeString.includes('.')
    ? mime.lookup(typeString) || typeString
    : typeString;
  const extension = mime.extension(typeString);

  if (extension === false) {
    return;
  }

  return extension;
};
