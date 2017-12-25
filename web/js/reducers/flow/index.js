import {
    PUSH_FLOW,
    POP_FLOW,
    UPDATE_FLOW,
    SET_FLOW,
} from './actionsTypes'

const defaultState = []

const flow = (state = defaultState, action) => {
    switch (action.type) {
        case PUSH_FLOW:
            return [
                ...state.splice(action.index, 0, {
                    component: action.component,
                    bus: new Vue()
                })
            ]
        case POP_FLOW:
            return [
                ...state.splice(action.index, 1)
            ]
        case UPDATE_FLOW:
            return state.map((item, index) => {
                if (index !== action.index) {
                    return item;
                }

                return {
                    ...item,
                    ...action.data
                };
            })
        case SET_FLOW:
            return [
                ...state
            ]
        default:
            return state
    }
}

export default flow