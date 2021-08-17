import React from 'react';
import Home, { HomeProps } from '../views/home';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const HomePage = withPage<HomeProps>(Home, 'home', {
    location,
    title: 'Uniflow',
    description: 'Unified Workflow Automation Tool',
  });

  return <HomePage />;
};
