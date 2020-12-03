import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"

export default (reducer, preloadedState) => {
  return createStore(reducer, preloadedState, applyMiddleware(thunk))
}
