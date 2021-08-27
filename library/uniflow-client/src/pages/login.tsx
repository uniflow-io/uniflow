import React, { FC } from 'react';
import Login, { LoginProps } from '../views/login/login';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const LoginPage = withPage<LoginProps>(Login, 'login', {
    location,
    title: 'Login',
    description: 'Login',
  });

  return <LoginPage />;
};

export default Page