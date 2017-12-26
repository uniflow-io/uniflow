import {
    CLEAR_HISTORY,
    FETCH_HISTORY,
    CREATE_HISTORY,
    UPDATE_HISTORY,
    DELETE_HISTORY,
    SET_CURRENT_HISTORY,
    GET_HISTORY_DATA,
    SET_HISTORY_DATA,
} from './actionsTypes'

export const clearHistory = () => {
    return {
        type: CLEAR_HISTORY
    }
}
export const fetchHistory = () => {
    return {
        type: FETCH_HISTORY
    }
}
export const createHistory = (item) => {
    return {
        type: CREATE_HISTORY,
        item
    }
}
export const updateHistory = (item) => {
    return {
        type: UPDATE_HISTORY,
        item
    }
}
export const deleteHistory = (item) => {
    return {
        type: DELETE_HISTORY,
        item
    }
}
export const setCurrentHistory = (current) => {
    return {
        type: SET_CURRENT_HISTORY,
        current
    }
}
export const getHistoryData = (item) => {
    return {
        type: GET_HISTORY_DATA,
        item
    }
}
export const setHistoryData = (item) => {
    return {
        type: SET_HISTORY_DATA,
        item
    }
}