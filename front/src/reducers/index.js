import { combineReducers } from 'redux'
import auth from './auth/index'
import flow from './flow/index'
import history from './history/index'
import logs from './log/index'
import user from './user/index'

export default combineReducers({
    auth,
    flow,
    history,
    logs,
    user,
})
