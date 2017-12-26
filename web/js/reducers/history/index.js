import {
    CLEAR_HISTORY,
    UPDATE_HISTORY,
    DELETE_HISTORY,
    SET_CURRENT_HISTORY,
} from './actionsTypes'

const defaultState = {
    items: {},
    current: null,
}

const history = (state = defaultState, action) => {
    switch (action.type) {
        case CLEAR_HISTORY:
            return state;
        case UPDATE_HISTORY:
            return state;
        case DELETE_HISTORY:
            return state;
        case SET_CURRENT_HISTORY:
            context.commit('setCurrentHistory', current);

            return Promise.resolve(current);
        default:
            return state
    }
}

export default history