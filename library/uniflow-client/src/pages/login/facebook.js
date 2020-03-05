import React from 'react'
import { FacebookLogin } from '../../views'
import { withPage } from '../../helpers'

export default ({ location }) => {
  const FacebookLoginPage = withPage(FacebookLogin, 'facebook-login', {
    location: location,
    title: 'Login Facebook',
    description: 'Login Facebook',
  })

  return <FacebookLoginPage location={location} />
}
