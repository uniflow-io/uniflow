import {
  COMMIT_CLEAR_FEED,
  COMMIT_UPDATE_FEED,
  COMMIT_DELETE_FEED,
  COMMIT_SET_CURRENT_FEED,
  COMMIT_SET_CURRENT_FOLDER,
  COMMIT_SET_CURRENT_USERNAME
} from './actionsTypes'

const defaultState = {
  items: {},
  current: null,
  folder: null,
  username: null
}

const feed = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_CLEAR_FEED:
      return {
        ...state,
        items: {}
      }
    case COMMIT_UPDATE_FEED:
      state.items[`${action.item.constructor.name}_${action.item.id}`] = action.item
      return {
        ...state
      }
    case COMMIT_DELETE_FEED:
      delete state.items[`${action.item.constructor.name}_${action.item.id}`]
      return {
        ...state
      }
    case COMMIT_SET_CURRENT_FEED:
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

export default feed
