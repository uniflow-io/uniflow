import React, { FC } from 'react';
import Register, { RegisterProps } from '../views/login/register';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

const Page: FC<PageProps> = ({ location }) => {
  const RegisterPage = withPage<RegisterProps>(Register, 'register', {
    location,
    title: 'Register',
    description: 'Register',
  });

  return <RegisterPage />;
};

export default Page;
