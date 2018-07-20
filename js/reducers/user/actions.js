import request from 'axios'
import server from '../../utils/server'
import components from '../../uniflow/components'
import {
    COMMIT_SET_COMPONENTS,
    COMMIT_UPDATE_PROFILE,
} from './actionsTypes'

export const fetchComponents = () => {
    return (dispatch) => {
        let data = Object.keys(components);

        return request
            .post(server.getBaseUrl() + '/user/components', data)
            .then((response) => {
                dispatch(commitSetComponents(Object.values(response.data)))
            });
    }
}
export const fetchProfile = () => {
    return (dispatch) => {
        return request
            .get(server.getBaseUrl() + '/user/profile')
            .then((response) => {
                dispatch(commitUpdateProfile(response.data));
            });
    }
}
export const updateProfile = (item) => {
    return (dispatch) => {
        let data = {
            apiKey: item.apiKey
        };

        return request
            .post(server.getBaseUrl() + '/user/profile', data)
            .then((response) => {
                dispatch(commitUpdateProfile(data));

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
export const commitUpdateProfile = (item) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_UPDATE_PROFILE,
            item
        })
        return Promise.resolve()
    }
}

