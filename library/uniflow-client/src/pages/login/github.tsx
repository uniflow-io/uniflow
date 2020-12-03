import React from "react"
import { GithubLogin } from "../../views"
import { withPage } from "../../helpers"

export default ({ location }) => {
  const GithubLoginPage = withPage(GithubLogin, "github-login", {
    location: location,
    title: "Login Github",
    description: "Login Github",
  })

  return <GithubLoginPage location={location} />
}
