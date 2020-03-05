import {
  COMMIT_LOGIN_USER_REQUEST,
  COMMIT_LOGIN_USER_SUCCESS,
  COMMIT_LOGIN_USER_FAILURE,
  COMMIT_LOGOUT_USER,
} from './actions-types'

const defaultState = {
  token: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
}

const auth = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_LOGIN_USER_REQUEST:
      return Object.assign({}, state, {
        isAuthenticating: true,
        statusText: null,
      })
    case COMMIT_LOGIN_USER_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.token,
        statusText: 'You have been successfully logged in.',
      })
    case COMMIT_LOGIN_USER_FAILURE:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        statusText: `Authentication Error: ${action.status} ${action.statusText}`,
      })
    case COMMIT_LOGOUT_USER:
      return Object.assign({}, state, {
        isAuthenticated: false,
        token: null,
        statusText: 'You have been successfully logged out.',
      })
    default:
      return state
  }
}

export default auth
