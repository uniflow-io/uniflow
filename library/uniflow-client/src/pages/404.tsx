import React from 'react';
import NotFound, { NotFoundProps } from '../views/not-found';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const NotFoundPage = withPage<NotFoundProps>(NotFound, '404', {
    location,
    title: '404',
    description: '404',
  });

  return <NotFoundPage />;
};
