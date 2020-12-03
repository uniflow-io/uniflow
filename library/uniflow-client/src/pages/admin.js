import React from "react"
import { Admin } from "../views"
import { requireAuthentication, withPage } from "../helpers"

export default ({ location }) => {
  const AdminPage = withPage(Admin, "admin", {
    location: location,
    title: "Admin",
    description: "Admin",
  })
  const AuthAdminPage = requireAuthentication(AdminPage, "ROLE_SUPER_ADMIN")

  return <AuthAdminPage />
}
