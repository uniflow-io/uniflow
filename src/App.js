import React from 'react'
import { combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { auth, env, feed, logs, user, versions } from './reducers'
import { flow } from 'uniflow/src/reducers'
import { createStore } from 'uniflow/src/utils'
import { commitLoginUserSuccess } from './reducers/auth/actions'
import { commitSetEnv } from './reducers/env/actions'

let store = createStore(
  combineReducers({
    auth,
    env,
    flow,
    feed,
    logs,
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
