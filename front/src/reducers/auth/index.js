import {
} from './actionsTypes'

const defaultState = {
    token: null,
    isAuthenticated: false,
    isAuthenticating: false,
}

const auth = (state = defaultState, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default auth
