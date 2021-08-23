import React from 'react';
import GithubLogin, { GithubLoginProps } from '../../views/login/github';
import { withPage } from '../../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const GithubLoginPage = withPage<GithubLoginProps>(GithubLogin, 'github-login', {
    location,
    title: 'Login Github',
    description: 'Login Github',
  });

  return <GithubLoginPage />;
};
