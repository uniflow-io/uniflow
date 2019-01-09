import {
    COMMIT_SET_ENV,
} from './actionsTypes'

const defaultState = {
    facebookAppId: null,
    githubAppId: null,
    mediumAppId: null,
}

const env = (state = defaultState, action) => {
    switch (action.type) {
        case COMMIT_SET_ENV:
            return {
                ...state,
                ...action.env
            }
        default:
            return state
    }
}

export default env
