import React from 'react';
import { faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { facebookLoginUrl, githubLoginUrl } from '../contexts/auth';
import { updateSettings, commitUpdateSettings, useUser } from '../contexts/user';
import Container from '../container';
import { UI, Env, Api } from '../services';
import { Checkbox } from '../components';
import { useState } from 'react';
import { useEffect } from 'react';
import { useAuth, useLogs } from '../contexts';
import { useStateRef } from '../hooks/use-state-ref';

const container = new Container();
const ui = container.get(UI);
const env = container.get(Env);
const api = container.get(Api)

export interface SettingsProps {
}

interface UserSettingsState {
  apiKey?: string,
  username?: string,
  email?: string,
  firstname?: string,
  lastname?: string,
  facebookId?: string,
  githubId?: string,
  links: {
    lead?: string,
  },
}
interface LeadState {
  optinNewsletter: boolean,
  optinBlog: boolean,
  optinGithub: boolean,
  githubUsername: string|null,
}

function Settings(props: SettingsProps) {
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
  })
  const [leadSettings, setLeadSettings, leadRef] = useStateRef<LeadState>({
    optinNewsletter: false,
    optinBlog: false,
    optinGithub: false,
    githubUsername: null,
  })
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const { auth, authDispatch } = useAuth()
  const { user, userDispatch } = useUser()
  const { logsDispatch } = useLogs()

  useEffect(() => {
    (async () => {
      setUserSettings({...user});

      if (user.links.lead) {
        const data = await api.getLead(user.links.lead);
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
    })()
  }, [user])

  const onUpdateFirstname: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUserSettings({ ...userSettings, ...{ firstname: event.target.value }});
  };

  const onUpdateLastname: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUserSettings({ ...userSettings, ...{ lastname: event.target.value }});
  };

  const onUpdateUsername: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUserSettings({ ...userSettings, ...{ username: event.target.value }});
  };

  const onUpdateApiKey: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setUserSettings({ ...userSettings, ...{ apiKey: event.target.value }});
  };

  const onRevokeFacebook: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    setUserSettings({ ...userSettings, ...{ facebookId: undefined } });
    await onUpdate()
  };

  const onRevokeGithub: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    setUserSettings({ ...userSettings, ...{ githubId: undefined } });
    await onUpdate()
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
    setIsSaving(true)
    if (userSettingsRef.current.links.lead) {
      await api.updateLead({uid: userSettingsRef.current.links.lead}, {
        optinNewsletter: leadRef.current.optinNewsletter,
        optinBlog: leadRef.current.optinBlog,
        optinGithub: leadRef.current.optinGithub,
      })
    } else if(userSettingsRef.current.email && (leadRef.current.optinNewsletter || leadRef.current.optinBlog)) {
      await api.createLead({
        email: userSettingsRef.current.email,
        optinNewsletter: leadRef.current.optinNewsletter,
        optinBlog: leadRef.current.optinBlog,
      })
    }
    if(auth.token) {
      await updateSettings(userSettingsRef.current, auth.token)(userDispatch, authDispatch, logsDispatch);
    }
    setIsSaving(false)
  }

  const onSubmit: React.ChangeEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await onUpdate()
  };

  const onGenerateKey: React.MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault()

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    let apiKey = '';
    for (let i = 0; i < 32; i++) {
      apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setUserSettings({ ...userSettings, ...{ apiKey: apiKey } });
    await onUpdate()
  };

  const getClipboard = (user: UserSettingsState) => {
    if (userSettings.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${userSettings.apiKey}`;
    }

    return undefined;
  };

  const onCopyApiUsage: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const clipboard = getClipboard(user);

    ui.copyTextToClipboard(clipboard || '');
  };

  const clipboard = getClipboard(user);
  const facebookAppId = env.get('facebookAppId');
  const githubAppId = env.get('githubAppId')

  return (
    <section className="section container-fluid">
      <h3 className="box-title">Settings</h3>
      <form className="form-sm-horizontal" onSubmit={onSubmit}>
        <div className="row mb-3">
          <label htmlFor="settings-firstname" className="col-sm-2 col-form-label">
            Firstname
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="settings-firstname"
              value={userSettings.firstname || ''}
              onChange={onUpdateFirstname}
              placeholder="Firstname"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="settings-lastname" className="col-sm-2 col-form-label">
            Lastname
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="settings-lastname"
              value={userSettings.lastname || ''}
              onChange={onUpdateLastname}
              placeholder="Lastname"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="settings-username" className="col-sm-2 col-form-label">
            Username
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="settings-username"
              value={userSettings.username || ''}
              onChange={onUpdateUsername}
              placeholder="Username"
            />
          </div>
        </div>
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
                <a
                  href={facebookLoginUrl(facebookAppId)}
                  className="btn btn-social btn-facebook"
                >
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
                <a
                  href={githubLoginUrl(githubAppId)}
                  className="btn btn-social btn-github"
                >
                  <FontAwesomeIcon icon={faGithub} /> Connect with Github
                </a>
              )}
            </div>
          </div>
        </div>
        )}
        <div className="row mb-3">
          <label htmlFor="settings-apiKeyGenerate" className="col-sm-2 col-form-label">
            Api key
          </label>
          <div className="col-sm-10">
            <div className="input-group">
              <button type="button" className="input-group-text" onClick={onGenerateKey}>
                Generate
              </button>
              <input
                type="text"
                className="form-control"
                id="settings-apiKeyGenerate"
                value={userSettings.apiKey || ''}
                onChange={onUpdateApiKey}
                placeholder="api key"
              />
            </div>
          </div>
        </div>
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
        <div className="row mb-3">
          <label
            htmlFor="settins-optinNewsletter"
            className="col-sm-2 col-form-label"
          >
            Subscribe to the newsletter
          </label>

          <div className="col-sm-10">
            <Checkbox
              className="form-control-plaintext"
              value={leadSettings.optinNewsletter}
              onChange={onChangeOptinNewsletter}
              id="settins-optinNewsletter"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="settings-optionBlog" className="col-sm-2 col-form-label">
            Subscribe to blog updates
          </label>

          <div className="col-sm-10">
            <Checkbox
              className="form-control-plaintext"
              value={leadSettings.optinBlog}
              onChange={onChangeOptinBlog}
              id="settings-optionBlog"
            />
          </div>
        </div>
        {leadSettings.githubUsername && (
          <div className="row mb-3">
            <label
              htmlFor="settings-optinGithub"
              className="col-sm-2 col-form-label"
            >
              Subscribe to github updates
            </label>

            <div className="col-sm-10">
              <Checkbox
                className="form-control-plaintext"
                value={leadSettings.optinGithub}
                onChange={onChangeOptinGithub}
                id="settings-optinGithub"
              />
            </div>
          </div>
        )}
        <div className="row mb-3">
          <div className="offset-sm-2 col-sm-10">
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default Settings;
