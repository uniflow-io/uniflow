import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { pathTo } from '../../routes';
import { facebookLogin } from '../../contexts/auth';
import { commitAddLog } from '../../contexts/logs';
import { useAuth, useLogs } from '../../contexts';
import { WindowLocation } from '@reach/router';

export interface FacebookLoginProps {
  location: WindowLocation
}

function FacebookLogin(props: FacebookLoginProps) {
  const { authDispatch, authRef } = useAuth()
  const { logsDispatch } = useLogs()

  const getAccessToken = (): string|null => {
    const m = props.location.hash.match(/access_token=([^&]+)/);
    if (m) {
      return m[1];
    }

    return null;
  }

  useEffect(() => {
    (async () => {
      const accessToken = getAccessToken();
      if (accessToken === null) {
        return navigate(pathTo('login'));
      }

      await facebookLogin(accessToken, authRef.current.token)(authDispatch);
      if (authRef.current.isAuthenticated) {
        return navigate(pathTo('feed'));
      } else if(authRef.current.statusText) {
        commitAddLog(authRef.current.statusText)(logsDispatch);
        return navigate(pathTo('login'));
      }
    })()
  }, [])

  return (
    <section className="section container-fluid">
      <h3 className="box-title">Login Facebook</h3>
      <p className="text-center">Application is currently logging you from Facebook</p>
    </section>
  );
}

export default FacebookLogin;
