import { DispatchWithoutAction, MutableRefObject, ReducerStateWithoutAction, Reducer, ReducerWithoutAction, useReducer, useRef, ReducerState, Dispatch, ReducerAction, RefObject, useState, SetStateAction, useCallback } from "react";

export function useStateRef<S>(initialState: S): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
    const stateRef = useRef<S>(initialState)
    const [state, setState] = useState<S>(initialState)

    const dispatch = useCallback((val) => {
        stateRef.current = val
        setState(stateRef.current)
      }, []);

    return [state, dispatch, stateRef]
}
