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
  | { type: GraphActionTypes.COMMIT_PUSH_FLOW, index: number, flow: string }
  | { type: GraphActionTypes.COMMIT_POP_FLOW, index: number }
  | { type: GraphActionTypes.COMMIT_UPDATE_FLOW, index: number, data: any }
  | { type: GraphActionTypes.COMMIT_SET_FLOWS, flows: GraphProviderState['flows'] };

export type GraphDispath = React.Dispatch<GraphAction>;

export interface GraphProviderProps {
  children: React.ReactNode;
}

export interface GraphProviderState {
  flows: {
    type: string
    isRunning: boolean
    data?: any
  }[]
};

const defaultState: GraphProviderState = {
  flows: []
};

export const commitPushFlow = (index: number, flow: string) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_PUSH_FLOW,
      index,
      flow,
    });
    return Promise.resolve();
  };
};
export const commitPopFlow = (index: number) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_POP_FLOW,
      index,
    });
    return Promise.resolve();
  };
};
export const commitUpdateFlow = (index: number, data: any) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_UPDATE_FLOW,
      index,
      data,
    });
    return Promise.resolve();
  };
};
export const commitSetFlows = (flows: GraphProviderState['flows']) => {
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
          return {
            ...state,
            ...{flows: state.flows.slice().splice(action.index, 0, {
              type: action.flow,
              isRunning: false,
            })} 
          };
        case GraphActionTypes.COMMIT_POP_FLOW:
          return {
            ...state,
            ...{flows: state.flows.splice(action.index, 1)} 
          };
        case GraphActionTypes.COMMIT_UPDATE_FLOW:
          return {
            ...state,
            ...{flows: state.flows.map((item, index) => {
              if (index !== action.index) {
                return item;
              }
  
              return {
                ...item,
                ...{
                  data: action.data,
                },
              };
            })} 
          };
        case GraphActionTypes.COMMIT_SET_FLOWS:
          return {
            ...state,
            ...{flows: action.flows.slice()} 
          };
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
