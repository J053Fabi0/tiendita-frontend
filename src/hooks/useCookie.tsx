import Cookies from "js-cookie";
import { useState, useCallback } from "react";

export default function useCookie(name: string, defaultValue: string, options?: Cookies.CookieAttributes) {
  const [value, setValue] = useState<string>(() => {
    const cookie = Cookies.get(name);
    if (cookie) return cookie;
    Cookies.set(name, defaultValue, options);
    return defaultValue;
  });

  const updateCookie = useCallback(
    (newValue: string, options?: Cookies.CookieAttributes) => {
      Cookies.set(name, newValue, options);
      setValue(newValue);
    },
    [name]
  );

  const deleteCookie = useCallback(() => {
    Cookies.remove(name);
    setValue("");
  }, [name]);

  return [value, updateCookie, deleteCookie] as const;
}
