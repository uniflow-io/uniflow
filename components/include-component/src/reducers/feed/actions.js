import request from 'axios'
import server from '../../utils/server'
import moment from 'moment'
import { Bus } from 'uniflow/src/models'

export const deserialiseFlowData = raw => {
  let objData = JSON.parse(raw)

  let data = []

  for (let i = 0; i < objData.length; i++) {
    data.push({
      component: objData[i].component,
      data: objData[i].data,
      bus: new Bus(),
    })
  }

  return data
}

export const getOrderedFeed = (state, filter) => {
  let keys = Object.keys(state.items)

  if (filter !== undefined) {
    keys = keys.filter(key => {
      let item = state.items[key]
      let words = item.title
      if (item.type === 'program') {
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

    return moment(itemB.updated).diff(moment(itemA.updated))
  })

  return keys.map(key => {
    return state.items[key]
  })
}

export const getProgramData = (item, token = null) => {
  return dispatch => {
    let config = {}
    if (token) {
      config['params'] = {
        bearer: token,
      }
    }

    return request
      .get(`${server.getBaseUrl()}/api/program/getData/${item.id}`, config)
      .then(response => {
        return response.data.data
      })
      /*.catch(error => {
        if (error.request.status === 401) {
          dispatch(commitLogoutUser())
        } else {
          throw error
        }
      })*/
  }
}
