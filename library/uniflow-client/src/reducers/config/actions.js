import request from 'axios'
import server from '../../utils/server'
import { commitLogoutUser } from '../auth/actions'
import { commitAddLog } from '../logs/actions'

export const fetchConfig = (token, uid) => {
  return async dispatch => {
    try {
      return request
        .get(`${server.getBaseUrl()}/api/users/${uid}/admin-config`, {
          headers: {
            'Uniflow-Authorization': `Bearer ${token}`,
          },
        })
    } catch (error) {
      if (error.request.status === 401) {
        dispatch(commitLogoutUser())
      } else {
        throw error
      }
    }
  }
}
export const updateConfig = (item, token, uid) => {
  return async dispatch => {
    const data = {
      ...item
    }

    try {
      await request
        .put(`${server.getBaseUrl()}/api/users/${uid}/admin-config`, data, {
          headers: {
            'Uniflow-Authorization': `Bearer ${token}`,
          },
        })
      dispatch(data)
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
