import request from 'axios'
import server from '../../utils/server'
import { ApiException } from '../../exceptions'

export const createLead = ({email, optinNewsletter, optinBlog}) => {
  return async dispatch => {
    return request
      .post(`${server.getBaseUrl()}/api/leads`, {
        email,
        optinNewsletter,
        optinBlog,
      })
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw new ApiException(server.handleErrors(error.response))
      })
  }
}

export const getLead = (uid) => {
  return async dispatch => {
    return request
      .get(`${server.getBaseUrl()}/api/leads/${uid}`)
      .then(response => {
        return response.data
      })
  }
}

export const updateLead = (uid, {optinNewsletter, optinBlog, optinGithub}) => {
  return async dispatch => {
    return request
      .put(`${server.getBaseUrl()}/api/leads/${uid}`, {optinNewsletter, optinBlog, optinGithub})
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw new ApiException(server.handleErrors(error.response))
      })
  }
}
