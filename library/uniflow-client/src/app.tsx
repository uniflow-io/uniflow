import React from "react"
import { combineReducers } from "redux"
import { Provider } from "react-redux"
import { app, auth, env, feed, logs, flows, user } from "./reducers"
import { createStore } from "./utils"
import { commitLoginUserSuccess } from "./reducers/auth/actions"
import { commitSetEnv } from "./reducers/env/actions"

let store = createStore(
  combineReducers({
    app,
    auth,
    env,
    feed,
    logs,
    flows,
    user,
  })
)

const ENV = {
  url: process.env.GATSBY_URL,
  apiUrl: process.env.GATSBY_API_URL,
  facebookAppId: process.env.GATSBY_FACEBOOK_APP_ID,
  githubAppId: process.env.GATSBY_GITHUB_APP_ID,
}
store.dispatch(commitSetEnv(ENV))

if (typeof window !== `undefined`) {
  let token = window.localStorage.getItem("token")
  let uid = window.localStorage.getItem("uid")
  if (token !== null) {
    store.dispatch(commitLoginUserSuccess(token, uid))
  }
}

export default ({ element }) => <Provider store={store}>{element}</Provider>
