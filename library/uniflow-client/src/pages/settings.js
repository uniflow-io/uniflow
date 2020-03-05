import React from 'react'
import { Settings } from '../views'
import { requireAuthentication, withPage } from '../helpers'

export default ({ location }) => {
  const AuthSettings = withPage(Settings, 'settings', {
    location: location,
    title: 'Settings',
    description: 'Settings',
  })
  const AuthSettingsPage = requireAuthentication(AuthSettings)

  return <AuthSettingsPage />
}
