import React, { MutableRefObject, Reducer, RefObject, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import Container from '../container';
import { Api } from '../services';
import jwtDecode from 'jwt-decode';
import { useReducerRef } from '../hooks/use-reducer-ref';

const container = new Container();
const api = container.get(Api);

export enum AuthActionTypes {
  COMMIT_LOGIN_REQUEST = 'COMMIT_LOGIN_REQUEST',
  COMMIT_LOGIN_SUCCESS = 'COMMIT_LOGIN_SUCCESS',
  COMMIT_LOGIN_FAILURE = 'COMMIT_LOGIN_FAILURE',
  COMMIT_LOGOUT = 'COMMIT_LOGOUT',
}

export type AuthAction = 
  | { type: AuthActionTypes.COMMIT_LOGIN_REQUEST }
  | { type: AuthActionTypes.COMMIT_LOGIN_SUCCESS, token: string, uid: string }
  | { type: AuthActionTypes.COMMIT_LOGIN_FAILURE, status: number, statusText: string }
  | { type: AuthActionTypes.COMMIT_LOGOUT }

export type AuthDispath = React.Dispatch<AuthAction>

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthProviderState {
  token?: string,
  uid?: string,
  isAuthenticated: boolean,
  isAuthenticating: boolean,
  statusText?: string,
}

const defaultState = (() => {
  if(typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token');
    const uid = window.localStorage.getItem('uid');
    if (token && uid) {
      return {
        token: token,
        uid: uid,
        isAuthenticated: true,
        isAuthenticating: false,
        statusText: undefined,
      }
    }
  }

  return {
    token: undefined,
    uid: undefined,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: undefined,
  }
})();

export const commitLoginRequest = () => {
  return (dispatch: AuthDispath) => {
    dispatch({
      type: AuthActionTypes.COMMIT_LOGIN_REQUEST,
    });
  };
};

export const commitLoginSuccess = (token: string, uid: string) => {
  return (dispatch: AuthDispath) => {
    if (typeof window !== `undefined`) {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('uid', uid);
    }
    dispatch({
      type: AuthActionTypes.COMMIT_LOGIN_SUCCESS,
      token,
      uid,
    });
  };
};

export const commitLoginFailure = (error: {status: number, statusText: string}, message?: string) => {
  return (dispatch: AuthDispath) => {
    if (typeof window !== `undefined`) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('uid');
    }
    dispatch({
      type: AuthActionTypes.COMMIT_LOGIN_FAILURE,
      status: error.status,
      statusText: message || error.statusText,
    });
  };
};

export const commitLogout = () => {
  return (dispatch: AuthDispath) => {
    if (typeof window !== `undefined`) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('uid');
    }
    dispatch({
      type: AuthActionTypes.COMMIT_LOGOUT,
    });
  };
};

export const login = (username: string, password: string) => {
  return async (dispatch: AuthDispath) => {
    commitLoginRequest()(dispatch);
    try {
      const data = await api.login({username, password})

      try {
        jwtDecode(data.token);
        return commitLoginSuccess(data.token, data.uid)(dispatch);
      } catch (error) {
        return commitLoginFailure({
          status: 403,
          statusText: 'Invalid token',
        })(dispatch)
      }
    } catch (error) {
      commitLoginFailure(error.response)(dispatch);
    }
  };
};

export const facebookLoginUrl = (facebookAppId: string) => {
  const httphost = typeof window !== `undefined` ? `${window.location.origin}` : '';
  return `https://www.facebook.com/v3.2/dialog/oauth?client_id=${facebookAppId}&response_type=token&redirect_uri=${httphost}/login/facebook`;
};

export const facebookLogin = (accessToken: string, token?: string) => {
  return async (dispatch: AuthDispath) => {
    commitLoginRequest()(dispatch);
    try {
      const data = await api.loginFacebook({access_token: accessToken}, {token})

      try {
        jwtDecode(data.token);
        return commitLoginSuccess(data.token, data.uid)(dispatch);
      } catch (error) {
        return commitLoginFailure({
          status: 403,
          statusText: 'Invalid token',
        })(dispatch)
      }
    } catch (error) {
      commitLoginFailure(error.response)(dispatch);
    }
  };
};

export const githubLoginUrl = (githubAppId: string) => {
  const httphost = typeof window !== `undefined` ? `${window.location.origin}` : '';
  return `https://github.com/login/oauth/authorize?client_id=${githubAppId}&redirect_uri=${httphost}/login/github`;
};

export const githubLogin = (code: string, token?: string) => {
  return async (dispatch: AuthDispath) => {
    commitLoginRequest()(dispatch);
    try {
      const data = await api.loginGithub({code}, {token})
      try {
        jwtDecode(data.token);
        return commitLoginSuccess(data.token, data.uid)(dispatch);
      } catch (error) {
        return commitLoginFailure({
          status: 403,
          statusText: 'Invalid token',
        })(dispatch)
      }
    } catch (error) {
      commitLoginFailure(error.response)(dispatch);
    }
  };
};

export const register = (email: string, password: string) => {
  return async (dispatch: AuthDispath) => {
    commitLoginRequest()(dispatch);
    try {
      await api.createUser({email, password})
      await login(email, password)(dispatch);
    } catch (error) {
      commitLoginFailure(error.response, error.response.data.message)(dispatch);
    }
  };
};

export const AuthContext = React.createContext<{auth: AuthProviderState, authDispatch: AuthDispath, authRef: MutableRefObject<AuthProviderState> }>({
  auth: defaultState,
  authDispatch: () => {
    throw new Error('AuthContext not yet initialized.');
  },
  authRef: {
    current: defaultState
  },
});
AuthContext.displayName = 'AuthContext';

export function AuthProvider(props: AuthProviderProps) {
  const [auth, authDispatch, authRef] = useReducerRef<AuthProviderState, AuthAction>((state = defaultState, action) => {
    switch (action.type) {
      case AuthActionTypes.COMMIT_LOGIN_REQUEST:
        return Object.assign({}, state, {
          isAuthenticating: true,
          statusText: undefined,
        });
      case AuthActionTypes.COMMIT_LOGIN_SUCCESS:
        return Object.assign({}, state, {
          isAuthenticating: false,
          isAuthenticated: true,
          token: action.token,
          uid: action.uid,
          statusText: 'You have been successfully logged in.',
        });
      case AuthActionTypes.COMMIT_LOGIN_FAILURE:
        return Object.assign({}, state, {
          isAuthenticating: false,
          isAuthenticated: false,
          token: undefined,
          uid: undefined,
          statusText: `Authentication Error: ${action.status} ${action.statusText}`,
        });
      case AuthActionTypes.COMMIT_LOGOUT:
        return Object.assign({}, state, {
          isAuthenticated: false,
          token: undefined,
          uid: undefined,
          statusText: 'You have been successfully logged out.',
        });
      default:
        return state;
    }
  }, defaultState);

  return (
    <AuthContext.Provider value={{auth, authDispatch, authRef}}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const AuthConsumer = AuthContext.Consumer;

export function useAuth() {
  return useContext(AuthContext);
}
