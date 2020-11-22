import {
  COMMIT_UPDATE_SETTINGS,
  COMMIT_LOGOUT_USER,
} from './actions-types'

const defaultState = {
  uid: null,
  apiKey: null,
  username: null,
  firstname: null,
  lastname: null,
  facebookId: null,
  githubId: null,
  roles: [],
}

const user = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_UPDATE_SETTINGS:
      return {
        ...state,
        ...action.user,
      }
    case COMMIT_LOGOUT_USER:
      return {
        ...defaultState,
      }
    default:
      return state
  }
}

export default user
