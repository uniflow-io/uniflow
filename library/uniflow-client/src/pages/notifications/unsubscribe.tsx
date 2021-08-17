import React from 'react';
import Notifications, { NotificationsProps } from '../../views/notifications';
import { withPage } from '../../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const NotificationPage = withPage<NotificationsProps>(Notifications, 'notifications', {
    location,
    title: 'Notifications Unsubscribe',
    description: 'Unsubscribe from your notifications',
  });

  return <NotificationPage location={location} />;
};
