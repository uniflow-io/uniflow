import React from 'react';
import { faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { facebookLoginUrl, githubLoginUrl } from '../contexts/auth';
import { updateSettings, useUser } from '../contexts/user';
import Container from '../container';
import { UI, Env, Api } from '../services';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth, useLogs } from '../contexts';
import { useStateRef } from '../hooks/use-state-ref';
import { ApiValidateException, ApiValidateExceptionErrors } from '../models/api-exceptions';
import Alert, { AlertType } from '../components/alert';
import FormInput, { FormInputType } from '../components/form-input';
import { FC } from 'react';

const container = new Container();
const ui = container.get(UI);
const env = container.get(Env);
const api = container.get(Api);

export interface SettingsProps {}

interface UserSettingsState {
  username?: string | null;
  email?: string;
  firstname?: string | null;
  lastname?: string | null;
  facebookId?: string | null;
  githubId?: string | null;
  apiKey?: string | null;
  links: {
    lead?: string;
  };
}
interface LeadState {
  optinNewsletter: boolean;
  optinBlog: boolean;
  optinGithub: boolean;
  githubUsername: string | null;
}

const Settings: FC<SettingsProps> = () => {
  const [userSettings, setUserSettings, userSettingsRef] = useStateRef<UserSettingsState>({
    apiKey: undefined,
    username: undefined,
    email: undefined,
    firstname: undefined,
    lastname: undefined,
    facebookId: undefined,
    githubId: undefined,
    links: {
      lead: undefined,
    },
  });
  const [leadSettings, setLeadSettings, leadRef] = useStateRef<LeadState>({
    optinNewsletter: false,
    optinBlog: false,
    optinGithub: false,
    githubUsername: null,
  });
  const [errors, setErrors] = useState<
    ApiValidateExceptionErrors<
      | 'form'
      | 'apiKey'
      | 'username'
      | 'email'
      | 'firstname'
      | 'lastname'
      | 'optinNewsletter'
      | 'optinBlog'
      | 'optinGithub'
    >
  >({});
  const [state, setState] = useState<'form' | 'form-submit' | 'form-success'>('form');
  const { auth, authDispatch } = useAuth();
  const { user, userDispatch } = useUser();
  const { logsDispatch } = useLogs();

  useEffect(() => {
    (async () => {
      setUserSettings({ ...user });

      if (user.links.lead) {
        const data = await api.getLead({ uid: user.links.lead });
        setLeadSettings({
          ...leadSettings,
          ...{
            optinNewsletter: data.optinNewsletter,
            optinBlog: data.optinBlog,
            optinGithub: data.optinGithub,
            githubUsername: data.githubUsername,
          },
        });
      }
    })();
  }, [user]);

  const onUpdateFirstname = (value: string) => {
    setUserSettings({ ...userSettings, ...{ firstname: value } });
  };

  const onUpdateLastname = (value: string) => {
    setUserSettings({ ...userSettings, ...{ lastname: value } });
  };

  const onUpdateUsername = (value: string) => {
    setUserSettings({ ...userSettings, ...{ username: value } });
  };

  const onUpdateApiKey = (value: string) => {
    setUserSettings({ ...userSettings, ...{ apiKey: value } });
  };

  const onRevokeFacebook: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    setUserSettings({ ...userSettings, ...{ facebookId: undefined } });
    await onUpdate();
  };

  const onRevokeGithub: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    setUserSettings({ ...userSettings, ...{ githubId: undefined } });
    await onUpdate();
  };

  const onChangeOptinNewsletter = (value: boolean) => {
    setLeadSettings({ ...leadSettings, ...{ optinNewsletter: value } });
  };

  const onChangeOptinBlog = (value: boolean) => {
    setLeadSettings({ ...leadSettings, ...{ optinBlog: value } });
  };

  const onChangeOptinGithub = (value: boolean) => {
    setLeadSettings({ ...leadSettings, ...{ optinGithub: value } });
  };

  const onUpdate = async () => {
    setState('form-submit');
    try {
      setErrors({});
      if (userSettingsRef.current.links.lead) {
        await api.updateLead(
          { uid: userSettingsRef.current.links.lead },
          {
            optinNewsletter: leadRef.current.optinNewsletter,
            optinBlog: leadRef.current.optinBlog,
            optinGithub: leadRef.current.optinGithub,
          }
        );
      } else if (
        userSettingsRef.current.email &&
        (leadRef.current.optinNewsletter || leadRef.current.optinBlog)
      ) {
        await api.createLead({
          email: userSettingsRef.current.email,
          optinNewsletter: leadRef.current.optinNewsletter,
          optinBlog: leadRef.current.optinBlog,
        });
      }
      if (auth.token) {
        await updateSettings(userSettingsRef.current, auth.token)(
          userDispatch,
          authDispatch,
          logsDispatch
        );
      }
      setState('form-success');
    } catch (error) {
      setState('form');
      if (error instanceof ApiValidateException) {
        setErrors({ ...error.errors });
      } else {
        setErrors({ form: [error.message] });
      }
    }
  };

  const onSubmit: React.ChangeEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await onUpdate();
  };

  const onGenerateKey: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    let apiKey = '';
    for (let i = 0; i < 32; i++) {
      apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setUserSettings({ ...userSettings, ...{ apiKey: apiKey } });
    await onUpdate();
  };

  const getClipboard = () => {
    if (userSettings.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${userSettings.apiKey}`;
    }

    return undefined;
  };

  const onCopyApiUsage: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const clipboard = getClipboard();

    ui.copyTextToClipboard(clipboard || '');
  };

  const clipboard = getClipboard();
  const facebookAppId = env.get('facebookAppId');
  const githubAppId = env.get('githubAppId');

  return (
    <section className="section container-fluid">
      <h3 className="box-title">Settings</h3>
      <form className="form-sm-horizontal" onSubmit={onSubmit}>
        {state === 'form-success' && (
          <Alert type={AlertType.SUCCESS}>Your settings have been saved.</Alert>
        )}
        {errors.form &&
          errors.form.map((message, i) => (
            <Alert key={i} type={AlertType.DANGER}>
              {message}
            </Alert>
          ))}
        <FormInput
          type={FormInputType.TEXT}
          id="settings-firstname"
          label="Firstname"
          value={userSettings.firstname}
          errors={errors.firstname}
          onChange={onUpdateFirstname}
        />
        <FormInput
          type={FormInputType.TEXT}
          id="settings-lastname"
          label="Lastname"
          value={userSettings.lastname}
          errors={errors.lastname}
          onChange={onUpdateLastname}
        />
        <FormInput
          type={FormInputType.TEXT}
          id="settings-username"
          label="Username"
          value={userSettings.username}
          errors={errors.username}
          onChange={onUpdateUsername}
        />
        {facebookAppId && (
          <div className="row mb-3">
            <label htmlFor="settings-facebook" className="col-sm-2 col-form-label">
              Facebook
            </label>
            <div className="col-sm-10">
              <div className="d-grid">
                {(userSettings.facebookId && (
                  <button onClick={onRevokeFacebook} className="btn btn-info">
                    <FontAwesomeIcon icon={faFacebookF} /> Revoke Facebook
                  </button>
                )) || (
                  <a href={facebookLoginUrl(facebookAppId)} className="btn btn-social btn-facebook">
                    <FontAwesomeIcon icon={faFacebookF} /> Connect with Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
        {githubAppId && (
          <div className="row mb-3">
            <label htmlFor="settings-github" className="col-sm-2 col-form-label">
              Github
            </label>
            <div className="col-sm-10">
              <div className="d-grid">
                {(userSettings.githubId && (
                  <button onClick={onRevokeGithub} className="btn btn-info">
                    <FontAwesomeIcon icon={faGithub} /> Revoke Github
                  </button>
                )) || (
                  <a href={githubLoginUrl(githubAppId)} className="btn btn-social btn-github">
                    <FontAwesomeIcon icon={faGithub} /> Connect with Github
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
        <FormInput
          type={FormInputType.TEXT}
          id="settings-apiKeyGenerate"
          label="Api key"
          value={userSettings.apiKey}
          errors={errors.apiKey}
          onChange={onUpdateApiKey}
          groups={
            <button type="button" className="input-group-text" onClick={onGenerateKey}>
              Generate
            </button>
          }
        />
        <div className="row mb-3">
          <label htmlFor="settings-apiKey" className="col-sm-2 col-form-label">
            Api usage
          </label>
          <div className="col-sm-10">
            <div className="input-group">
              <button type="button" className="input-group-text" onClick={onCopyApiUsage}>
                <FontAwesomeIcon icon={faClipboard} />
              </button>
              <input
                type="text"
                className="form-control"
                id="settings-apiKey"
                value={clipboard || ''}
                readOnly
                placeholder="api key"
              />
            </div>
          </div>
        </div>
        <FormInput
          type={FormInputType.CHECKBOX}
          id="settings-optinNewsletter"
          label="Subscribe to the newsletter"
          value={leadSettings.optinNewsletter}
          errors={errors.optinNewsletter}
          onChange={onChangeOptinNewsletter}
        />
        <FormInput
          type={FormInputType.CHECKBOX}
          id="settings-optinNewsletter"
          label="Subscribe to blog updates"
          value={leadSettings.optinBlog}
          errors={errors.optinBlog}
          onChange={onChangeOptinBlog}
        />
        {leadSettings.githubUsername && (
          <FormInput
            type={FormInputType.CHECKBOX}
            id="settings-optinGithub"
            label="Subscribe to github updates"
            value={leadSettings.optinGithub}
            errors={errors.optinGithub}
            onChange={onChangeOptinGithub}
          />
        )}
        <div className="row mb-3">
          <div className="offset-sm-2 col-sm-10">
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={state === 'form-submit'}>
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Settings;
