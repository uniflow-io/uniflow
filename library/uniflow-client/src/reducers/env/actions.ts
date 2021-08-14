import { COMMIT_SET_ENV } from './actions-types';

export const commitSetEnv = (env) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_SET_ENV,
      env,
    });
    return Promise.resolve();
  };
};
