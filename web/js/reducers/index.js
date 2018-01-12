import { combineReducers } from 'redux'
import flow from './flow/index'
import history from './history/index'
import user from './user/index'
import logs from './log/index'

export default combineReducers({
    flow,
    history,
    user,
    logs
})