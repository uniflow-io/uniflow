import React from 'react'
import { MediumLogin } from '../../views'
import { withPage } from '../../helpers'

export default ({ location }) => {
  const MediumLoginPage = withPage(MediumLogin, 'medium-login', {
    location: location,
    title: 'Login Medium',
    description: 'Login Medium',
  })

  return <MediumLoginPage location={location} />
}
