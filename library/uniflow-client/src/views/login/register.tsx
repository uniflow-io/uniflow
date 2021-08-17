import React, { useState } from 'react';
import { register, facebookLoginUrl, githubLoginUrl } from '../../contexts/auth';
import { pathTo } from '../../routes';
import { commitAddLog } from '../../contexts/logs';
import { navigate } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';
import Container from '../../container';
import { Env } from '../../services';
import { useAuth, useLogs } from '../../contexts';

const container = new Container();
const env = container.get(Env);

export interface RegisterProps {
}

function Register(props: RegisterProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { auth, authDispatch, authRef } = useAuth()
  const { logsDispatch } = useLogs()

  const onChangeEmail: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.target.value);
  };

  const onChangePassword: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await register(email, password)(authDispatch);
    if (authRef.current.isAuthenticated) {
      return navigate(pathTo('feed'));
    } else {
      return commitAddLog(authRef.current.statusText)(logsDispatch);
    }
  };

  const facebookAppId = env.get('facebookAppId');
  const githubAppId = env.get('githubAppId')

  return (
    <section className="section container-fluid">
      <h3>Register</h3>
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <div className="card">
            <article className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row mb-3">
                  <div className="input-group">
                    <div className="input-group-text">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <input
                      className="form-control"
                      id="register-email"
                      type="text"
                      value={email || ''}
                      onChange={onChangeEmail}
                      placeholder="Email"
                      autoComplete="register-email"
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
                      id="register-password"
                      type="password"
                      value={password || ''}
                      onChange={onChangePassword}
                      placeholder="Password"
                      autoComplete="register-password"
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
                        Register
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
                        <FontAwesomeIcon icon={faFacebookF} /> Register with Facebook
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
                        <FontAwesomeIcon icon={faGithub} /> Register with Github
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
