import React, { FC } from 'react';
import GithubLogin, { GithubLoginProps } from '../../views/login/github';
import { withPage } from '../../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const GithubLoginPage = withPage<GithubLoginProps>(GithubLogin, 'github-login', {
    location,
    title: 'Login Github',
    description: 'Login Github',
  });

  return <GithubLoginPage />;
};

export default Page;
