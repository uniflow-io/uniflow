import request from 'axios'
import server from '../../utils/server'
import { ApiException } from '../../exceptions'

export const newsletter = (email) => {
  return async dispatch => {
    return request
      .post(`${server.getBaseUrl()}/api/leads`, {
        email: email,
      })
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw new ApiException(server.handleErrors(error.response))
      })
  }
}
