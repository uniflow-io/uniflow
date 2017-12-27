import {
    COMMIT_PUSH_FLOW,
    COMMIT_POP_FLOW,
    COMMIT_UPDATE_FLOW,
    COMMIT_SET_FLOW,
} from './actionsTypes'

export const commitPushFlow = (index, component) => {
    return {
        type: COMMIT_PUSH_FLOW,
        index,
        component
    }
}
export const commitPopFlow = (index) => {
    return {
        type: COMMIT_POP_FLOW,
        index
    }
}
export const commitUpdateFlow = (index, data) => {
    return {
        type: COMMIT_UPDATE_FLOW,
        index,
        data
    }
}
export const commitSetFlow = (stack) => {
    return {
        type: COMMIT_SET_FLOW,
        stack
    }
}
