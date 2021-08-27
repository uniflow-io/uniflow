import React, { FC } from 'react';
import Home, { HomeProps } from '../views/home';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const HomePage = withPage<HomeProps>(Home, 'home', {
    location,
    title: 'Uniflow',
    description: 'Unified Workflow Automation Tool',
  });

  return <HomePage />;
};

export default Page;
