import React, { MutableRefObject, Reducer, RefObject, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import Container from '../container';
import { Api } from '../services';
import jwtDecode, { InvalidTokenError } from 'jwt-decode';
import { useReducerRef } from '../hooks/use-reducer-ref';
import ApiNotAuthorizedException from '../models/api-not-authorized-exception';
import { FC } from 'react';

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
  | { type: AuthActionTypes.COMMIT_LOGIN_FAILURE, message: string }
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
  message?: string,
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
        message: undefined,
      }
    }
  }

  return {
    token: undefined,
    uid: undefined,
    isAuthenticated: false,
    isAuthenticating: false,
    message: undefined,
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

export const commitLoginFailure = (message: string) => {
  return (dispatch: AuthDispath) => {
    if (typeof window !== `undefined`) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('uid');
    }
    dispatch({
      type: AuthActionTypes.COMMIT_LOGIN_FAILURE,
      message,
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
      jwtDecode(data.token);
      commitLoginSuccess(data.token, data.uid)(dispatch);
    } catch (error) {
      if(error instanceof InvalidTokenError) {
        commitLoginFailure('Invalid token')(dispatch)
      } else {
        commitLoginFailure('Invalid credentials')(dispatch);
      }

      throw error
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
      jwtDecode(data.token);
      commitLoginSuccess(data.token, data.uid)(dispatch);
    } catch (error) {
      if(error instanceof InvalidTokenError) {
        commitLoginFailure('Invalid token')(dispatch)
      } else {
        commitLoginFailure('Invalid credentials')(dispatch);
      }

      throw error
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
      jwtDecode(data.token);
      commitLoginSuccess(data.token, data.uid)(dispatch);
    } catch (error) {
      if(error instanceof InvalidTokenError) {
        commitLoginFailure('Invalid token')(dispatch)
      } else {
        commitLoginFailure('Invalid credentials')(dispatch);
      }

      throw error
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
      if(error instanceof InvalidTokenError) {
        commitLoginFailure('Invalid token')(dispatch)
      } else {
        commitLoginFailure('Invalid credentials')(dispatch);
      }

      throw error
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

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const [auth, authDispatch, authRef] = useReducerRef<AuthProviderState, AuthAction>((state = defaultState, action) => {
    switch (action.type) {
      case AuthActionTypes.COMMIT_LOGIN_REQUEST:
        return Object.assign({}, state, {
          isAuthenticating: true,
          message: undefined,
        });
      case AuthActionTypes.COMMIT_LOGIN_SUCCESS:
        return Object.assign({}, state, {
          isAuthenticating: false,
          isAuthenticated: true,
          token: action.token,
          uid: action.uid,
          message: 'You have been successfully logged in.',
        });
      case AuthActionTypes.COMMIT_LOGIN_FAILURE:
        return Object.assign({}, state, {
          isAuthenticating: false,
          isAuthenticated: false,
          token: undefined,
          uid: undefined,
          message: `Authentication Error: ${action.message}`,
        });
      case AuthActionTypes.COMMIT_LOGOUT:
        return Object.assign({}, state, {
          isAuthenticated: false,
          token: undefined,
          uid: undefined,
          message: 'You have been successfully logged out.',
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
