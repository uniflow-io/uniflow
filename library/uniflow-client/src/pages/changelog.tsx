import React from 'react';
import Changelog, { ChangelogProps } from '../views/changelog';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const ChangelogPage = withPage<ChangelogProps>(Changelog, 'changelog', {
    location,
    title: 'ChangeLog',
    description: 'ChangeLog',
  });

  return <ChangelogPage />;
};
