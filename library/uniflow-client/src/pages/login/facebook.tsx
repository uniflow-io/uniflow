import React, { FC } from 'react';
import FacebookLogin, { FacebookLoginProps } from '../../views/login/facebook';
import { withPage } from '../../helpers';
import { PageProps } from 'gatsby'

const Page: FC<PageProps> = ({ location }) => {
  const FacebookLoginPage = withPage<FacebookLoginProps>(FacebookLogin, 'facebook-login', {
    location,
    title: 'Login Facebook',
    description: 'Login Facebook',
  });

  return <FacebookLoginPage />;
};

export default Page