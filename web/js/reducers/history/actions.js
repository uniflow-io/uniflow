import request from 'axios'
import serverService from 'uniflow/services/server'
import History from 'uniflow/models/History'
import {
    COMMIT_CLEAR_HISTORY,
    COMMIT_UPDATE_HISTORY,
    COMMIT_DELETE_HISTORY,
    COMMIT_SET_CURRENT_HISTORY,
} from './actionsTypes'
import {COMMIT_UPDATE_FLOW} from "../flow/actionsTypes";

export const getCurrentHistory = (state) => {
    return state.current ? state.items[state.current] : null;
}

export const getTags = (state) => {
    let tags = Object.keys(state.items).reduce(function(previous, key) {
        return previous.concat(state.items[key].tags);
    }, []);

    //filter unique
    tags = tags.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });

    return tags;
}

export const commitClearHistory = () => {
    return {
        type: COMMIT_CLEAR_HISTORY
    }
}
export const commitUpdateHistory = (item) => {
    return {
        type: COMMIT_UPDATE_HISTORY,
        item
    }
}
export const commitDeleteHistory = (item) => {
    return {
        type: COMMIT_DELETE_HISTORY,
        item
    }
}
export const commitSetCurrentHistory = (current) => {
    return {
        type: COMMIT_SET_CURRENT_HISTORY,
        current
    }
}

export const fetchHistory = () => {
    return (dispatch) => {
        return request
            .get(serverService.getBaseUrl() + '/history/list')
            .then((response) => {
                dispatch(commitClearHistory(item));

                for (let i = 0; i < response.data.length; i++) {
                    let item = new History(response.data[i]);

                    dispatch(commitUpdateHistory(item));
                }
            });
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

                dispatch(commitUpdateHistory(item));

                return item;
            });
    }
}
export const updateHistory = (item) => {
    return (dispatch) => {
        let data = {
            title: item.title,
            tags: item.tags,
            description: item.description
        };

        return request
            .post(serverService.getBaseUrl() + '/history/edit/'+item.id, data)
            .then((response) => {
                let item = new History(response.data);

                dispatch(commitUpdateHistory(item));

                return item;
            });
    }
}
export const getHistoryData = (item) => {
    return (dispatch) => {
        return request
            .get(serverService.getBaseUrl() + '/history/getData/'+item.id)
            .then((response) => {
                return response.data.data;
            });
    }
}
export const setHistoryData = (item) => {
    return (dispatch) => {
        return request
            .post(serverService.getBaseUrl() + '/history/setData/'+item.id, item.data)
            .then((response) => {
                item.updated = moment();

                dispatch(commitUpdateHistory(item));

                return response.data;
            });
    }
}
export const deleteHistory = (item) => {
    return (dispatch) => {
        return request
            .delete(serverService.getBaseUrl() + '/history/delete/'+item.id)
            .then((response) => {
                dispatch(commitDeleteHistory(item));

                return response.data;
            });
    }
}
export const setCurrentHistory = (current) => {
    return (dispatch) => {
        dispatch(commitSetCurrentHistory(current))

        return Promise.resolve(current);
    }
}