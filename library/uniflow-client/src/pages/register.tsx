import React from 'react';
import { Register } from '../views';
import { withPage } from '../helpers';

export default ({ location }) => {
  const RegisterPage = withPage(Register, 'register', {
    location: location,
    title: 'Register',
    description: 'Register',
  });

  return <RegisterPage />;
};
