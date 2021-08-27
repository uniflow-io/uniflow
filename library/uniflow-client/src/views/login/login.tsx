import React, { useState } from 'react';
import { login, facebookLoginUrl, githubLoginUrl } from '../../contexts/auth';
import { pathTo } from '../../routes';
import { Link, navigate } from 'gatsby';
import { faSignInAlt, faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../../container';
import { Env } from '../../services';
import { useAuth } from '../../contexts';
import ApiValidateException, {
  ApiValidateExceptionErrors,
} from '../../models/api-validate-exception';
import FormInput, { FormInputType } from '../../components/form-input';
import Alert, { AlertType } from '../../components/alert';
import { FC } from 'react';

const container = new Container();
const env = container.get(Env);

export interface LoginProps {}

const Login: FC<LoginProps> = (props) => {
  const facebookAppId = env.get('facebookAppId');
  const githubAppId = env.get('githubAppId');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<
    ApiValidateExceptionErrors<'form' | 'username' | 'password'>
  >({});
  const { auth, authDispatch, authRef } = useAuth();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    try {
      setErrors({});
      await login(username, password)(authDispatch);
      if (authRef.current.isAuthenticated) {
        navigate(pathTo('feed'));
      }
    } catch (error) {
      if (error instanceof ApiValidateException) {
        setErrors({ ...error.errors });
      } else if (authRef.current.message) {
        setErrors({ form: [authRef.current.message] });
      }
    }
  };

  return (
    <section className="section container-fluid">
      <h3>Login</h3>
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <div className="card mb-3">
            <article className="card-body">
              <form onSubmit={onSubmit}>
                {errors.form &&
                  errors.form.map((message, i) => (
                    <Alert key={i} type={AlertType.DANGER}>
                      {message}
                    </Alert>
                  ))}
                <FormInput
                  id="login-username"
                  type={FormInputType.TEXT}
                  placeholder="Email or Username"
                  value={username}
                  errors={errors.username}
                  icon={faUser}
                  onChange={setUsername}
                  autoComplete={true}
                />
                <FormInput
                  id="login-password"
                  type={FormInputType.PASSWORD}
                  placeholder="Password"
                  value={password}
                  errors={errors.password}
                  icon={faKey}
                  onChange={setPassword}
                  autoComplete={true}
                />
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
                      <a href={githubLoginUrl(githubAppId)} className="btn btn-social btn-github">
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
};

export default Login;
