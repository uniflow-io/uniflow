import React from 'react';
import Login, { LoginProps } from '../views/login/login';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const LoginPage = withPage<LoginProps>(Login, 'login', {
    location,
    title: 'Login',
    description: 'Login',
  });

  return <LoginPage />;
};
