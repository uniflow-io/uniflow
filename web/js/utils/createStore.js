import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

export default (reducers) => {
    return createStore(
        reducers,
        applyMiddleware(thunk)
    )
}