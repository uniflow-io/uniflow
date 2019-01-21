import request from 'axios'
import server from '../../utils/server'
import {Log, Program, Folder} from '../../models/index'
import moment from 'moment'
import {
  COMMIT_CLEAR_FEED,
  COMMIT_UPDATE_FEED,
  COMMIT_DELETE_FEED,
  COMMIT_SET_CURRENT_FEED,
  COMMIT_SET_CURRENT_FOLDER,
  COMMIT_SET_CURRENT_USERNAME
} from './actionsTypes'
import {commitLogoutUser} from '../auth/actions'

export const getCurrentProgram = (state) => {
  return state.current ? state.items[`${state.current.type}_${state.current.id}`] : null
}
export const getCurrentPath = (state) => {
  let path = []
  if(state.folder) {
    path = state.folder.path.slice()
    path.push(state.folder.slug)
  }

  return path;
}

export const getOrderedFeed = (state, filter) => {
  let keys = Object.keys(state.items)

  if (filter !== undefined) {
    keys = keys.filter((key) => {
      let item  = state.items[key]
      let words = item.title
      if(item.constructor.name === 'Program') {
        for (let i = 0; i < item.tags.length; i++) {
          words += ' ' + item.tags[i]
        }
      }
      words = words.toLowerCase()

      return words.indexOf(filter) !== -1
    })
  }

  keys.sort((keyA, keyB) => {
    let itemA = state.items[keyA]
    let itemB = state.items[keyB]

    return itemB.updated.diff(itemA.updated)
  })

  return keys.map((key) => {
    return state.items[key]
  })
}

export const getProgramBySlug = (state, slug) => {
  let keys = Object.keys(state.items)

  let slugKeys = keys.filter((key) => {
    return state.items[key].constructor.name === 'Program' && state.items[key].slug === slug
  })

  if (slugKeys.length > 0) {
    return state.items[slugKeys[0]]
  }

  return null
}

export const getTags = (state) => {
  let tags = Object.keys(state.items).reduce(function (previous, key) {
    return previous.concat(state.items[key].tags)
  }, [])

  // filter unique
  tags = tags.filter(function (value, index, self) {
    return self.indexOf(value) === index
  })

  return tags
}

export const commitClearFeed          = () => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_CLEAR_FEED
    })
    return Promise.resolve()
  }
}
export const commitUpdateFeed         = (item) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_UPDATE_FEED,
      item
    })
    return Promise.resolve()
  }
}
export const commitDeleteFeed         = (item) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_DELETE_FEED,
      item
    })
    return Promise.resolve()
  }
}
export const commitSetCurrentFeed     = (current) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_SET_CURRENT_FEED,
      current
    })
    return Promise.resolve()
  }
}
export const commitSetCurrentFolder = (folder) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_SET_CURRENT_FOLDER,
      folder
    })
    return Promise.resolve()
  }
}
export const commitSetCurrentUsername    = (username) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_SET_CURRENT_USERNAME,
      username
    })
    return Promise.resolve()
  }
}

export const fetchFeed = (username, path, token = null) => {
  return (dispatch) => {
    let config = {}
    if (token) {
      config['headers'] = {
        'Uniflow-Authorization': `Bearer ${token}`
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/program/${username}/list/${path.join('/')}`, config)
      .then((response) => {
        dispatch(commitClearFeed())

        for (let i = 0; i < response.data['children'].length; i++) {
          let item            = null
          let {type, ...data} = response.data['children'][i]

          if (type === 'program') {
            item = new Program(data)
          } else if (type === 'folder') {
            item = new Folder(data)
          }

          dispatch(commitUpdateFeed(item))
        }

        dispatch(commitSetCurrentFolder(response.data['folder'] ? new Folder(response.data['folder']) : null))
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

export const createProgram = (item, token) => {
  return (dispatch) => {
    let data = {
      title: item.title,
      slug: item.title,
      path: item.path,
      client: item.client,
      tags: item.tags,
      description: item.description,
      public: false
    }

    return request
      .post(`${server.getBaseUrl()}/api/program/create`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        let item = new Program(response.data)

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

export const updateProgram = (item, token) => {
  return (dispatch) => {
    let data = {
      title: item.title,
      slug: item.slug,
      path: item.path,
      client: item.client,
      tags: item.tags,
      description: item.description,
      public: item.public
    }

    return request
      .put(`${server.getBaseUrl()}/api/program/update/${item.id}`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        let item = new Program(response.data)

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

export const getProgramData = (item, token = null) => {
  return (dispatch) => {
    let config = {}
    if (token) {
      config['headers'] = {
        'Uniflow-Authorization': `Bearer ${token}`
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/program/getData/${item.id}`, config)
      .then((response) => {
        return response.data.data
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

export const setProgramData = (item, token) => {
  return (dispatch) => {
    return request
      .put(`${server.getBaseUrl()}/api/program/setData/${item.id}`, item.data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        item.updated = moment()

        dispatch(commitUpdateFeed(item))

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

export const deleteProgram = (item, token) => {
  return (dispatch) => {
    return request
      .delete(`${server.getBaseUrl()}/api/program/delete/${item.id}`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        dispatch(commitDeleteFeed(item))

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

export const setCurrentProgram = (current) => {
  return (dispatch) => {
    dispatch(commitSetCurrentFeed(current))

    return Promise.resolve(current)
  }
}

export const setUsernameProgram = (username) => {
  return (dispatch) => {
    dispatch(commitSetCurrentUsername(username))

    return Promise.resolve(username)
  }
}

export const getLastPublicProgram = () => {
  return (dispatch) => {
    return request
      .get(`${server.getBaseUrl()}/api/program/last-public`)
      .then((response) => {
        return response.data.flow
      })
  }
}
