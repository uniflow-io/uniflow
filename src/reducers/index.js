import { combineReducers } from 'redux'
import auth from './auth/index'
import env from './env/index'
import history from './history/index'
import logs from './logs/index'
import user from './user/index'
import versions from './versions/index'

export default combineReducers({
    auth,
    env,
    history,
    logs,
    user,
    versions,
})
