import {Log} from '../../models'
import {COMMIT_ADD_LOG, COMMIT_READ_LOG} from './actionsTypes'

let id = 1
const defaultState = {}

const logs = (state = defaultState, action) => {
  switch (action.type) {
    case COMMIT_ADD_LOG:
      let item = new Log({
        id: id,
        message: action.message,
        status: 'new',
      })
      id++

      state[item.id] = item
      return {
        ...state,
      }
    case COMMIT_READ_LOG:
      return Object.keys(state).map(key => {
        let item = state[key]
        if (item.id !== action.id) {
          return item
        }

        return {
          ...item,
          ...{status: 'read'},
        }
      })
    default:
      return state
  }
}

export default logs
