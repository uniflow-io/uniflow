import React from "react"
import { graphql } from "gatsby"
import { Feed } from "../views"
import { requireAuthentication, withPage } from "../helpers"
import routes from "../routes"
import { matchPath } from "../../src/utils"

export default ({ location, data: { localFlows } }) => {
  let allFlows = {}
  localFlows.nodes.forEach((flow) => {
    allFlows[flow.name] = flow.uniflow
  })

  const FeedPage = withPage(Feed, "feed", {
    location: location,
    title: "Feed",
    description: "Feed",
  })
  const AuthFeedPage = requireAuthentication(FeedPage)

  const match = matchPath(location.pathname, {
    path: routes.feed.path,
    exact: true,
  })
  if (match) {
    return <AuthFeedPage flows={allFlows} />
  }

  return <FeedPage flows={allFlows} />
}

export const query = graphql`
  query {
    localFlows: allNpmLocalPackage(filter: { fields: { catalogs: { in: "flow" } } }) {
      nodes {
        name
        uniflow {
          clients
          name
          tags
        }
      }
    }
  }
`
