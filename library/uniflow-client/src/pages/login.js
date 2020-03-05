import React from 'react'
import { Login } from '../views'
import { withPage } from '../helpers'

export default ({ location }) => {
  const LoginPage = withPage(Login, 'login', {
    location: location,
    title: 'Login',
    description: 'Login',
  })

  return <LoginPage />
}
