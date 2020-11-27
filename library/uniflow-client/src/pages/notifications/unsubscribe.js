import React from 'react'
import { Notifications } from '../../views'
import { withPage } from '../../helpers'

export default ({ location }) => {
  const NotificationPage = withPage(Notifications, 'notifications', {
    location: location,
    title: 'Notifications Unsubscribe',
    description: 'Unsubscribe from your notifications',
  })

  return <NotificationPage location={location} />
}
