import { useRef, useState, useCallback } from 'react';

export function useStateRef(initialState) {
  const stateRef = useRef(initialState);
  const [state, setState] = useState(initialState);

  const dispatch = useCallback((val) => {
    stateRef.current = val;
    setState(stateRef.current);
  }, []);

  return [state, dispatch, stateRef];
}
