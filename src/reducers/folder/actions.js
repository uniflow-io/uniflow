import request from 'axios'
import server from '../../utils/server'
import {Folder} from '../../models/index'
import {commitSetCurrentFolder, commitUpdateFeed} from '../program/actions'
import { commitLogoutUser } from '../auth/actions'

export const pathToSlugs = (path) => {
  let slugs = {}
  for(let i = 0; i < path.length; i++) {
    slugs[`slug${(i + 1)}`] = path[i]
  }

  return slugs;
}

export const pathToString = (path) => {
  return `/${path.join('/')}`
}

export const stringToPath = (value) => {
  if(value === '/') {
    return []
  }
  return value.slice(1).split('/')
}

export const getFolderTree = (username, token = null) => {
  return (dispatch) => {
    let config = {}
    if (token) {
      config['headers'] = {
        'Uniflow-Authorization': `Bearer ${token}`
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/folder/${username}/tree`, config)
      .then((response) => {
        return response.data
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

        dispatch(commitUpdateFeed(item))

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

export const updateCurrentFolder = (item, token) => {
  return (dispatch) => {
    let data = {
      title: item.title,
      slug: item.slug,
      path: item.path,
    }

    return request
      .put(`${server.getBaseUrl()}/api/folder/update/${item.id}`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        let item = new Folder(response.data)

        dispatch(commitSetCurrentFolder(item))

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

export const deleteCurrentFolder = (item, token) => {
  return (dispatch) => {
    return request
      .delete(`${server.getBaseUrl()}/api/folder/delete/${item.id}`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        //dispatch(commitSetCurrentFolder(null))

        return response.data
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
