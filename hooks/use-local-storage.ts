import { useEffect, useState } from "react";

const getLocalValue = <T>(key: string, initValue: T): T => {
  if (typeof window === "undefined") {
    return initValue;
  }

  try {
    // retrive from local storage
    const localValue = localStorage.getItem(key);
    if (localValue) {
      return JSON.parse(localValue) as T;
    }
  } catch (error) {
    console.error(`Error parsing localStorage for key "${key}":`, error);
  }

  // if no value exists in localstorage, then fallback to given initValue
  return initValue instanceof Function ? initValue() : initValue;
};

const useLocalStorage = <T>(key: string, initValue: T) => {
  const [value, setValue] = useState<T>(() => getLocalValue(key, initValue));

  useEffect(() => {
    try {
      // save in local storage
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage for key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
};
export default useLocalStorage;
