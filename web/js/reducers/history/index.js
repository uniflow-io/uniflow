import {
    PUSH_FLOW,
    POP_FLOW,
    UPDATE_FLOW,
    SET_FLOW,
} from './actionsTypes'

const defaultState = {
    items: {},
    current: null,
}

const flow = (state = defaultState, action) => {
    switch (action.type) {
        case PUSH_FLOW:
            state.stack.splice(action.index, 0, {
                component: action.component,
                bus: new Vue()
            })

            return [
                ...state
            ]
        case POP_FLOW:
            state.stack.splice(action.index, 1)
            
            return [
                ...state
            ]
        case UPDATE_FLOW:
            state.stack[action.index].data = action.data
            
            return [
                ...state
            ]
        case SET_FLOW:
            state.stack = action.stack
            
            return [
                ...state
            ]
        default:
            return state
    }
}

export default flow