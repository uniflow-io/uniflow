import {
    COMMIT_ADD_LOG,
    COMMIT_READ_LOG,
} from './actionsTypes'

const defaultState = []

const log = (state = defaultState, action) => {
    switch (action.type) {
        case COMMIT_ADD_LOG:
            let newStateAdd = state.slice()
            newStateAdd.splice(action.index, 0, {
                message: action.message,
                code: action.code,
                status: 'new'
            })
            return newStateAdd
        case COMMIT_READ_LOG:
            return state.map((item, index) => {
                if (index !== action.index) {
                    return item;
                }

                return {
                    ...item,
                    ...{status: 'read'}
                };
            })
        default:
            return state
    }
}

export default log