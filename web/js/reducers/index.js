import { combineReducers } from 'redux'
import flow from './flow/index'
import history from './history/index'
import log from './log/index'

export default combineReducers({
    flow,
    history,
    log
})