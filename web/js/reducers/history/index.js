import request from 'axios'
import serverService from 'uniflow/services/server'
import History from 'uniflow/models/History'
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

const defaultState = {
    items: {},
    current: null,
}

const history = (state = defaultState, action) => {
    switch (action.type) {
        case CLEAR_HISTORY:
            return state;
        case FETCH_HISTORY:
            return state;
        case CREATE_HISTORY:
            return (dispatch, getState) => {
                let data = {
                    title: item.title,
                    tags: item.tags,
                    description: item.description
                };

                return request
                    .post(serverService.getBaseUrl() + '/history/create', data)
                    .then((response) => {
                        let item = new History(response.data);

                        context.commit('updateHistory', item);

                        return item;
                    });
            }
        case UPDATE_HISTORY:
            return state;
        case DELETE_HISTORY:
            return state;
        case SET_CURRENT_HISTORY:
            context.commit('setCurrentHistory', current);

            return Promise.resolve(current);
        case GET_HISTORY_DATA:
            return state;
        case SET_HISTORY_DATA:
            return state;
        default:
            return state
    }
}

export default history