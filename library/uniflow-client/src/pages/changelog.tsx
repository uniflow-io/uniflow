import React, { FC } from 'react';
import Changelog, { ChangelogProps } from '../views/changelog';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const ChangelogPage = withPage<ChangelogProps>(Changelog, 'changelog', {
    location,
    title: 'ChangeLog',
    description: 'ChangeLog',
  });

  return <ChangelogPage />;
};

export default Page