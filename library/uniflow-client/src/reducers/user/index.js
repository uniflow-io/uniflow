import { COMMIT_UPDATE_SETTINGS } from './actions-types'

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
    default:
      return state
  }
}

export default user
