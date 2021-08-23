import React, { useState } from 'react';
import { login, facebookLoginUrl, githubLoginUrl } from '../../contexts/auth';
import { pathTo } from '../../routes';
import { commitAddLog } from '../../contexts/logs';
import { Link, navigate } from 'gatsby';
import { faSignInAlt, faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../../container';
import { Env } from '../../services';
import { useAuth, useLogs } from '../../contexts';

const container = new Container();
const env = container.get(Env);

export interface LoginProps {
}

function Login(props: LoginProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { auth, authDispatch, authRef } = useAuth()
  const { logsDispatch } = useLogs()

  const onChangeUsername: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await login(username, password)(authDispatch);
    if (authRef.current.isAuthenticated) {
      navigate(pathTo('feed'));
    } else if(authRef.current.statusText) {
      commitAddLog(authRef.current.statusText)(logsDispatch);
    }
  };

  const facebookAppId = env.get('facebookAppId');
  const githubAppId = env.get('githubAppId')

  return (
    <section className="section container-fluid">
      <h3>Login</h3>
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <div className="card mb-3">
            <article className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row mb-3">
                  <div className="input-group">
                    <div className="input-group-text">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <input
                      className="form-control"
                      id="login-username"
                      type="text"
                      value={username || ''}
                      onChange={onChangeUsername}
                      placeholder="Email or Username"
                      autoComplete="login-username"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="input-group">
                    <div className="input-group-text">
                      <FontAwesomeIcon icon={faKey} />
                    </div>
                    <input
                      className="form-control"
                      id="login-password"
                      type="password"
                      value={password || ''}
                      onChange={onChangePassword}
                      placeholder="Password"
                      autoComplete="login-password"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={auth.isAuthenticating}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              {facebookAppId && (
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="d-grid">
                      <a
                        href={facebookLoginUrl(facebookAppId)}
                        className="btn btn-social btn-facebook"
                      >
                        <FontAwesomeIcon icon={faFacebookF} /> Login with Facebook
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {githubAppId && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-grid">
                      <a
                        href={githubLoginUrl(githubAppId)}
                        className="btn btn-social btn-github"
                      >
                        <FontAwesomeIcon icon={faGithub} /> Login with Github
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </article>
          </div>
          <p>
            <Link to={pathTo('register')}>
              <span className="glyphicon glyphicon-log-in register" aria-hidden="true" />{' '}
              <FontAwesomeIcon icon={faSignInAlt} /> Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
