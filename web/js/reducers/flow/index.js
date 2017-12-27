import {
    COMMIT_PUSH_FLOW,
    COMMIT_POP_FLOW,
    COMMIT_UPDATE_FLOW,
    COMMIT_SET_FLOW,
} from './actionsTypes'

const defaultState = []

const flow = (state = defaultState, action) => {
    switch (action.type) {
        case COMMIT_PUSH_FLOW:
            return [
                ...state.splice(action.index, 0, {
                    component: action.component,
                    bus: new Vue()
                })
            ]
        case COMMIT_POP_FLOW:
            return [
                ...state.splice(action.index, 1)
            ]
        case COMMIT_UPDATE_FLOW:
            return state.map((item, index) => {
                if (index !== action.index) {
                    return item;
                }

                return {
                    ...item,
                    ...action.data
                };
            })
        case COMMIT_SET_FLOW:
            return [
                ...state
            ]
        default:
            return state
    }
}

export default flow