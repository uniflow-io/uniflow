import React from 'react'
import { combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { auth, env, feed, logs, rail, user, versions } from './reducers'
import { createStore } from './utils'
import { commitLoginUserSuccess } from './reducers/auth/actions'
import { commitSetEnv } from './reducers/env/actions'

let store = createStore(
  combineReducers({
    auth,
    env,
    feed,
    logs,
    rail,
    user,
    versions,
  })
)

const ENV = {
  env: process.env.GATSBY_ENV,
  apiUrl: process.env.GATSBY_API_URL,
  facebookAppId: process.env.GATSBY_FACEBOOK_APP_ID,
  githubAppId: process.env.GATSBY_GITHUB_APP_ID,
  mediumAppId: process.env.GATSBY_MEDIUM_APP_ID,
}
store.dispatch(commitSetEnv(ENV))

if (typeof window !== `undefined`) {
  let token = window.localStorage.getItem('token')
  if (token !== null) {
    store.dispatch(commitLoginUserSuccess(token))
  }
}

export default ({ element }) => <Provider store={store}>{element}</Provider>
