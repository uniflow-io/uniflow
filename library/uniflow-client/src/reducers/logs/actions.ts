import { COMMIT_ADD_LOG, COMMIT_READ_LOG } from './actions-types';

export const getNewLogs = (state) => {
  return Object.keys(state).reduce((newLogs, key) => {
    if (state[key].status === 'new') {
      newLogs[key] = state[key];
    }
    return newLogs;
  }, {});
};

export const commitAddLog = (message) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_ADD_LOG,
      message,
    });
    return Promise.resolve();
  };
};
export const commitReadLog = (id) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_READ_LOG,
      id,
    });
    return Promise.resolve();
  };
};
