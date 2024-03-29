import React, { MutableRefObject, useContext } from 'react';
import Container from '../container';
import { Api } from '../services';
import uniq from 'lodash/uniq';
import { AuthDispath, commitLogout } from './auth';
import { LogsDispath } from './logs';
import { useReducerRef } from '../hooks/use-reducer-ref';
import { ROLE, UserApiType } from '../models/api-type-interfaces';
import { ApiNotAuthorizedException } from '../models/api-exceptions';
import { FC } from 'react';

const container = new Container();
const api = container.get(Api);

export enum UserActionTypes {
  COMMIT_UPDATE_SETTINGS = 'COMMIT_UPDATE_SETTINGS',
  COMMIT_LOGOUT = 'COMMIT_LOGOUT',
}

export type UserAction =
  | { type: UserActionTypes.COMMIT_UPDATE_SETTINGS; user: UserProviderState }
  | { type: UserActionTypes.COMMIT_LOGOUT };

export type UserDispath = React.Dispatch<UserAction>;

export interface UserProviderProps {
  children: React.ReactNode;
}

export interface UserProviderState {
  uid?: string;
  username?: string | null;
  email?: string;
  firstname?: string | null;
  lastname?: string | null;
  facebookId?: string | null;
  githubId?: string | null;
  apiKey?: string | null;
  roles: ROLE[];
  links: {
    lead?: string;
  };
}

const defaultState = {
  uid: undefined,
  apiKey: undefined,
  username: undefined,
  email: undefined,
  firstname: undefined,
  lastname: undefined,
  facebookId: undefined,
  githubId: undefined,
  roles: [],
  links: {
    lead: undefined,
  },
};

export const commitUpdateSettings = (user: UserProviderState) => {
  return (dispatch: UserDispath) => {
    dispatch({
      type: UserActionTypes.COMMIT_UPDATE_SETTINGS,
      user,
    });
  };
};

export const commitLogoutUser = () => {
  return (dispatch: UserDispath, authDispath: AuthDispath) => {
    dispatch({
      type: UserActionTypes.COMMIT_LOGOUT,
    });
    commitLogout()(authDispath);
  };
};

export const fetchConfig = (token: string, uid: string) => {
  return async (dispatch: UserDispath, authDispath: AuthDispath) => {
    try {
      return await api.getAdminConfig({ uid }, { token });
    } catch (error) {
      if (error instanceof ApiNotAuthorizedException) {
        commitLogoutUser()(dispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const updateConfig = (item: object, token: string, uid: string) => {
  return async (dispatch: UserDispath, authDispath: AuthDispath, logsDispatch: LogsDispath) => {
    const data = {
      ...item,
    };

    try {
      await api.updateAdminConfig({ uid }, data, { token });
    } catch (error) {
      if (error instanceof ApiNotAuthorizedException) {
        commitLogoutUser()(dispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const fetchSettings = (uid: string, token: string) => {
  return async (dispatch: UserDispath, authDispath: AuthDispath) => {
    try {
      const user = await api.getUserSettings({ uid }, { token });
      commitUpdateSettings(user)(dispatch);
    } catch (error) {
      if (error instanceof ApiNotAuthorizedException) {
        commitLogoutUser()(dispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const updateSettings = (item: Partial<UserProviderState>, token: string) => {
  return async (dispatch: UserDispath, authDispath: AuthDispath, logsDispatch: LogsDispath) => {
    const data = {
      firstname: item.firstname,
      lastname: item.lastname,
      username: item.username,
      apiKey: item.apiKey,
      facebookId: item.facebookId,
      githubId: item.githubId,
    };

    try {
      if(item.uid) {
        const user = await api.updateUserSettings({ uid: item.uid }, data, { token });
        commitUpdateSettings(user)(dispatch);
        return user;
      }
    } catch (error) {
      if (error instanceof ApiNotAuthorizedException) {
        commitLogoutUser()(dispatch, authDispath);
      } else {
        throw error;
      }
    }
  };
};

export const isGranted = (user: UserProviderState, attributes: string | string[]) => {
  if (!Array.isArray(attributes)) {
    attributes = [attributes];
  }

  let roles = [ROLE.USER];
  for (let i = 0; i < user.roles.length; i++) {
    const role = user.roles[i];
    if (role === ROLE.SUPER_ADMIN) {
      roles.push(ROLE.USER);
      roles.push(ROLE.SUPER_ADMIN);
    } else if(role) {
      roles.push(role);
    }
  }
  roles = uniq(roles);

  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i];
    for (let j = 0; j < roles.length; j++) {
      const role = roles[j];

      if (attribute === role) {
        return true;
      }
    }
  }

  return false;
};

export const UserContext = React.createContext<{
  user: UserProviderState;
  userDispatch: UserDispath;
  userRef: MutableRefObject<UserProviderState>;
}>({
  user: defaultState,
  userDispatch: () => {
    throw new Error('UserContext not yet initialized.');
  },
  userRef: {
    current: defaultState,
  },
});
UserContext.displayName = 'UserContext';

export const UserProvider: FC<UserProviderProps> = (props) => {
  const [user, userDispatch, userRef] = useReducerRef<UserProviderState, UserAction>(
    (state: UserProviderState = defaultState, action: UserAction) => {
      switch (action.type) {
        case UserActionTypes.COMMIT_UPDATE_SETTINGS:
          return {
            ...state,
            ...action.user,
          };
        case UserActionTypes.COMMIT_LOGOUT:
          return {
            ...defaultState,
          };
        default:
          return state;
      }
    },
    defaultState
  );

  return (
    <UserContext.Provider value={{ user, userDispatch, userRef }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const UserConsumer = UserContext.Consumer;

export function useUser() {
  return useContext(UserContext);
}
