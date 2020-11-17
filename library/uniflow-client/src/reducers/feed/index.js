import {
  COMMIT_CLEAR_FEED,
  COMMIT_UPDATE_FEED,
  COMMIT_DELETE_FEED,
  COMMIT_SET_CURRENT_SLUG,
  COMMIT_SET_CURRENT_FOLDER_PATH,
  COMMIT_SET_CURRENT_UID,
} from './actions-types'

const defaultState = {
  items: {},
  slug: null,
  folderPath: '/',
  uid: null,
}

const feed = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_CLEAR_FEED:
      return {
        ...state,
        items: {},
      }
    case COMMIT_UPDATE_FEED:
      state.items[`${action.item.type}-${action.item.entity.uid}`] = action.item
      return {
        ...state,
      }
    case COMMIT_DELETE_FEED:
      delete state.items[`${action.item.type}-${action.item.entity.uid}`]
      return {
        ...state,
      }
    case COMMIT_SET_CURRENT_SLUG:
      return {
        ...state,
        slug: action.slug,
      }
    case COMMIT_SET_CURRENT_FOLDER_PATH:
      return {
        ...state,
        folderPath: action.folderPath,
      }
    case COMMIT_SET_CURRENT_UID:
      return {
        ...state,
        uid: action.uid,
      }
    default:
      return state
  }
}

export default feed
