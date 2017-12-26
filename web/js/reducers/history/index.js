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
            return state;
        case UPDATE_HISTORY:
            return state;
        case DELETE_HISTORY:
            return state;
        case SET_CURRENT_HISTORY:
            return state;
        case GET_HISTORY_DATA:
            return state;
        case SET_HISTORY_DATA:
            return state;
        default:
            return state
    }
}

export default history