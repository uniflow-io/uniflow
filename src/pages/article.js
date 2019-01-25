import React from 'react'
import {Article, NotFound} from '../views'
import Layout from "../layouts";
import routes from '../routes'
import {matchPath} from '../utils'

export default ({location}) => {
  let match = matchPath(location.pathname, {
    path: routes.article.path,
    exact: true
  })

  if(match) {
    return (
      <Layout location={location}><Article slug={match.params.slug}/></Layout>
    )
  }

  return (
    <Layout location={location}><NotFound/></Layout>
  )
}
