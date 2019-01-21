import {
  COMMIT_CLEAR_PROGRAM,
  COMMIT_UPDATE_PROGRAM,
  COMMIT_DELETE_PROGRAM,
  COMMIT_SET_CURRENT_PROGRAM,
  COMMIT_SET_CURRENT_FOLDER,
  COMMIT_SET_CURRENT_USERNAME
} from './actionsTypes'

const defaultState = {
  items: {},
  current: null,
  folder: null,
  username: null
}

const program = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_CLEAR_PROGRAM:
      return {
        ...state,
        items: {}
      }
    case COMMIT_UPDATE_PROGRAM:
      state.items[`${action.item.constructor.name}_${action.item.id}`] = action.item
      return {
        ...state
      }
    case COMMIT_DELETE_PROGRAM:
      delete state.items[`${action.item.constructor.name}_${action.item.id}`]
      return {
        ...state
      }
    case COMMIT_SET_CURRENT_PROGRAM:
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

export default program
