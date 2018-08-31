import request from 'axios'
import server from '../../utils/server'
import {Log,History} from '../../models/index'
import moment from 'moment'
import {
    COMMIT_CLEAR_HISTORY,
    COMMIT_UPDATE_HISTORY,
    COMMIT_DELETE_HISTORY,
    COMMIT_SET_CURRENT_HISTORY,
} from './actionsTypes'

export const getCurrentHistory = (state) => {
    return state.current ? state.items[state.current] : null;
}

export const getOrderedHistory = (state, filter) => {
    let keys = Object.keys(state.items);

    if (filter !== undefined) {
        keys = keys.filter((key) => {
            let item  = state.items[key];
            let words = item.title;
            for (let i = 0; i < item.tags.length; i++) {
                words += ' ' + item.tags[i];
            }
            words = words.toLowerCase();

            return words.indexOf(filter) !== -1;
        });
    }

    keys.sort((keyA, keyB) => {
        let itemA = state.items[keyA],
            itemB = state.items[keyB];

        return itemB.updated.diff(itemA.updated);
    });

    return keys.map((key) => {
        return state.items[key];
    });
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
    return (dispatch) => {
        dispatch({
            type: COMMIT_CLEAR_HISTORY
        })
        return Promise.resolve()
    }
}
export const commitUpdateHistory = (item) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_UPDATE_HISTORY,
            item
        })
        return Promise.resolve()
    }
}
export const commitDeleteHistory = (item) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_DELETE_HISTORY,
            item
        })
        return Promise.resolve()
    }
}
export const commitSetCurrentHistory = (current) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_SET_CURRENT_HISTORY,
            current
        })
        return Promise.resolve()
    }
}

export const fetchHistory = () => {
    return (dispatch) => {
        return request
            .get(server.getBaseUrl() + '/history/list')
            .then((response) => {
                dispatch(commitClearHistory());

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
            platform: item.platform,
            tags: item.tags,
            description: item.description
        };

        return request
            .post(server.getBaseUrl() + '/history/create', data)
            .then((response) => {
                let item = new History(response.data);

                dispatch(commitUpdateHistory(item));

                return item;
            })
            .catch(() => {
                return Promise.reject(new Log({message: 'Create failed', code: Log.HISTORY_CREATE_FAIL}))
            })
        ;
    }
}
export const updateHistory = (item) => {
    return (dispatch) => {
        let data = {
            title: item.title,
            platform: item.platform,
            tags: item.tags,
            description: item.description
        };

        return request
            .post(server.getBaseUrl() + '/history/edit/'+item.id, data)
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
            .get(server.getBaseUrl() + '/history/getData/'+item.id)
            .then((response) => {
                return response.data.data;
            });
    }
}
export const setHistoryData = (item) => {
    return (dispatch) => {
        return request
            .post(server.getBaseUrl() + '/history/setData/'+item.id, item.data)
            .then((response) => {
                item.updated = moment();

                dispatch(commitUpdateHistory(item));

                return response.data;
            })
            .catch(() => {
                return Promise.reject(new Log({message: 'Update data fail', code: Log.HISTORY_DATA_SET_FAIL}))
            })
        ;
    }
}
export const deleteHistory = (item) => {
    return (dispatch) => {
        return request
            .delete(server.getBaseUrl() + '/history/delete/'+item.id)
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