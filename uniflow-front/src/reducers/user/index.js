import { COMMIT_SET_FLOWS, COMMIT_UPDATE_SETTINGS } from './actionsTypes'

const defaultState = {
  flows: {},
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
    case COMMIT_SET_FLOWS:
      return {
        ...state,
        ...{ flows: action.flows },
      }
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
