import request from 'axios'
import server from '../../utils/server'

export const contact = (email, message) => {
  return dispatch => {
    return request
      .post(`${server.getBaseUrl()}/api/contact/create`, {
        email: email,
        message: message,
      })
      .then(response => {
        return response.data
      })
  }
}
