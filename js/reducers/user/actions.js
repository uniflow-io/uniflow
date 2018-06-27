import request from 'axios'
import server from '../../utils/server'
import components from '../../uniflow/components'
import {
    COMMIT_SET_COMPONENTS,
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
export const commitSetComponents = (components) => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_SET_COMPONENTS,
            components
        })
        return Promise.resolve()
    }
}
