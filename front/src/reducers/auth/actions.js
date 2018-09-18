import request from 'axios'
import server from '../../utils/server'
import jwtDecode from 'jwt-decode';
import {
    COMMIT_LOGIN_USER_REQUEST,
    COMMIT_LOGIN_USER_SUCCESS,
    COMMIT_LOGIN_USER_FAILURE,
    COMMIT_LOGOUT_USER,
} from './actionsTypes'

export const commitLoginUserRequest = () => {
    return (dispatch) => {
        dispatch({
            type: COMMIT_LOGIN_USER_REQUEST,
        })
        return Promise.resolve()
    }
}

export const commitLoginUserSuccess = (token) => {
    localStorage.setItem('token', token);

    return (dispatch) => {
        dispatch({
            type: COMMIT_LOGIN_USER_SUCCESS,
            token
        })
        return Promise.resolve()
    }
}

export const commitLoginUserFailure = (error) => {
    localStorage.removeItem('token');

    return (dispatch) => {
        dispatch({
            type: COMMIT_LOGIN_USER_FAILURE,
            status: error.response.status,
            statusText: error.response.statusText
        })
        return Promise.resolve()
    }
}

export const commitLogoutUser = () => {
    localStorage.removeItem('token');

    return (dispatch) => {
        dispatch({
            type: COMMIT_LOGOUT_USER,
        })
        return Promise.resolve()
    }
}

export const login = (username, password) => {
    return (dispatch) => {
        return dispatch(commitLoginUserRequest())
            .then(() => {
                return request
                    .post(server.getBaseUrl() + '/api/login_check', {
                        'username': username,
                        'password': password,
                    })
                    .then((response) => {
                        try {
                            let decoded = jwtDecode(response.data.token);
                            return dispatch(commitLoginUserSuccess(response.data.token));
                        } catch (e) {
                            return dispatch(commitLoginUserFailure({
                                response: {
                                    status: 403,
                                    statusText: 'Invalid token'
                                }
                            }));
                        }
                    })
                    .catch((error) => {
                        dispatch(commitLoginUserFailure(error));
                    })
                    ;
        })
    }
}
