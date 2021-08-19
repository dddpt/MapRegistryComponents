import { useCallback, useEffect } from "react";

/*
Effect that triggers when a click is made outside the given ref.

Inspired from https://stackoverflow.com/a/42234988
*/

const useClickedOutsideEffect = (effect, ref) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(effect, [ref]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, ref]);
};

export default useClickedOutsideEffect;
