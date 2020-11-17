import request from 'axios'
import server from '../../utils/server'
import moment from 'moment'
import {
  COMMIT_CLEAR_FEED,
  COMMIT_UPDATE_FEED,
  COMMIT_DELETE_FEED,
  COMMIT_SET_CURRENT_SLUG,
  COMMIT_SET_CURRENT_FOLDER_PATH,
  COMMIT_SET_CURRENT_UID,
} from './actions-types'
import { commitLogoutUser } from '../auth/actions'
import { pathTo } from '../../routes'
import { Bus } from '../../models'

export const serializeRailData = (rail) => {
  let data = []

  for (let i = 0; i < rail.length; i++) {
    data.push({
      flow: rail[i].flow,
      data: rail[i].data,
      codes: rail[i].codes,
    })
  }

  return JSON.stringify(data)
}

export const deserializeRailData = raw => {
  let data = JSON.parse(raw)

  let rail = []

  for (let i = 0; i < data.length; i++) {
    rail.push({
      flow: data[i].flow,
      data: data[i].data,
      codes: data[i].codes,
      bus: new Bus(),
    })
  }

  return rail
}

export const commitClearFeed = () => {
  return async dispatch => {
    dispatch({
      type: COMMIT_CLEAR_FEED,
    })
    return Promise.resolve()
  }
}
export const commitUpdateFeed = item => {
  return async dispatch => {
    dispatch({
      type: COMMIT_UPDATE_FEED,
      item,
    })
    return Promise.resolve()
  }
}
export const commitDeleteFeed = item => {
  return async dispatch => {
    dispatch({
      type: COMMIT_DELETE_FEED,
      item,
    })
    return Promise.resolve()
  }
}
export const commitSetCurrentSlug = slug => {
  return async dispatch => {
    dispatch({
      type: COMMIT_SET_CURRENT_SLUG,
      slug,
    })
    return Promise.resolve()
  }
}
export const commitSetCurrentFolderPath = folderPath => {
  return async dispatch => {
    dispatch({
      type: COMMIT_SET_CURRENT_FOLDER_PATH,
      folderPath,
    })
    return Promise.resolve()
  }
}
export const commitSetCurrentUid = uid => {
  return async dispatch => {
    dispatch({
      type: COMMIT_SET_CURRENT_UID,
      uid,
    })
    return Promise.resolve()
  }
}

export const setCurrentSlug = slug => {
  return async dispatch => {
    dispatch(commitSetCurrentSlug(slug))

    return Promise.resolve(slug)
  }
}

export const setCurrentFolderPath = folderPath => {
  return async dispatch => {
    dispatch(commitSetCurrentFolderPath(folderPath))

    return Promise.resolve(folderPath)
  }
}

export const setCurrentUid = uid => {
  return async dispatch => {
    dispatch(commitSetCurrentUid(uid))

    return Promise.resolve(uid)
  }
}

export const getCurrentItem = state => {
  if(!state.slug) return null

  for(const [key, item] of Object.entries(state.items)) {
    if(item.entity.slug === state.slug) {
      return item
    }
  }

  return null
}

const entityToSlugs = entity => {
  let paths = entity.path === '/' ? [] : entity.path.split('/').slice(1)
  paths.push(entity.slug)
  
  let slugs = {}
  for (let i = 0; i < paths.length; i++) {
    slugs[`slug${i + 1}`] = paths[i]
  }

  return slugs
}

export const feedPathTo = (entity, user = null) => {
  const slugs = entityToSlugs(entity)

  const isCurrentUser = user && (entity.user === user.uid || entity.user === user.username)
  if (isCurrentUser) {
    return pathTo('feed', slugs)
  }
  
  return pathTo('userFeed', Object.assign({ uid: entity.user }, slugs))
}

export const pathsToPath = paths => {
  return `/${paths.join('/')}`
}

export const pathToPaths = path => {
  return path === '/' ? [] : path.split('/').slice(1)
}

export const getPublicPrograms = () => {
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

export const getTags = state => {
  let tags = Object.keys(state.items).reduce(function(previous, key) {
    return previous.concat(state.items[key].tags)
  }, [])

  // filter unique
  tags = tags.filter(function(value, index, self) {
    return self.indexOf(value) === index
  })

  return tags
}

export const getOrderedFeed = (state, filter) => {
  let keys = Object.keys(state.items)

  if (filter !== undefined) {
    keys = keys.filter(key => {
      const item = state.items[key]
      let words = []
      if (item.type === 'program') {
        words.push(item.entity.name)
        for (let i = 0; i < item.entity.tags.length; i++) {
          words .push(item.entity.tags[i])
        }
      } else if (item.type === 'folder') {
        words.push(item.entity.name)
      }
      words = words.join(' ').toLowerCase()

      return words.indexOf(filter) !== -1
    })
  }

  keys.sort((keyA, keyB) => {
    const itemA = state.items[keyA]
    const itemB = state.items[keyB]

    return moment(itemB.entity.updated).diff(moment(itemA.entity.updated))
  })

  return keys.map(key => {
    return state.items[key]
  })
}

export const getProgramBySlug = (state, slug) => {
  let keys = Object.keys(state.items)

  let slugKeys = keys.filter(key => {
    return state.items[key].type === 'program' && state.items[key].slug === slug
  })

  if (slugKeys.length > 0) {
    return state.items[slugKeys[0]]
  }

  return null
}

export const fetchFeed = (uid, path, token = null) => {
  return async dispatch => {
    let config = {}
    if (token) {
      config = {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        }
      }
    }

    return Promise.all([
        request.get(`${server.getBaseUrl()}/api/users/${uid}/programs?path=${path}`, config),
        request.get(`${server.getBaseUrl()}/api/users/${uid}/folders?path=${path}`, config)
      ])
      .then(([programsResponse, foldersResponse]) => {
        dispatch(commitClearFeed())

        for (const folder of foldersResponse.data) {
          dispatch(commitUpdateFeed({
            type: 'folder',
            entity: folder,
          }))
        }
        for (const program of programsResponse.data) {
          dispatch(commitUpdateFeed({
            type: 'program',
            entity: program,
          }))
        }
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const createProgram = (program, uid, token) => {
  return async dispatch => {
    let data = {
      name: program.name,
      slug: program.name,
      path: program.path,
      clients: program.clients,
      tags: program.tags,
      description: program.description,
      public: false,
    }

    return request
      .post(`${server.getBaseUrl()}/api/users/${uid}/programs`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        program = response.data

        dispatch(commitUpdateFeed({
          type: 'program',
          entity: program
        }))

        return program
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const updateProgram = (program, token) => {
  return async dispatch => {
    let data = {
      name: program.name,
      slug: program.slug,
      path: program.path,
      clients: program.clients,
      tags: program.tags,
      description: program.description,
      public: program.public,
    }

    return request
      .put(`${server.getBaseUrl()}/api/programs/${program.uid}`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        program = response.data

        dispatch(commitUpdateFeed({
          type: 'program',
          entity: program
        }))

        return program
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const getProgramData = (program, token = null) => {
  return async dispatch => {
    let config = {}
    if (token) {
      config = {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        }
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/programs/${program.uid}/flows`, config)
      .then(response => {
        return response.data.data
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const setProgramData = (program, token) => {
  return async dispatch => {
    let data = {
      data: program.data,
    }
    
    return request
      .put(`${server.getBaseUrl()}/api/programs/${program.uid}/flows`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        program.updated = moment()

        dispatch(commitUpdateFeed({
          type: 'program',
          entity: program
        }))

        return response.data
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const deleteProgram = (program, token) => {
  return async dispatch => {
    return request
      .delete(`${server.getBaseUrl()}/api/programs/${program.uid}`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        dispatch(commitDeleteFeed(program))

        return response.data
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const getFolderTree = (uid, token = null) => {
  return async dispatch => {
    let config = {}
    if (token) {
      config = {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        }
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/folder/${uid}/tree`, config)
      .then(response => {
        return response.data
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const createFolder = (folder, uid, token) => {
  return async dispatch => {
    let data = {
      name: folder.name,
      slug: folder.name,
      path: folder.path,
    }

    return request
      .post(`${server.getBaseUrl()}/api/users/${uid}/folders`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        folder = response.data

        dispatch(commitUpdateFeed({
          type: 'folder',
          entity: folder,
        }))

        return folder
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const updateCurrentFolder = (folder, token) => {
  return async dispatch => {
    let data = {
      name: folder.name,
      slug: folder.slug,
      path: folder.path,
    }

    return request
      .put(`${server.getBaseUrl()}/api/folders/${folder.uid}`, data, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        folder = response.data

        dispatch(commitSetCurrentFolderPath(folder))

        return folder
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}

export const deleteCurrentFolder = (folder, token) => {
  return async dispatch => {
    return request
      .delete(`${server.getBaseUrl()}/api/folders/${folder.uid}`, {
        headers: {
          'Uniflow-Authorization': `Bearer ${token}`,
        },
      })
      .then(response => {
        // dispatch(commitSetCurrentFolderPath(null))

        return response.data
      })
      .catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })
  }
}
