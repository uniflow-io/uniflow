import request from 'axios';
import server from '../../utils/server';
import uniq from 'lodash/uniq';
import { COMMIT_UPDATE_SETTINGS, COMMIT_LOGOUT_USER } from './actions-types';
import { commitLogoutUser as commitAuthLogoutUser } from '../auth/actions';
import { commitAddLog } from '../logs/actions';

export const commitUpdateSettings = (user) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_UPDATE_SETTINGS,
      user,
    });
    return Promise.resolve();
  };
};

export const commitLogoutUser = () => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_LOGOUT_USER,
    });
    dispatch(commitAuthLogoutUser());
    return Promise.resolve();
  };
};

export const fetchConfig = (token, uid) => {
  return async (dispatch) => {
    try {
      return request.get(`${server.getBaseUrl()}/api/users/${uid}/admin-config`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (error.request.status === 401) {
        dispatch(commitLogoutUser());
      } else {
        throw error;
      }
    }
  };
};

export const updateConfig = (item, token, uid) => {
  return async (dispatch) => {
    const data = {
      ...item,
    };

    try {
      await request.put(`${server.getBaseUrl()}/api/users/${uid}/admin-config`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      });
      dispatch(data);
    } catch (error) {
      if (error.request.status === 400) {
        dispatch(commitAddLog(error.response.data.message));
      } else if (error.request.status === 401) {
        dispatch(commitLogoutUser());
      } else {
        throw error;
      }
    }
  };
};

export const fetchSettings = (uid, token) => {
  return async (dispatch) => {
    return request
      .get(`${server.getBaseUrl()}/api/users/${uid}/settings`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(commitUpdateSettings(response.data));
      })
      .catch((error) => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser());
        } else {
          throw error;
        }
      });
  };
};

export const updateSettings = (item, token) => {
  return async (dispatch) => {
    const data = {
      firstname: item.firstname,
      lastname: item.lastname,
      username: item.username,
      apiKey: item.apiKey,
      facebookId: item.facebookId,
      githubId: item.githubId,
    };

    try {
      const response = await request.put(
        `${server.getBaseUrl()}/api/users/${item.uid}/settings`,
        data,
        {
          headers: {
            'Uniflow-Authorization': `Bearer ${token}`,
          },
        }
      );
      dispatch(commitUpdateSettings(response.data));
      return data;
    } catch (error) {
      if (error.request.status === 400) {
        dispatch(commitAddLog(error.response.data.message));
      } else if (error.request.status === 401) {
        dispatch(commitLogoutUser());
      } else {
        throw error;
      }
    }
  };
};

export const isGranted = (user, attributes) => {
  if (!Array.isArray(attributes)) {
    attributes = [attributes];
  }

  let roles = ['ROLE_USER'];
  for (let i = 0; i < user.roles.length; i++) {
    const role = user.roles[i];
    if (role === 'ROLE_SUPER_ADMIN') {
      roles.push('ROLE_USER');
      roles.push('ROLE_SUPER_ADMIN');
    } else {
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
