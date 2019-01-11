import request from 'axios'
import server from '../../utils/server'
import { commitLogoutUser } from '../auth/actions'
import { commitAddLog } from '../logs/actions'

export const fetchConfig = (token) => {
  return (dispatch) => {
    return request
      .get(`${server.getBaseUrl()}/api/config/getConfig`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .catch((error) => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}
export const updateConfig = (item, token) => {
  return (dispatch) => {
    let data = {
      mediumToken: item.mediumToken
    }

    return request
      .put(`${server.getBaseUrl()}/api/config/setConfig`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        return data
      })
      .catch((error) => {
        if (error.request.status === 400) {
          dispatch(commitAddLog(error.response.data.message))
        } else if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}
