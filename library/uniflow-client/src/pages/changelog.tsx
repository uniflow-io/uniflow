import React from "react"
import { Changelog } from "../views"
import { withPage } from "../helpers"

export default ({ location }) => {
  const ChangelogPage = withPage(Changelog, "changelog", {
    location: location,
    title: "ChangeLog",
    description: "ChangeLog",
  })

  return <ChangelogPage />
}
