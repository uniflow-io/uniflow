import React, { ComponentType } from 'react';
import { pathTo } from '../routes';
import { isGranted, UserProviderState, useUser } from '../contexts/user';
import { navigate } from 'gatsby';
import { useAuth } from '../contexts';
import { useEffect } from 'react';
import { ROLE } from '../models/api-type-interface';

export default function requireAuthentication<T>(Component: ComponentType<T>, role: ROLE = ROLE.USER) {
  function requireAuthenticationHelper(props: T) {
    const { auth } = useAuth()
    const { user } = useUser()

    const checkAuth = (isAuthenticated: boolean, user: UserProviderState) => {
      if (!isAuthenticated || (user.uid && !isGranted(user, role))) {
        if (typeof window !== `undefined`) {
          navigate(pathTo('login'));
        }
      }
    };

    useEffect(() => {
      checkAuth(auth.isAuthenticated, user);
    }, [auth.token])

    if (auth.isAuthenticated === true) {
      return <Component {...props} />;
    }

    return null;
  }

  return requireAuthenticationHelper;
}
