import React, { useEffect } from 'react';
import { useState } from 'react';
import { Checkbox } from '../components';
import { ApiValidateException } from '../models';
import { matchRoute } from '../routes';
import { WindowLocation, useLocation } from '@reach/router';

import { Api } from '../services';
import Container from '../container';
import { ApiValidateExceptionErrors } from '../models/api-validate-exception';
import Alert, { AlertType } from '../components/alert';
import FormInput, { FormInputType } from '../components/form-input';

const container = new Container();
const api = container.get(Api);

export interface NotificationsProps {
}

interface LeadState {
  uid?: string,
  optinNewsletter: boolean,
  optinBlog: boolean,
  optinGithub: boolean,
  githubUsername: string|null,
}

function Notifications(props: NotificationsProps) {
  const [lead, setLead] = useState<LeadState>({
    uid: undefined,
    optinNewsletter: false,
    optinBlog: false,
    optinGithub: false,
    githubUsername: null,
  })
  const [errors, setErrors] = useState<ApiValidateExceptionErrors<'form'|'optinNewsletter'|'optinBlog'|'optinGithub'>>({})
  const [state, setState] = useState<'loading'|'not-found'|'form'|'form-submit'|'form-success'|'unsubscribe-success'>('loading')
  const location = useLocation();

  useEffect(() => {
    const uid = getId();

    (async () => {
      const match = matchRoute(location.pathname);
      if (uid !== null && match) {
        if (match.route === 'notificationUnsubscribe') {
          try {
            await api.updateLead({uid}, {
              optinNewsletter: false,
              optinBlog: false,
              optinGithub: false,
            })
            setLead({...lead, ...{ uid }})
            setState('unsubscribe-success')
          } catch (error) {
            setState('not-found');
          }
        } else if (match.route === 'notificationManage') {
          try {
            const data = await api.getLead({uid});
            setLead({
              ...lead,
              ...{
                uid,
                optinNewsletter: data.optinNewsletter,
                optinBlog: data.optinBlog,
                optinGithub: data.optinGithub,
                githubUsername: data.githubUsername,
              }
            })
            setState('form');
          } catch (error) {
            setState('not-found');
          }
        } else {
          setState('not-found');
        }
      } else {
        setState('not-found');
      }
    })()
  }, [])

  const getId = () => {
    const m = location.search.match(/id=([^&]+)/);
    if (m) {
      return m[1];
    }

    return null;
  }

  const onChangeOptinNewsletter = (value: boolean) => {
    setLead({ ...lead, ...{ optinNewsletter: value } });
  };

  const onChangeOptinBlog = (value: boolean) => {
    setLead({ ...lead, ...{ optinBlog: value } });
  };

  const onChangeOptinGithub = (value: boolean) => {
    setLead({ ...lead, ...{ optinGithub: value } });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if(!lead.uid) {
      setState('not-found')
      return
    }

    setState('form-submit')
    try {
      await api.updateLead({uid: lead.uid}, {
        optinNewsletter: lead.optinNewsletter,
        optinBlog: lead.optinBlog,
        optinGithub: lead.optinGithub,
      })
      setState('form-success');
    } catch (error) {
      if (error instanceof ApiValidateException) {
        setErrors({ ...error.errors })
        setState('form');
      }
    }
  };

  return (
    <section className="section container-fluid">
      <h3 className="box-title">Notifications</h3>
      {state === 'loading' && <p className="text-center">Loading notifications</p>}
      {state === 'not-found' && (
        <Alert type={AlertType.DANGER}>
          Notifications coudn't be restored.<br />
          You may check your notification link.
        </Alert>
      )}
      {state === 'form-success' && (
        <Alert type={AlertType.SUCCESS}>
          Your notifications settings have been saved.
        </Alert>
      )}
      {state === 'unsubscribe-success' && (
        <Alert type={AlertType.SUCCESS}>
          Your have been succefully unsubscribed from our emails.
        </Alert>
      )}
      {['form', 'form-submit'].indexOf(state) !== -1 && (
        <form className="form-sm-horizontal" onSubmit={onSubmit}>
          <FormInput
            type={FormInputType.CHECKBOX}
            id="notifications-optinNewsletter"
            label="Subscribe to the newsletter"
            value={lead.optinNewsletter}
            errors={errors.optinNewsletter}
            onChange={onChangeOptinNewsletter}
            />
          <FormInput
            type={FormInputType.CHECKBOX}
            id="notifications-optinBlog"
            label="Subscribe to blog updates"
            value={lead.optinBlog}
            errors={errors.optinBlog}
            onChange={onChangeOptinBlog}
            />
          {lead.githubUsername && (
            <FormInput
              type={FormInputType.CHECKBOX}
              id="notifications-optinGithub"
              label="Subscribe to github updates"
              value={lead.optinGithub}
              errors={errors.optinGithub}
              onChange={onChangeOptinGithub}
              />
          )}
          <div className="row mb-3">
            <div className="offset-sm-2 col-sm-10">
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={state === 'form-submit'}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}

export default Notifications;
