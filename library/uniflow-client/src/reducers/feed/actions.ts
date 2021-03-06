import request from "axios"
import server from "../../utils/server"
import moment from "moment"
import {
  COMMIT_CLEAR_FEED,
  COMMIT_UPDATE_FEED,
  COMMIT_DELETE_FEED,
  COMMIT_SET_PARENT_FOLDER_FEED,
  COMMIT_SET_SLUG_FEED,
  COMMIT_SET_UID_FEED,
} from "./actions-types"
import { commitLogoutUser } from "../user/actions"
import { pathTo } from "../../routes"
import { Bus } from "../../models"

export const commitClearFeed = () => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_CLEAR_FEED,
    })
    return Promise.resolve()
  }
}

export const commitUpdateFeed = (item) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_UPDATE_FEED,
      item,
    })
    return Promise.resolve()
  }
}

export const commitDeleteFeed = (item) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_DELETE_FEED,
      item,
    })
    return Promise.resolve()
  }
}

export const commitSetParentFolderFeed = (parentFolder) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_SET_PARENT_FOLDER_FEED,
      parentFolder,
    })
    return Promise.resolve()
  }
}

export const commitSetSlugFeed = (slug) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_SET_SLUG_FEED,
      slug,
    })
    return Promise.resolve()
  }
}

export const commitSetUidFeed = (uid) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_SET_UID_FEED,
      uid,
    })
    return Promise.resolve()
  }
}

export const setParentFolderFeed = (parentFolder) => {
  return async (dispatch) => {
    dispatch(commitSetParentFolderFeed(parentFolder))

    return Promise.resolve(parentFolder)
  }
}

export const setSlugFeed = (slug) => {
  return async (dispatch) => {
    dispatch(commitSetSlugFeed(slug))

    return Promise.resolve(slug)
  }
}

export const setUidFeed = (uid) => {
  return async (dispatch) => {
    dispatch(commitSetUidFeed(uid))

    return Promise.resolve(uid)
  }
}

export const getFeedItem = (feed, slug = feed.slug) => {
  if (slug === undefined) return undefined

  if (slug === null && feed.parentFolder) {
    return {
      type: "folder",
      entity: feed.parentFolder,
    }
  }

  for (const item of Object.values(feed.items)) {
    if (item.entity.slug === slug) {
      return item
    }
  }

  return undefined
}

export const toFeedPath = (entity, user, toParent = false) => {
  let paths = entity.path === "/" ? [] : entity.path.split("/").slice(1)
  if (!toParent) {
    paths.push(entity.slug)
  }

  let slugs = {}
  for (let i = 0; i < paths.length; i++) {
    slugs[`slug${i + 1}`] = paths[i]
  }

  const isCurrentUser = entity.user === user.uid || entity.user === user.username
  if (isCurrentUser) {
    return pathTo("feed", slugs)
  }

  return pathTo("userFeed", Object.assign({ uid: entity.user }, slugs))
}

export const getTags = (state) => {
  let tags = Object.keys(state.items).reduce(function (previous, key) {
    return previous.concat(state.items[key].entity.tags)
  }, [])

  // filter unique
  tags = tags.filter(function (value, index, self) {
    return self.indexOf(value) === index
  })

  return tags
}

export const getOrderedFeed = (state, filter) => {
  let keys = Object.keys(state.items)

  if (filter !== undefined) {
    keys = keys.filter((key) => {
      const item = state.items[key]
      let words = []
      if (item.type === "program") {
        words.push(item.entity.name)
        for (let i = 0; i < item.entity.tags.length; i++) {
          words.push(item.entity.tags[i])
        }
      } else if (item.type === "folder") {
        words.push(item.entity.name)
      }
      words = words.join(" ").toLowerCase()

      return words.indexOf(filter) !== -1
    })
  }

  keys.sort((keyA, keyB) => {
    const itemA = state.items[keyA]
    const itemB = state.items[keyB]

    return moment(itemB.entity.updated).diff(moment(itemA.entity.updated))
  })

  return keys.map((key) => {
    return state.items[key]
  })
}

export const fetchFeed = (uid, paths, token = null) => {
  return async (dispatch) => {
    let config = {}
    if (token) {
      config = {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      }
    }

    const path = `/${paths.join("/")}`
    const parentPath = `/${paths.slice(0, -1).join("/")}`
    const parentParentPath = `/${paths.slice(0, -2).join("/")}`
    const slug = paths.length > 0 ? paths[paths.length - 1] : null
    const parentSlug = paths.length > 1 ? paths[paths.length - 2] : null
    let feedFolderPath = parentPath
    let feedProgramPath = parentPath
    let parentFolderFound = undefined

    dispatch(commitSetUidFeed(uid))
    dispatch(commitSetSlugFeed(slug))
    dispatch(commitSetParentFolderFeed(null))
    dispatch(commitClearFeed())
    if (paths.length > 0) {
      await request
        .get(`${server.getBaseUrl()}/api/users/${uid}/folders?path=${parentPath}`, config)
        .then((foldersResponse) => {
          parentFolderFound = false
          for (const folder of foldersResponse.data) {
            if (folder.path === parentPath && folder.slug === slug) {
              dispatch(commitSetSlugFeed(null))
              dispatch(commitSetParentFolderFeed(folder))
              feedFolderPath = path
              feedProgramPath = path
              parentFolderFound = true
            }
          }

          if (parentFolderFound === false) {
            for (const folder of foldersResponse.data) {
              dispatch(
                commitUpdateFeed({
                  type: "folder",
                  entity: folder,
                })
              )
            }
            feedFolderPath = parentParentPath
          }
        })
    }

    return Promise.all([
      request.get(`${server.getBaseUrl()}/api/users/${uid}/folders?path=${feedFolderPath}`, config),
      request.get(`${server.getBaseUrl()}/api/users/${uid}/programs?path=${feedProgramPath}`, config),
    ])
      .then(([foldersResponse, programsResponse]) => {
        if (parentFolderFound === true || parentFolderFound === undefined) {
          for (const folder of foldersResponse.data) {
            dispatch(
              commitUpdateFeed({
                type: "folder",
                entity: folder,
              })
            )
          }
        }
        if (parentFolderFound === false) {
          for (const folder of foldersResponse.data) {
            if (folder.path === parentParentPath && folder.slug === parentSlug) {
              dispatch(commitSetParentFolderFeed(folder))
            }
          }
        }

        for (const program of programsResponse.data) {
          dispatch(
            commitUpdateFeed({
              type: "program",
              entity: program,
            })
          )
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

export const serializeFlowsData = (flows) => {
  let data = []

  for (let i = 0; i < flows.length; i++) {
    data.push({
      flow: flows[i].flow,
      data: flows[i].data,
      codes: flows[i].codes,
    })
  }

  return JSON.stringify(data)
}

export const deserializeFlowsData = (raw) => {
  let data = JSON.parse(raw)

  let flows = []

  for (let i = 0; i < data.length; i++) {
    flows.push({
      flow: data[i].flow,
      data: data[i].data,
      codes: data[i].codes,
      bus: new Bus(),
    })
  }

  return flows
}

export const createProgram = (program, uid, token) => {
  return async (dispatch) => {
    let data = {
      name: program.name,
      slug: program.name,
      path: program.path,
      clients: program.clients,
      tags: program.tags,
      description: program.description,
    }

    return request
      .post(`${server.getBaseUrl()}/api/users/${uid}/programs`, data, {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        program = response.data

        dispatch(
          commitUpdateFeed({
            type: "program",
            entity: program,
          })
        )

        return program
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

export const updateProgram = (program, token) => {
  return async (dispatch) => {
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
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        program = response.data

        dispatch(
          commitUpdateFeed({
            type: "program",
            entity: program,
          })
        )

        return program
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

export const getProgramData = (program, token = null) => {
  return async (dispatch) => {
    let config = {}
    if (token) {
      config = {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/programs/${program.uid}/flows`, config)
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

export const setProgramData = (program, token) => {
  return async (dispatch) => {
    let data = {
      data: program.data,
    }

    return request
      .put(`${server.getBaseUrl()}/api/programs/${program.uid}/flows`, data, {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        program.updated = moment()

        dispatch(
          commitUpdateFeed({
            type: "program",
            entity: program,
          })
        )

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

export const deleteProgram = (program, token) => {
  return async (dispatch) => {
    return request
      .delete(`${server.getBaseUrl()}/api/programs/${program.uid}`, {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(
          commitDeleteFeed({
            type: "program",
            entity: program,
          })
        )

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

export const getFolderTree = (uid, token = null) => {
  return async (dispatch) => {
    let config = {}
    if (token) {
      config = {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/users/${uid}/folders`, config)
      .then((response) => {
        const folders = response.data
        let tree = ["/"]
        for (const folder of folders) {
          tree.push(`${folder.path === "/" ? "" : folder.path}/${folder.slug}`)
        }

        return tree.sort()
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

export const createFolder = (folder, uid, token) => {
  return async (dispatch) => {
    let data = {
      name: folder.name,
      slug: folder.name,
      path: folder.path,
    }

    return request
      .post(`${server.getBaseUrl()}/api/users/${uid}/folders`, data, {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        folder = response.data

        dispatch(
          commitUpdateFeed({
            type: "folder",
            entity: folder,
          })
        )

        return folder
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

export const updateParentFolder = (folder, token) => {
  return async (dispatch) => {
    let data = {
      name: folder.name,
      slug: folder.slug,
      path: folder.path,
    }

    return request
      .put(`${server.getBaseUrl()}/api/folders/${folder.uid}`, data, {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        folder = response.data

        dispatch(commitSetParentFolderFeed(folder))

        return folder
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

export const deleteParentFolder = (folder, token) => {
  return async (dispatch) => {
    return request
      .delete(`${server.getBaseUrl()}/api/folders/${folder.uid}`, {
        headers: {
          "Uniflow-Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(commitSetParentFolderFeed(undefined))

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
