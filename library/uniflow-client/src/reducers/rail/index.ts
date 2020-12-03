import { Bus } from "../../models"
import { COMMIT_PUSH_FLOW, COMMIT_POP_FLOW, COMMIT_UPDATE_FLOW, COMMIT_SET_RAIL } from "./actions-types"

const defaultState = []

const rail = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_PUSH_FLOW:
      let newStatePush = state.slice()
      newStatePush.splice(action.index, 0, {
        flow: action.flow,
        bus: new Bus(),
      })
      return newStatePush
    case COMMIT_POP_FLOW:
      let newStatePop = state.slice()
      newStatePop.splice(action.index, 1)
      return newStatePop
    case COMMIT_UPDATE_FLOW:
      return state.map((item, index) => {
        if (index !== action.index) {
          return item
        }

        return {
          ...item,
          ...{
            data: action.data,
            codes: action.codes,
          },
        }
      })
    case COMMIT_SET_RAIL:
      return action.rail.slice()
    default:
      return state
  }
}

export default rail
