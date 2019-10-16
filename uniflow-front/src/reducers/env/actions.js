import {COMMIT_SET_ENV} from './actionsTypes'

export const commitSetEnv = env => {
  return dispatch => {
    dispatch({
      type: COMMIT_SET_ENV,
      env,
    })
    return Promise.resolve()
  }
}
