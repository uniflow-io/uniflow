import {
  COMMIT_PUSH_FLOW,
  COMMIT_POP_FLOW,
  COMMIT_UPDATE_FLOW,
  COMMIT_SET_FLOW
} from './actionsTypes'

export const commitPushFlow = (index, component) => {
  return dispatch => {
    dispatch({
      type: COMMIT_PUSH_FLOW,
      index,
      component
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
export const commitUpdateFlow = (index, data) => {
  return dispatch => {
    dispatch({
      type: COMMIT_UPDATE_FLOW,
      index,
      data
    })
    return Promise.resolve()
  }
}
export const commitSetFlow = stack => {
  return dispatch => {
    dispatch({
      type: COMMIT_SET_FLOW,
      stack
    })
    return Promise.resolve()
  }
}
