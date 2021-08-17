import React from 'react';
import FacebookLogin, { FacebookLoginProps } from '../../views/login/facebook';
import { withPage } from '../../helpers';
import { PageProps } from 'gatsby'

export default ({ location }: PageProps) => {
  const FacebookLoginPage = withPage<FacebookLoginProps>(FacebookLogin, 'facebook-login', {
    location,
    title: 'Login Facebook',
    description: 'Login Facebook',
  });

  return <FacebookLoginPage location={location} />;
};
