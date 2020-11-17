import request from 'axios'
import server from '../../utils/server'

export const getFlows = () => {
  return async dispatch => {
    return request
      .get(`${server.getBaseUrl()}/api/programs`)
      .then(response => {
        return response.data
      })
      .catch(() => {
        return []
      })
  }
}