import request from 'axios'
import server from '../../utils/server'
import jwtDecode from 'jwt-decode'
import {
  COMMIT_LOGIN_USER_REQUEST,
  COMMIT_LOGIN_USER_SUCCESS,
  COMMIT_LOGIN_USER_FAILURE,
  COMMIT_LOGOUT_USER
} from './actionsTypes'

export const commitLoginUserRequest = () => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_LOGIN_USER_REQUEST
    })
    return Promise.resolve()
  }
}

export const commitLoginUserSuccess = (token) => {
  window.localStorage.setItem('token', token)

  return (dispatch) => {
    dispatch({
      type: COMMIT_LOGIN_USER_SUCCESS,
      token
    })
    return Promise.resolve()
  }
}

export const commitLoginUserFailure = (error, message = null) => {
  window.localStorage.removeItem('token')

  return (dispatch) => {
    dispatch({
      type: COMMIT_LOGIN_USER_FAILURE,
      status: error.response.status,
      statusText: message || error.response.statusText
    })
    return Promise.resolve()
  }
}

export const commitLogoutUser = () => {
  window.localStorage.removeItem('token')

  return (dispatch) => {
    dispatch({
      type: COMMIT_LOGOUT_USER
    })
    return Promise.resolve()
  }
}

export const login = (username, password) => {
  return (dispatch) => {
    return dispatch(commitLoginUserRequest())
      .then(() => {
        return request
          .post(`${server.getBaseUrl()}/api/login_check`, {
            'username': username,
            'password': password
          })
          .then((response) => {
            try {
              jwtDecode(response.data.token)
              return dispatch(commitLoginUserSuccess(response.data.token))
            } catch (e) {
              return dispatch(commitLoginUserFailure({
                response: {
                  status: 403,
                  statusText: 'Invalid token'
                }
              }))
            }
          })
          .catch((error) => {
            dispatch(commitLoginUserFailure(error))
          })
      })
  }
}

export const loginFacebookUrl = (facebookAppId) => {
  return `https://www.facebook.com/v3.2/dialog/oauth?client_id=${facebookAppId}&response_type=token&redirect_uri=${window.location.protocol}//${window.location.hostname}/login/facebook`
}

export const loginFacebook = (access_token, token = null) => {
  return (dispatch) => {
    return dispatch(commitLoginUserRequest())
      .then(() => {
        return request
          .post(`${server.getBaseUrl()}/api/login/facebook`, {
            'access_token': access_token
          }, token === null ? {} : {
            headers: {
              'Uniflow-Authorization': `Bearer ${token}`
            }
          })
          .then((response) => {
            try {
              jwtDecode(response.data.token)
              return dispatch(commitLoginUserSuccess(response.data.token))
            } catch (e) {
              return dispatch(commitLoginUserFailure({
                response: {
                  status: 403,
                  statusText: 'Invalid token'
                }
              }))
            }
          })
          .catch((error) => {
            dispatch(commitLoginUserFailure(error))
          })
      })
  }
}

export const loginGithubUrl = (githubAppId) => {
  return `https://github.com/login/oauth/authorize?client_id=${githubAppId}&redirect_uri=${window.location.protocol}//${window.location.hostname}/login/github`
}

export const loginGithub = (code, token = null) => {
  return (dispatch) => {
    return dispatch(commitLoginUserRequest())
      .then(() => {
        return request
          .post(`${server.getBaseUrl()}/api/login/github`, {
            'code': code
          }, token === null ? {} : {
            headers: {
              'Uniflow-Authorization': `Bearer ${token}`
            }
          })
          .then((response) => {
            try {
              jwtDecode(response.data.token)
              return dispatch(commitLoginUserSuccess(response.data.token))
            } catch (e) {
              return dispatch(commitLoginUserFailure({
                response: {
                  status: 403,
                  statusText: 'Invalid token'
                }
              }))
            }
          })
          .catch((error) => {
            dispatch(commitLoginUserFailure(error))
          })
      })
  }
}

export const loginMediumUrl = (mediumAppId) => {
  return `https://medium.com/m/oauth/authorize?client_id=${mediumAppId}&scope=basicProfile,listPublications&state=medium&response_type=code&redirect_uri=${window.location.protocol}//${window.location.hostname}/login/medium`
}

export const loginMedium = (code, token = null) => {
  return (dispatch) => {
    return request
      .post(`${server.getBaseUrl()}/api/login/medium`, {
        'code': code
      }, token === null ? {} : {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
  }
}

export const register = (email, password) => {
  return (dispatch) => {
    return dispatch(commitLoginUserRequest())
      .then(() => {
        return request
          .post(`${server.getBaseUrl()}/api/register`, {
            'email': email,
            'password': password
          })
          .then((response) => {
            try {
              jwtDecode(response.data.token)
              return dispatch(commitLoginUserSuccess(response.data.token))
            } catch (e) {
              return dispatch(commitLoginUserFailure({
                response: {
                  status: 403,
                  statusText: 'Invalid token'
                }
              }))
            }
          })
          .catch((error) => {
            dispatch(commitLoginUserFailure(error, error.response.data.message))
          })
      })
  }
}
