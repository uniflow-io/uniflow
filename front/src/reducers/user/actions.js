import request from 'axios'
import server from '../../utils/server'
import components from '../../uniflow/components'
import {
    COMMIT_SET_COMPONENTS,
    COMMIT_UPDATE_SETTINGS,
} from './actionsTypes'

export const fetchComponents = (token) => {
    return (dispatch) => {
        let data = Object.keys(components);

        return request
            .put(server.getBaseUrl() + '/api/user/components', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                dispatch(commitSetComponents(Object.values(response.data)))
            });
    }
}
export const fetchSettings = (token) => {
    return (dispatch) => {
        return request
            .get(server.getBaseUrl() + '/api/user/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                dispatch(commitUpdateSettings(response.data));
            });
    }
}
export const updateSettings = (item, token) => {
    return (dispatch) => {
        let data = {
            apiKey: item.apiKey
        };

        return request
            .put(server.getBaseUrl() + '/api/user/settings', data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((response) => {
                dispatch(commitUpdateSettings(data));

                return data;
            });
    }
}
export const commitSetComponents = (components) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_SET_COMPONENTS,
            components
        })
        return Promise.resolve()
    }
}
export const commitUpdateSettings = (item) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_UPDATE_SETTINGS,
            item
        })
        return Promise.resolve()
    }
}

