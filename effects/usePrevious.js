import { useRef, useEffect } from "react";

/*
    Hook that gives the previous value of a state.
    Taken from https://stackoverflow.com/a/53446665.
*/
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;
