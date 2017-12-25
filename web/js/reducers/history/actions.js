import {
    PUSH_FLOW,
    POP_FLOW,
    UPDATE_FLOW,
    SET_FLOW,
} from './actionsTypes'

export const pushFlow = (index, component) => {
    return {
        type: PUSH_FLOW,
        index,
        component
    }
}
export const popFlow = (index) => {
    return {
        type: POP_FLOW,
        index
    }
}
export const updateFlow = (index, data) => {
    return {
        type: UPDATE_FLOW,
        index,
        data
    }
}
export const setFlow = (stack) => {
    return {
        type: SET_FLOW,
        stack
    }
}
