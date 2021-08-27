import React, { FC } from 'react';
import Notifications, { NotificationsProps } from '../../views/notifications';
import { withPage } from '../../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const NotificationPage = withPage<NotificationsProps>(Notifications, 'notifications', {
    location,
    title: 'Notifications Unsubscribe',
    description: 'Unsubscribe from your notifications',
  });

  return <NotificationPage />;
};

export default Page