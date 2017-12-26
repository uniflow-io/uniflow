import { combineReducers } from 'redux'
import flow from './flow/index'
import history from './history/index'

export default combineReducers({
    flow,
    history
})