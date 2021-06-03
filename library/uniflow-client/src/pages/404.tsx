import React from "react"
import { NotFound } from "../views"
import { withPage } from "../helpers"

export default ({ location }) => {
  const NotFoundPage = withPage(NotFound, "404", {
    location: location,
    title: "404",
    description: "404",
  })

  return <NotFoundPage />
}
