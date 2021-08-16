import React from 'react';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { app, auth, feed, logs, flows, user } from './reducers';
import { createStore } from './utils';
import { commitLoginUserSuccess } from './reducers/auth/actions';

const store = createStore(
  combineReducers({
    app,
    auth,
    feed,
    logs,
    flows,
    user,
  })
);

if (typeof window !== `undefined`) {
  const token = window.localStorage.getItem('token');
  const uid = window.localStorage.getItem('uid');
  if (token !== null) {
    store.dispatch(commitLoginUserSuccess(token, uid));
  }
}

export default ({ element }) => <Provider store={store}>{element}</Provider>;
