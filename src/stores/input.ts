const inputCache: { [key: string]: unknown } = {};

export const addToCache = (key: string, value: unknown) => {
  inputCache[key] = value;
};

export const getFromCache = (key: string) => {
  return inputCache[key];
};
