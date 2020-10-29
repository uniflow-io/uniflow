import { COMMIT_UPDATE_SETTINGS } from './actions-types'

const defaultState = {
  uid: null,
  apiKey: null,
  username: null,
  firstName: null,
  lastName: null,
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
