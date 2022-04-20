import { useCallback, useState, useEffect, Dispatch, SetStateAction } from "react";

export function useLocalStorage<S>(key: string, defaultValue: any) {
  return useStorage<S>(key, defaultValue, window.localStorage);
}

export function useSessionStorage<S>(key: string, defaultValue: any) {
  return useStorage<S>(key, defaultValue, window.sessionStorage);
}

function useStorage<S>(
  key: string,
  defaultValue: S | (() => S),
  storageObject: Storage
): [S, Dispatch<SetStateAction<S>>, () => void] {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);

    return defaultValue instanceof Function ? defaultValue() : defaultValue;
  });

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => setValue(undefined), []);

  return [value, setValue, remove];
}
