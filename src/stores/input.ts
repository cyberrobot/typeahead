const cache = new Map<string, any>();

export const addToCache = (key: string, value: unknown) => {
  cache.set(key, value);
};

export const getFromCache = (key: string) => {
  return cache.get(key);
};
