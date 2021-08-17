import React, { MutableRefObject, RefObject, useContext, useReducer } from 'react';
import { useReducerRef } from '../hooks/use-reducer-ref';
import { Log } from '../models';

export enum LogsActionTypes {
  COMMIT_ADD_LOG = 'COMMIT_ADD_LOG',
  COMMIT_READ_LOG = 'COMMIT_READ_LOG',
}

export type LogsAction = 
  | { type: LogsActionTypes.COMMIT_ADD_LOG }
  | { type: LogsActionTypes.COMMIT_READ_LOG }

export type LogsDispath = React.Dispatch<LogsAction>

export interface LogsProviderProps {
  children: React.ReactNode;
}

export interface LogsProviderState {
}

let id = 1;
const defaultState = {};

export const getNewLogs = (state) => {
  return Object.keys(state).reduce((newLogs, key) => {
    if (state[key].status === 'new') {
      newLogs[key] = state[key];
    }
    return newLogs;
  }, {});
};

export const commitAddLog = (message) => {
  return async (dispatch: LogsDispath) => {
    dispatch({
      type: LogsActionTypes.COMMIT_ADD_LOG,
      message,
    });
    return Promise.resolve();
  };
};
export const commitReadLog = (id) => {
  return async (dispatch: LogsDispath) => {
    dispatch({
      type: LogsActionTypes.COMMIT_READ_LOG,
      id,
    });
    return Promise.resolve();
  };
};

export const LogsContext = React.createContext<{logs: LogsProviderState, logsDispatch: LogsDispath, logsRef: MutableRefObject<LogsProviderState>}>({
  logs: defaultState,
  logsDispatch: () => {
    throw new Error('LogContext not yet initialized.');
  },
  logsRef: {
    current: defaultState,
  }
});
LogsContext.displayName = 'LogContext';

export function LogsProvider(props: LogsProviderProps) {
  const [logs, logsDispatch, logsRef] = useReducerRef<LogsProviderState, LogsAction>((
    state: LogsProviderState = defaultState,
    action: LogsAction
  ) => {
    switch (action.type) {
      case LogsActionTypes.COMMIT_ADD_LOG:
        const item = new Log({
          id,
          message: action.message,
          status: 'new',
        });
        id++;
  
        state[item.id] = item;
        return {
          ...state,
        };
      case LogsActionTypes.COMMIT_READ_LOG:
        return Object.keys(state).map((key) => {
          const item = state[key];
          if (item.id !== action.id) {
            return item;
          }
  
          return {
            ...item,
            ...{ status: 'read' },
          };
        });
      default:
        return state;
    }
  }, defaultState);

  return (
    <LogsContext.Provider value={{logs, logsDispatch, logsRef}}>
      {props.children}
    </LogsContext.Provider>
  );
}

export const LogsConsumer = LogsContext.Consumer;

export function useLogs() {
  return useContext(LogsContext);
}
