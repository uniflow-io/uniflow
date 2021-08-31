import React, { MutableRefObject, createContext, useContext } from 'react';
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
  COMMIT_PLAY_FLOW = 'COMMIT_PLAY_FLOW',
  COMMIT_STOP_FLOW = 'COMMIT_STOP_FLOW',
}

export type GraphAction =
  | { type: GraphActionTypes.COMMIT_PUSH_FLOW, index: number, flowType: string }
  | { type: GraphActionTypes.COMMIT_POP_FLOW, index: number }
  | { type: GraphActionTypes.COMMIT_UPDATE_FLOW, index: number, data: object }
  | { type: GraphActionTypes.COMMIT_SET_FLOWS, flows: GraphProviderState['flows'] }
  | { type: GraphActionTypes.COMMIT_PLAY_FLOW, index: number }
  | { type: GraphActionTypes.COMMIT_STOP_FLOW, index: number }


export type GraphDispath = React.Dispatch<GraphAction>;

export interface GraphProviderProps {
  children: React.ReactNode;
}

export interface GraphProviderState {
  flows: {
    type: string
    isPlaying: boolean
    data?: object
  }[]
};

const defaultState: GraphProviderState = {
  flows: []
};

export const commitPushFlow = (index: number, flowType: string) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_PUSH_FLOW,
      index,
      flowType,
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
export const commitUpdateFlow = (index: number, data: object) => {
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
export const commitPlayFlow = (index: number) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_PLAY_FLOW,
      index,
    });
    return Promise.resolve();
  };
};
export const commitStopFlow = (index: number) => {
  return async (dispatch: GraphDispath) => {
    dispatch({
      type: GraphActionTypes.COMMIT_STOP_FLOW,
      index,
    });
    return Promise.resolve();
  };
};

export const GraphContext = createContext<{
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
          const pushFlows = state.flows.slice()
          pushFlows.splice(action.index, 0, {
            type: action.flowType,
            isPlaying: false,
          })
          return {
            ...state,
            ...{flows: pushFlows} 
          };
        case GraphActionTypes.COMMIT_POP_FLOW:
          const popFlows = state.flows.slice()
          popFlows.splice(action.index, 1)
          return {
            ...state,
            ...{flows: popFlows} 
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
        case GraphActionTypes.COMMIT_PLAY_FLOW:
          return {
            ...state,
            ...{flows: state.flows.map((item, index) => {
              if (index !== action.index) {
                return item;
              }
  
              return {
                ...item,
                ...{
                  isPlaying: true
                },
              };
            })}
          };
          case GraphActionTypes.COMMIT_STOP_FLOW:
            return {
              ...state,
              ...{flows: state.flows.map((item, index) => {
                if (index !== action.index) {
                  return item;
                }
    
                return {
                  ...item,
                  ...{
                    isPlaying: false
                  },
                };
              })}
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
