import request from 'axios'
import server from '../../utils/server'
import { ApiException } from '../../exceptions'

export const contact = (email, message) => {
  return dispatch => {
    return request
      .post(`${server.getBaseUrl()}/api/contacts`, {
        email: email,
        message: message,
      })
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw new ApiException(server.handleErrors(error.response))
      })
  }
}
