import { Link } from 'gatsby';
import React from 'react';
import { ApiException } from '../models';
import { pathTo } from '../routes';
import { useState } from 'react';
import { Api } from '../services';
import Container from '../container';
import { ApiExceptionErrors } from '../models/api-exception';

const container = new Container();
const api = container.get(Api);

export interface ContactProps {
}

export interface ContactState {}

function Contact(props: ContactProps) {
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [errors, setErrors] = useState<ApiExceptionErrors>({})
  const [state, setState] = useState<'form'|'form-submit'|'form-success'>('form')

  const onChangeEmail: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.target.value);
  };

  const onChangeMessage: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setMessage(event.target.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setState('form-submit')
    try {
      const data = await api.contact({email, message});
      if (data === true) {
        setState('form-success');
      }
    } catch (error) {
      if (error instanceof ApiException) {
        setErrors({ ...error.errors })
        setState('form');
      }
    }
  };

  return (
    <section className="section container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h3>Contact</h3>
          {state === 'form-success' && (
            <div className="alert alert-success text-center" role="alert">
              Your message has been sent, we will glad to ear from you !<br />
              In case check <Link to={pathTo('doc', { slug: 'faq' })}>FAQ</Link> page to see if
              your question has been answered already.
            </div>
          )}
          {(state === 'form' || state === 'form-submit') && [
            <p className="text-center" key="say">
              You got a question about Uniflow, write more here
              <br />
              It will be a pleasure to respond
            </p>,
            <form key="contactForm" onSubmit={onSubmit}>
              <div className="row mb-3">
                <div className="col-md-12">
                  <input
                    className={`form-control${errors.email ? ' is-invalid' : ''}`}
                    id="contact-email"
                    type="text"
                    value={email || ''}
                    onChange={onChangeEmail}
                    placeholder="Email"
                  />
                  {errors.email &&
                    errors.email.map((message, i) => (
                      <div
                        key={`error-${i}`}
                        className="invalid-feedback"
                      >
                        {message}
                      </div>
                    ))}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-12">
                  <textarea
                    className={`form-control${errors.message ? ' is-invalid' : ''}`}
                    id="contact-message"
                    value={message || ''}
                    onChange={onChangeMessage}
                    placeholder="Message"
                    rows={15}
                  />
                  {errors.message &&
                    errors.message.map((message, i) => (
                      <div
                        key={`error-${i}`}
                        className="invalid-feedback"
                      >
                        {message}
                      </div>
                    ))}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={state === 'form-submit'}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </form>,
          ]}
        </div>
      </div>
    </section>
  );
}

export default Contact;
