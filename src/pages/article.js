import React from 'react'
import { Article, NotFound } from '../views'
import routes from '../routes'
import { matchPath } from '../utils'

export default ({ location }) => {
  let match = matchPath(location.pathname, {
    path: routes.article.path,
    exact: true,
  })

  if (match) {
    return <Article slug={match.params.slug} />
  }

  return <NotFound />
}
