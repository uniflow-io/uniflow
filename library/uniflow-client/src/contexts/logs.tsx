import React, { MutableRefObject, RefObject, useContext, useReducer } from 'react';
import { useReducerRef } from '../hooks/use-reducer-ref';
import { Log } from '../models';
import { LOG_STATUS } from '../models/log';

export enum LogsActionTypes {
  COMMIT_ADD_LOG = 'COMMIT_ADD_LOG',
  COMMIT_READ_LOG = 'COMMIT_READ_LOG',
}

export type LogsAction = 
  | { type: LogsActionTypes.COMMIT_ADD_LOG, message: string }
  | { type: LogsActionTypes.COMMIT_READ_LOG, id: number }

export type LogsDispath = React.Dispatch<LogsAction>

export interface LogsProviderProps {
  children: React.ReactNode;
}

export type LogsProviderState = {[type: string]: Log}

let id = 1;
const defaultState = {};

export const getNewLogs = (logs: LogsProviderState) => {
  return Object.keys(logs).reduce((newLogs: LogsProviderState, key) => {
    if (logs[key].status === LOG_STATUS.NEW) {
      newLogs[key] = logs[key];
    }
    return newLogs;
  }, {});
};

export const commitAddLog = (message: string) => {
  return async (dispatch: LogsDispath) => {
    dispatch({
      type: LogsActionTypes.COMMIT_ADD_LOG,
      message,
    });
    return Promise.resolve();
  };
};
export const commitReadLog = (id: number) => {
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
  ): LogsProviderState => {
    switch (action.type) {
      case LogsActionTypes.COMMIT_ADD_LOG:
        const item = new Log({
          id,
          message: action.message,
          status: LOG_STATUS.NEW,
        });
        id++;
  
        state[item.id] = item;
        return {
          ...state,
        };
      case LogsActionTypes.COMMIT_READ_LOG:
        return {
          ...state,
          ...{[action.id]: new Log({
            id: action.id,
            message: state[action.id].message,
            status: LOG_STATUS.READ,
          })}
        }
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
