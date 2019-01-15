import request from 'axios'
import server from '../../utils/server'
import {Log, History, Folder} from '../../models/index'
import moment from 'moment'
import {
  COMMIT_CLEAR_HISTORY,
  COMMIT_UPDATE_HISTORY,
  COMMIT_DELETE_HISTORY,
  COMMIT_SET_CURRENT_HISTORY,
  COMMIT_SET_CURRENT_PATH,
  COMMIT_SET_CURRENT_USERNAME
} from './actionsTypes'
import {commitLogoutUser} from '../auth/actions'

export const getCurrentHistory = (state) => {
  return state.current ? state.items[state.current] : null
}

export const getOrderedHistory = (state, filter) => {
  let keys = Object.keys(state.items)

  if (filter !== undefined) {
    keys = keys.filter((key) => {
      let item  = state.items[key]
      let words = item.title
      for (let i = 0; i < item.tags.length; i++) {
        words += ' ' + item.tags[i]
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

export const getHistoryBySlug = (state, slug) => {
  let keys = Object.keys(state.items)

  let slugKeys = keys.filter((key) => {
    return state.items[key].slug === slug
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

export const commitClearHistory          = () => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_CLEAR_HISTORY
    })
    return Promise.resolve()
  }
}
export const commitUpdateHistory         = (item) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_UPDATE_HISTORY,
      item
    })
    return Promise.resolve()
  }
}
export const commitDeleteHistory         = (item) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_DELETE_HISTORY,
      item
    })
    return Promise.resolve()
  }
}
export const commitSetCurrentHistory     = (current) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_SET_CURRENT_HISTORY,
      current
    })
    return Promise.resolve()
  }
}
export const commitSetCurrentPath = (path) => {
  return (dispatch) => {
    dispatch({
      type: COMMIT_SET_CURRENT_PATH,
      path
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

export const fetchHistory = (username, path, token = null) => {
  return (dispatch) => {
    let config = {}
    if (token) {
      config['headers'] = {
        'Uniflow-Authorization': `Bearer ${token}`
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/history/${username}/list/all/${path.join('/')}`, config)
      .then((response) => {
        dispatch(commitClearHistory())

        for (let i = 0; i < response.data.length; i++) {
          let item            = null
          let {type, ...data} = response.data[i]

          if (type === 'history') {
            item = new History(data)
          } else if (type === 'folder') {
            item = new Folder(data)
          }

          dispatch(commitUpdateHistory(item))
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

export const createHistory = (item, token) => {
  return (dispatch) => {
    let data = {
      title: item.title,
      slug: item.title,
      client: item.client,
      tags: item.tags,
      description: item.description,
      public: false
    }

    return request
      .post(`${server.getBaseUrl()}/api/history/create`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        let item = new History(response.data)

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

export const updateHistory = (item, token) => {
  return (dispatch) => {
    let data = {
      title: item.title,
      slug: item.slug,
      client: item.client,
      tags: item.tags,
      description: item.description,
      public: item.public
    }

    return request
      .put(`${server.getBaseUrl()}/api/history/update/${item.id}`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        let item = new History(response.data)

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

export const getHistoryData = (item, token = null) => {
  return (dispatch) => {
    let config = {}
    if (token) {
      config['headers'] = {
        'Uniflow-Authorization': `Bearer ${token}`
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/history/getData/${item.id}`, config)
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

export const setHistoryData = (item, token) => {
  return (dispatch) => {
    return request
      .put(`${server.getBaseUrl()}/api/history/setData/${item.id}`, item.data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        item.updated = moment()

        dispatch(commitUpdateHistory(item))

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

export const deleteHistory = (item, token) => {
  return (dispatch) => {
    return request
      .delete(`${server.getBaseUrl()}/api/history/delete/${item.id}`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        dispatch(commitDeleteHistory(item))

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

export const setCurrentHistory = (current) => {
  return (dispatch) => {
    dispatch(commitSetCurrentHistory(current))

    return Promise.resolve(current)
  }
}

export const setUsernameHistory = (username) => {
  return (dispatch) => {
    dispatch(commitSetCurrentUsername(username))

    return Promise.resolve(username)
  }
}

export const getLastPublicHistory = () => {
  return (dispatch) => {
    return request
      .get(`${server.getBaseUrl()}/api/history/last-public`)
      .then((response) => {
        return response.data.flow
      })
  }
}
