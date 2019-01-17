import {
  COMMIT_CLEAR_HISTORY,
  COMMIT_UPDATE_HISTORY,
  COMMIT_DELETE_HISTORY,
  COMMIT_SET_CURRENT_HISTORY,
  COMMIT_SET_CURRENT_FOLDER,
  COMMIT_SET_CURRENT_USERNAME
} from './actionsTypes'

const defaultState = {
  items: {},
  current: null,
  folder: null,
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
        current: action.current === null ? null : {...action.current}
      }
    case COMMIT_SET_CURRENT_FOLDER:
      return {
        ...state,
        folder: action.folder
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
