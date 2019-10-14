import {
  COMMIT_PUSH_FLOW,
  COMMIT_POP_FLOW,
  COMMIT_UPDATE_FLOW,
  COMMIT_SET_FLOW
} from './actionsTypes'

export const commitPushFlow = (index, flow) => {
  return dispatch => {
    dispatch({
      type: COMMIT_PUSH_FLOW,
      index,
      flow
    })
    return Promise.resolve()
  }
}
export const commitPopFlow = index => {
  return dispatch => {
    dispatch({
      type: COMMIT_POP_FLOW,
      index
    })
    return Promise.resolve()
  }
}
export const commitUpdateFlow = (index, data, code) => {
  return dispatch => {
    dispatch({
      type: COMMIT_UPDATE_FLOW,
      index,
      data,
      code
    })
    return Promise.resolve()
  }
}
export const commitSetFlow = rail => {
  return dispatch => {
    dispatch({
      type: COMMIT_SET_FLOW,
      rail
    })
    return Promise.resolve()
  }
}
