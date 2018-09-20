import request from 'axios'
import server from '../../utils/server'
import components from '../../uniflow/components'
import {
    COMMIT_SET_COMPONENTS,
    COMMIT_UPDATE_SETTINGS,
} from './actionsTypes'

export const fetchComponents = () => {
    return (dispatch) => {
        let data = Object.keys(components);

        return request
            .post(server.getBaseUrl() + '/api/user/components', data)
            .then((response) => {
                dispatch(commitSetComponents(Object.values(response.data)))
            });
    }
}
export const fetchSettings = () => {
    return (dispatch) => {
        return request
            .get(server.getBaseUrl() + '/api/user/settings')
            .then((response) => {
                dispatch(commitUpdateSettings(response.data));
            });
    }
}
export const updateSettings = (item) => {
    return (dispatch) => {
        let data = {
            apiKey: item.apiKey
        };

        return request
            .post(server.getBaseUrl() + '/api/user/settings', data)
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

