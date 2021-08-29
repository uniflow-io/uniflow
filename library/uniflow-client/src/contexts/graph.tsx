import React, { MutableRefObject, useContext } from 'react';
import { FC } from 'react';
import Container from '../container';
import { useReducerRef } from '../hooks/use-reducer-ref';
import { Api } from '../services';

const container = new Container();
const api = container.get(Api);

export enum GraphActionTypes {
  COMMIT_PUSH_FLOW = 'COMMIT_PUSH_FLOW',
  COMMIT_POP_FLOW = 'COMMIT_POP_FLOW',
  COMMIT_UPDATE_FLOW = 'COMMIT_UPDATE_FLOW',
  COMMIT_SET_FLOWS = 'COMMIT_SET_FLOWS',
}

export type GraphAction =
  | { type: GraphActionTypes.COMMIT_PUSH_FLOW }
  | { type: GraphActionTypes.COMMIT_POP_FLOW }
  | { type: GraphActionTypes.COMMIT_UPDATE_FLOW }
  | { type: GraphActionTypes.COMMIT_SET_FLOWS };

export type GraphDispath = React.Dispatch<GraphAction>;

export interface GraphProviderProps {
  children: React.ReactNode;
}

export type GraphProviderState = Array<string>;

const defaultState: GraphProviderState = [];

export const commitPushFlow = (index, flow) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_PUSH_FLOW,
      index,
      flow,
    });
    return Promise.resolve();
  };
};
export const commitPopFlow = (index) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_POP_FLOW,
      index,
    });
    return Promise.resolve();
  };
};
export const commitUpdateFlow = (index, data) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_UPDATE_FLOW,
      index,
      data,
    });
    return Promise.resolve();
  };
};
export const commitSetFlows = (flows) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_SET_FLOWS,
      flows,
    });
    return Promise.resolve();
  };
};

export const GraphContext = React.createContext<{
  graph: GraphProviderState;
  graphDispatch: GraphDispath;
  graphRef: MutableRefObject<GraphProviderState>;
}>({
  graph: defaultState,
  graphDispatch: () => {
    throw new Error('GraphContext not yet initialized.');
  },
  graphRef: {
    current: defaultState,
  },
});
GraphContext.displayName = 'GraphContext';

export const GraphProvider: FC<GraphProviderProps> = (props) => {
  const [graph, graphDispatch, graphRef] = useReducerRef<GraphProviderState, GraphAction>(
    (state: GraphProviderState = defaultState, action: GraphAction) => {
      switch (action.type) {
        case GraphActionTypes.COMMIT_PUSH_FLOW:
          const newStatePush = state.slice();
          newStatePush.splice(action.index, 0, {
            flow: action.flow,
          });
          return newStatePush;
        case GraphActionTypes.COMMIT_POP_FLOW:
          const newStatePop = state.slice();
          newStatePop.splice(action.index, 1);
          return newStatePop;
        case GraphActionTypes.COMMIT_UPDATE_FLOW:
          return state.map((item, index) => {
            if (index !== action.index) {
              return item;
            }

            return {
              ...item,
              ...{
                data: action.data,
              },
            };
          });
        case GraphActionTypes.COMMIT_SET_FLOWS:
          return action.flows.slice();
        default:
          return state;
      }
    },
    defaultState
  );

  return (
    <GraphContext.Provider value={{ graph, graphDispatch, graphRef }}>
      {props.children}
    </GraphContext.Provider>
  );
};

export const GraphConsumer = GraphContext.Consumer;

export function useGraph() {
  return useContext(GraphContext);
}
