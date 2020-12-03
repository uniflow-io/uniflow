import React from "react"
import { Contact } from "../views"
import { withPage } from "../helpers"

export default ({ location }) => {
  const ContactPage = withPage(Contact, "contact", {
    location: location,
    title: "Contact",
    description: "Contact",
  })

  return <ContactPage />
}
