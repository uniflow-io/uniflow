import request from 'axios'
import server from '../../utils/server'

export const getBlog = () => {
  return dispatch => {
    return request.get(`${ server.getBaseUrl() }/api/blog`).then(response => {
      return response.data
    })
  }
}

export const getArticle = slug => {
  return dispatch => {
    return request
      .get(`${ server.getBaseUrl() }/api/blog/${ slug }`)
      .then(response => {
        return response.data
      })
  }
}
