import {
    COMMIT_SET_COMPONENTS,
} from './actionsTypes'

const defaultState = {
    components: {}
}

const user = (state = defaultState, action) => {
    switch (action.type) {
        case COMMIT_SET_COMPONENTS:
            return {
                ...state,
                ...{components: action.components}
            }
        default:
            return state
    }
}

export default user