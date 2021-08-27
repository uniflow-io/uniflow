import {
  DispatchWithoutAction,
  MutableRefObject,
  ReducerStateWithoutAction,
  Reducer,
  ReducerWithoutAction,
  useReducer,
  useRef,
  ReducerState,
  Dispatch,
  ReducerAction,
  RefObject,
} from 'react';

export function useReducerRef<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  initializer?: undefined
): [S, Dispatch<A>, MutableRefObject<S>] {
  const stateRef = useRef<S>(initialState);
  const [state, dispatch] = useReducer<Reducer<S, A>>(
    (state: S, action: A): S => {
      state = reducer(state, action);
      stateRef.current = state;
      return state;
    },
    initialState,
    initializer
  );

  return [state, dispatch, stateRef];
}
