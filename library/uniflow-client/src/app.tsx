import React from 'react';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { app, auth, feed, logs, flows, user } from './reducers';
import { commitLoginUserSuccess } from './reducers/auth/actions';

const store = createStore(
  combineReducers({
    app,
    auth,
    feed,
    logs,
    flows,
    user,
  }),
  undefined,
  applyMiddleware(thunk)
);

if (typeof window !== `undefined`) {
  const token = window.localStorage.getItem('token');
  const uid = window.localStorage.getItem('uid');
  if (token !== null) {
    store.dispatch(commitLoginUserSuccess(token, uid));
  }
}

export default ({ element }) => <Provider store={store}>{element}</Provider>;
