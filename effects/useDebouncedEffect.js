import { useCallback, useEffect } from "react";

/*
 Effects that triggers only when it was not called for a certain delay.
 
 Taken from https://stackoverflow.com/a/61127960
*/
export const useDebouncedEffect = (effect, delay, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(effect, deps);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};
