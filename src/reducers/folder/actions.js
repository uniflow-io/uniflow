import request from 'axios'
import server from '../../utils/server'
import { Folder } from '../../models/index'
import { commitUpdateHistory } from '../history/actions'
import { commitLogoutUser } from '../auth/actions'

export const pathToSlugs = (path) => {
  let slugs = {}
  for(let i = 0; i < path.length; i++) {
    slugs[`slug${(i + 1)}`] = path[i]
  }

  return slugs;
}

export const createFolder = (item, token) => {
  return (dispatch) => {
    let data = {
      title: item.title,
      slug: item.title,
      path: item.path,
    }

    return request
      .post(`${server.getBaseUrl()}/api/folder/create`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        let item = new Folder(response.data)

        dispatch(commitUpdateHistory(item))

        return item
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
