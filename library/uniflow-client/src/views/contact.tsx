import { Link } from 'gatsby';
import React from 'react';
import { ApiValidateException } from '../models';
import { pathTo } from '../routes';
import { useState } from 'react';
import { Api } from '../services';
import Container from '../container';
import { ApiValidateExceptionErrors } from '../models/api-validate-exception';
import FormInput, { FormInputType } from '../components/form-input';
import Alert, { AlertType } from '../components/alert';
import { FC } from 'react';

const container = new Container();
const api = container.get(Api);

export interface ContactProps {
}

export interface ContactState {}

const Contact: FC<ContactProps> = () => {
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [errors, setErrors] = useState<ApiValidateExceptionErrors<'form'|'email'|'message'>>({})
  const [state, setState] = useState<'form'|'form-submit'|'form-success'>('form')

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setState('form-submit')
    try {
      const data = await api.contact({email, message});
      if (data === true) {
        setState('form-success');
      }
    } catch (error) {
      setState('form');
      if (error instanceof ApiValidateException) {
        setErrors({ ...error.errors })
      } else {
        setErrors({form: [error.message]})
      }
    }
  };

  return (
    <section className="section container-fluid">
      <div className="row">
        <div className="col-md-12">
          <h3>Contact</h3>
          {state === 'form-success' && (
            <Alert type={AlertType.SUCCESS}>
              Your message has been sent, we will glad to ear from you !<br />
              In case check <Link to={pathTo('doc', { slug: 'faq' })}>FAQ</Link> page to see if
              your question has been answered already.
            </Alert>
          )}
          {(state === 'form' || state === 'form-submit') && [
            <p className="text-center" key="say">
              You got a question about Uniflow? Write more here.
            </p>,
            <form key="contactForm" onSubmit={onSubmit}>
              {errors.form && errors.form.map((message, i) => (
                <Alert key={i} type={AlertType.DANGER}>{message}</Alert>
              ))}
              <FormInput 
                type={FormInputType.TEXT}
                id="contact-email"
                placeholder="Email"
                value={email}
                errors={errors.email}
                onChange={setEmail}
                />
              <FormInput 
                type={FormInputType.TEXTAREA}
                id="contact-message"
                placeholder="Message"
                value={message}
                errors={errors.message}
                onChange={setMessage}
                rows={15}
                />

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
