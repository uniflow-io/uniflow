import React from 'react'
import {Feed} from '../views'
import {requireAuthentication} from '../components'
import routes from '../routes'
import {matchPath} from '../utils'

const AuthFeed = requireAuthentication(Feed)

export default ({location}) => {
  let match = matchPath(location.pathname, {
    path: routes.feed.path,
    exact: true,
  })

  if (match) {
    return <AuthFeed/>
  }

  return <Feed/>
}
