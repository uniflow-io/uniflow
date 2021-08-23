import React, { useEffect } from 'react';
import { navigate } from 'gatsby';
import { pathTo } from '../../routes';
import { githubLogin } from '../../contexts/auth';
import { commitAddLog } from '../../contexts/logs';
import { useAuth, useLogs } from '../../contexts';
import { WindowLocation } from '@reach/router';

export interface GithubLoginProps {
  location: WindowLocation
}

function GithubLogin(props: GithubLoginProps) {
  const { authDispatch, authRef } = useAuth()
  const { logsDispatch } = useLogs()

  const getCode = ():string|null => {
    const m = props.location.search.match(/code=([^&]+)/);
    if (m) {
      return m[1];
    }

    return null;
  }

  useEffect(() => {
    (async () => {
      const code = getCode();
      if (code === null) {
        return navigate(pathTo('login'));
      }

      await githubLogin(code, authRef.current.token)(authDispatch);
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
      <h3 className="box-title">Login Github</h3>
      <p className="text-center">Application is currently logging you from Github</p>
    </section>
  );
}

export default GithubLogin;
