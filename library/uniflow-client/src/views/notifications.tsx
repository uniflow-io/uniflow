import React, { useEffect } from 'react';
import { useState } from 'react';
import { Checkbox } from '../components';
import { ApiException } from '../models';
import { matchRoute } from '../routes';
import { WindowLocation } from '@reach/router';

import { Api } from '../services';
import Container from '../container';
import { ApiExceptionErrors } from '../models/api-exception';

const container = new Container();
const api = container.get(Api);

export interface NotificationsProps {
  location: WindowLocation
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
  const [errors, setErrors] = useState<ApiExceptionErrors>({})
  const [state, setState] = useState<'loading'|'not-found'|'form'|'form-submit'|'form-success'|'unsubscribe-success'>('loading')

  useEffect(() => {
    const { location } = props;

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
            const data = await api.getLead(uid);
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
    const m = props.location.search.match(/id=([^&]+)/);
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
      if (error instanceof ApiException) {
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
        <div className="alert alert-danger text-center" role="alert">
          Notifications coudn't be restored.
          <br />
          You may check your notification link.
        </div>
      )}
      {['form', 'form-submit'].indexOf(state) !== -1 && (
        <form className="form-sm-horizontal" onSubmit={onSubmit}>
          <div className="row mb-3">
            <label
              htmlFor="notifications_optinNewsletter_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Subscribe to the newsletter
            </label>

            <div className="col-sm-10">
              <Checkbox
                className="form-control-plaintext"
                value={lead.optinNewsletter}
                onChange={onChangeOptinNewsletter}
                id="notifications_optinNewsletter_{{ _uid }}"
              />
            </div>
          </div>
          <div className="row mb-3">
            <label
              htmlFor="notifications_optinBlog_{{ _uid }}"
              className="col-sm-2 col-form-label"
            >
              Subscribe to blog updates
            </label>

            <div className="col-sm-10">
              <Checkbox
                className="form-control-plaintext"
                value={lead.optinBlog}
                onChange={onChangeOptinBlog}
                id="notifications_optinBlog_{{ _uid }}"
              />
            </div>
          </div>
          {lead.githubUsername && (
            <div className="row mb-3">
              <label
                htmlFor="notifications_optinGithub_{{ _uid }}"
                className="col-sm-2 col-form-label"
              >
                Subscribe to github updates
              </label>

              <div className="col-sm-10">
                <Checkbox
                  className="form-control-plaintext"
                  value={lead.optinGithub}
                  onChange={onChangeOptinGithub}
                  id="notifications_optinGithub_{{ _uid }}"
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
                  disabled={state === 'form-submit'}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      {state === 'form-success' && (
        <div className="alert alert-success text-center" role="alert">
          Your notifications settings were saved.
        </div>
      )}
      {state === 'unsubscribe-success' && (
        <div className="alert alert-success text-center" role="alert">
          Your were succefully unsubscribed from our emails.
        </div>
      )}
    </section>
  );
}

export default Notifications;
