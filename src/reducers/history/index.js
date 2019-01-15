import {
  COMMIT_CLEAR_HISTORY,
  COMMIT_UPDATE_HISTORY,
  COMMIT_DELETE_HISTORY,
  COMMIT_SET_CURRENT_HISTORY,
  COMMIT_SET_CURRENT_PATH,
  COMMIT_SET_CURRENT_USERNAME
} from './actionsTypes'

const defaultState = {
  items: {},
  current: null,
  path: [],
  username: null
}

const history = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_CLEAR_HISTORY:
      return {
        ...state,
        items: {}
      }
    case COMMIT_UPDATE_HISTORY:
      state.items[`${action.item.constructor.name}_${action.item.id}`] = action.item
      return {
        ...state
      }
    case COMMIT_DELETE_HISTORY:
      delete state.items[`${action.item.constructor.name}_${action.item.id}`]
      return {
        ...state
      }
    case COMMIT_SET_CURRENT_HISTORY:
      return {
        ...state,
        current: {...action.current}
      }
    case COMMIT_SET_CURRENT_PATH:
      return {
        ...state,
        path: action.path.slice()
      }
    case COMMIT_SET_CURRENT_USERNAME:
      return {
        ...state,
        username: action.username
      }
    default:
      return state
  }
}

export default history
