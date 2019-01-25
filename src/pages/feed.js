import React from 'react'
import {Article, Feed} from '../views'
import Layout from "../layouts";
import {requireAuthentication} from '../components'
import routes from '../routes'
import {matchPath} from '../utils'

const AuthFeed = requireAuthentication(Feed)

export default ({location}) => {
  let match = matchPath(location.pathname, {
    path: routes.feed.path,
    exact: true
  })

  if(match) {
    return (
      <Layout location={location}><AuthFeed/></Layout>
    )
  }

  return (
    <Layout location={location}><Feed/></Layout>
  )
}
