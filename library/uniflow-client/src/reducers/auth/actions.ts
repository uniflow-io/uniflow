import request from 'axios';
import server from '../../utils/server';
import jwtDecode from 'jwt-decode';
import {
  COMMIT_LOGIN_USER_REQUEST,
  COMMIT_LOGIN_USER_SUCCESS,
  COMMIT_LOGIN_USER_FAILURE,
  COMMIT_LOGOUT_USER,
} from './actions-types';

export const commitLoginUserRequest = () => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_LOGIN_USER_REQUEST,
    });
    return Promise.resolve();
  };
};

export const commitLoginUserSuccess = (token, uid) => {
  if (typeof window !== `undefined`) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('uid', uid);
  }

  return async (dispatch) => {
    dispatch({
      type: COMMIT_LOGIN_USER_SUCCESS,
      token,
      uid,
    });
    return Promise.resolve();
  };
};

export const commitLoginUserFailure = (error, message = null) => {
  if (typeof window !== `undefined`) {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('uid');
  }

  return async (dispatch) => {
    dispatch({
      type: COMMIT_LOGIN_USER_FAILURE,
      status: error.response.status,
      statusText: message || error.response.statusText,
    });
    return Promise.resolve();
  };
};

export const commitLogoutUser = () => {
  if (typeof window !== `undefined`) {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('uid');
  }

  return async (dispatch) => {
    dispatch({
      type: COMMIT_LOGOUT_USER,
    });
    return Promise.resolve();
  };
};

export const login = (username, password) => {
  return async (dispatch) => {
    await dispatch(commitLoginUserRequest());
    try {
      const response = await request.post(`${server.getBaseUrl()}/api/login`, {
        username: username,
        password: password,
      });

      try {
        jwtDecode(response.data.token);
        return dispatch(commitLoginUserSuccess(response.data.token, response.data.uid));
      } catch (e) {
        return dispatch(
          commitLoginUserFailure({
            response: {
              status: 403,
              statusText: 'Invalid token',
            },
          })
        );
      }
    } catch (error) {
      await dispatch(commitLoginUserFailure(error));
    }
  };
};

export const facebookLoginUrl = (facebookAppId) => {
  const httphost = typeof window !== `undefined` ? `${window.location.origin}` : '';
  return `https://www.facebook.com/v3.2/dialog/oauth?client_id=${facebookAppId}&response_type=token&redirect_uri=${httphost}/login/facebook`;
};

export const facebookLogin = (access_token, token = null) => {
  return async (dispatch) => {
    await dispatch(commitLoginUserRequest());
    try {
      const response = await request.post(
        `${server.getBaseUrl()}/api/login-facebook`,
        {
          access_token: access_token,
        },
        token === null
          ? {}
          : {
              headers: {
                'Uniflow-Authorization': `Bearer ${token}`,
              },
            }
      );

      try {
        jwtDecode(response.data.token);
        return dispatch(commitLoginUserSuccess(response.data.token, response.data.uid));
      } catch (e) {
        return dispatch(
          commitLoginUserFailure({
            response: {
              status: 403,
              statusText: 'Invalid token',
            },
          })
        );
      }
    } catch (error) {
      await dispatch(commitLoginUserFailure(error));
    }
  };
};

export const githubLoginUrl = (githubAppId) => {
  const httphost = typeof window !== `undefined` ? `${window.location.origin}` : '';
  return `https://github.com/login/oauth/authorize?client_id=${githubAppId}&redirect_uri=${httphost}/login/github`;
};

export const githubLogin = (code, token = null) => {
  return async (dispatch) => {
    await dispatch(commitLoginUserRequest());
    try {
      const response = await request.post(
        `${server.getBaseUrl()}/api/login-github`,
        {
          code: code,
        },
        token === null
          ? {}
          : {
              headers: {
                'Uniflow-Authorization': `Bearer ${token}`,
              },
            }
      );

      try {
        jwtDecode(response.data.token);
        return dispatch(commitLoginUserSuccess(response.data.token, response.data.uid));
      } catch (e) {
        return dispatch(
          commitLoginUserFailure({
            response: {
              status: 403,
              statusText: 'Invalid token',
            },
          })
        );
      }
    } catch (error) {
      await dispatch(commitLoginUserFailure(error));
    }
  };
};

export const register = (email, password) => {
  return async (dispatch) => {
    await dispatch(commitLoginUserRequest());
    try {
      const response = await request.post(`${server.getBaseUrl()}/api/users`, {
        email: email,
        password: password,
      });

      await login(email, password)(dispatch);
    } catch (error) {
      await dispatch(commitLoginUserFailure(error, error.response.data.message));
    }
  };
};
