import request from 'axios'
import serverService from 'uniflow/services/server'
import History from 'uniflow/models/History'
import {
    CLEAR_HISTORY,
    UPDATE_HISTORY,
    DELETE_HISTORY,
    SET_CURRENT_HISTORY,
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
    return (dispatch) => {
        let data = {
            title: item.title,
            tags: item.tags,
            description: item.description
        };

        return request
            .post(serverService.getBaseUrl() + '/history/create', data)
            .then((response) => {
                let item = new History(response.data);

                dispatch(updateHistory(item));

                return item;
            });
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