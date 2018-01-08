import {
    COMMIT_ADD_LOG,
    COMMIT_READ_LOG,
} from './actionsTypes'

export const commitAddLog = (message, code) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_ADD_LOG,
            message,
            code
        })
        return Promise.resolve()
    }
}
export const commitReadLog = (index) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_READ_LOG,
            index
        })
        return Promise.resolve()
    }
}