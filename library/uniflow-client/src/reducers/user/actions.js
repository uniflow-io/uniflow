import request from 'axios'
import server from '../../utils/server'
import uniq from 'lodash/uniq'
import { COMMIT_UPDATE_SETTINGS } from './actions-types'
import { commitLogoutUser } from '../auth/actions'
import { commitAddLog } from '../logs/actions'

export const fetchSettings = (uid, token) => {
  return dispatch => {
    return request
      .get(`${server.getBaseUrl()}/api/users/${uid}/settings`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        dispatch(commitUpdateSettings(response.data))
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}
export const updateSettings = (item, token) => {
  return async dispatch => {
    const data = {
      firstname: item.firstname,
      lastname: item.lastname,
      username: item.username,
      apiKey: item.apiKey,
      facebookId: item.facebookId,
      githubId: item.githubId,
    }

    try {
      await request
        .put(`${server.getBaseUrl()}/api/users/${item.uid}/settings`, data, {
          headers: {
            'Uniflow-Authorization': `Bearer ${token}`,
          },
        })
      dispatch(commitUpdateSettings(data))
      return data
    } catch (error) {
      if (error.request.status === 400) {
        dispatch(commitAddLog(error.response.data.message))
      } else if (error.request.status === 401) {
        dispatch(commitLogoutUser())
      } else {
        throw error
      }
    }
  }
}
export const commitUpdateSettings = user => {
  return dispatch => {
    dispatch({
      type: COMMIT_UPDATE_SETTINGS,
      user,
    })
    return Promise.resolve()
  }
}
export const isGranted = (user, attributes) => {
  if (!Array.isArray(attributes)) {
    attributes = [attributes]
  }

  let roles = ['ROLE_USER']
  for (let i = 0; i < user.roles.length; i++) {
    let role = user.roles[i]
    if (role === 'ROLE_SUPER_ADMIN') {
      roles.push('ROLE_USER')
      roles.push('ROLE_SUPER_ADMIN')
    } else {
      roles.push(role)
    }
  }
  roles = uniq(roles)

  for (let i = 0; i < attributes.length; i++) {
    let attribute = attributes[i]
    for (let j = 0; j < roles.length; j++) {
      let role = roles[j]

      if (attribute === role) {
        return true
      }
    }
  }

  return false
}
