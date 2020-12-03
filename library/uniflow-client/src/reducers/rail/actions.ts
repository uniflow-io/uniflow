import { COMMIT_PUSH_FLOW, COMMIT_POP_FLOW, COMMIT_UPDATE_FLOW, COMMIT_SET_RAIL } from "./actions-types"

export const commitPushFlow = (index, flow) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_PUSH_FLOW,
      index,
      flow,
    })
    return Promise.resolve()
  }
}
export const commitPopFlow = (index) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_POP_FLOW,
      index,
    })
    return Promise.resolve()
  }
}
export const commitUpdateFlow = (index, data, codes) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_UPDATE_FLOW,
      index,
      data,
      codes,
    })
    return Promise.resolve()
  }
}
export const commitSetRail = (rail) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_SET_RAIL,
      rail,
    })
    return Promise.resolve()
  }
}
