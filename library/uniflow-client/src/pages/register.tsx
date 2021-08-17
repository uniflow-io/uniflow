import React from 'react';
import Register, { RegisterProps } from '../views/login/register';
import { withPage } from '../helpers';
import { PageProps } from 'gatsby';

export default ({ location }: PageProps) => {
  const RegisterPage = withPage<RegisterProps>(Register, 'register', {
    location,
    title: 'Register',
    description: 'Register',
  });

  return <RegisterPage />;
};
