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
import ApiValidateException, { ApiValidateExceptionErrors } from '../../models/api-validate-exception';
import Alert, { AlertType } from '../../components/alert';
import FormInput, { FormInputType } from '../../components/form-input';

const container = new Container();
const env = container.get(Env);

export interface RegisterProps {
}

function Register(props: RegisterProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ApiValidateExceptionErrors<'form'|'email'|'password'>>({})
  const { auth, authDispatch, authRef } = useAuth()
  const { logsDispatch } = useLogs()

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    try {
      await register(email, password)(authDispatch);
      if (authRef.current.isAuthenticated) {
        navigate(pathTo('feed'));
      }
    } catch(error) {
      if (error instanceof ApiValidateException) {
        setErrors({ ...error.errors })
      } else if(authRef.current.message) {
        setErrors({form: [authRef.current.message]})
      }
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
                {errors.form && errors.form.map((message, i) => (
                  <Alert key={i} type={AlertType.DANGER}>{message}</Alert>
                ))}
                <FormInput
                  id="register-email"
                  type={FormInputType.TEXT}
                  placeholder="Email"
                  value={email}
                  errors={errors.email}
                  icon={faUser}
                  onChange={setEmail}
                  autoComplete={true}
                  />
                <FormInput
                  id="register-password"
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
