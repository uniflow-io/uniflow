import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { pathTo } from '../../routes';
import { facebookLogin } from '../../contexts/auth';
import { commitAddLog } from '../../contexts/logs';
import { useAuth, useLogs } from '../../contexts';
import { useLocation } from '@reach/router';
import { FC } from 'react';

export interface FacebookLoginProps {}

const FacebookLogin: FC<FacebookLoginProps> = (props) => {
  const { authDispatch, authRef } = useAuth();
  const { logsDispatch } = useLogs();
  const location = useLocation();

  const getAccessToken = (): string | null => {
    const m = location.hash.match(/access_token=([^&]+)/);
    if (m) {
      return m[1];
    }

    return null;
  };

  useEffect(() => {
    (async () => {
      const accessToken = getAccessToken();
      if (accessToken === null) {
        return navigate(pathTo('login'));
      }

      await facebookLogin(accessToken, authRef.current.token)(authDispatch);
      if (authRef.current.isAuthenticated) {
        navigate(pathTo('feed'));
      } else if (authRef.current.message) {
        commitAddLog(authRef.current.message)(logsDispatch);
        navigate(pathTo('login'));
      }
    })();
  }, []);

  return (
    <section className="section container-fluid">
      <h3 className="box-title">Login Facebook</h3>
      <p className="text-center">Application is currently logging you from Facebook</p>
    </section>
  );
};

export default FacebookLogin;
