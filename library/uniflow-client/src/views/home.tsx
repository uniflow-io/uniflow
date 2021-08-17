import React, { useState } from 'react';
import { Link } from 'gatsby';
import { ApiException } from '../models';
import { pathTo } from '../routes';
import { Api } from '../services';
import Container from '../container';
import { ApiExceptionErrors } from '../models/api-exception';

const container = new Container();
const api = container.get(Api);

export interface HomeProps {
}

function Home(props: HomeProps) {
  const [email, setEmail] = useState<string>('')
  const [errors, setErrors] = useState<ApiExceptionErrors>({})
  const [state, setState] = useState<'form'|'form-submit'|'form-success'>('form')

  const onChangeEmail: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.target.value);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setState('form-submit')
    try {
      const data = await api.createLead({
        email,
        optinNewsletter: true,
        optinBlog: true,
      })
      if (data) {
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
    <>
      <section className="section container vh-100">
        <div className="row h-100 align-items-center">
          <div className="col-md-12 text-center">
            <h1>Unified Workflow Automation Tool</h1>
            <p>Automate your recurring tasks once, run it everywhere.</p>

            <div id="newsletter-optin" className="d-flex justify-content-center pt-md-5">
              {state === 'form-success' && (
                <div className="alert alert-success text-center" role="alert">
                  {email} was succefully registered to the newsletter.
                  <br />
                  Let's check{' '}
                  <Link to={pathTo('tag', { tag: 'case-study' })}>some cases studies</Link> to
                  get started.
                </div>
              )}
              {(state === 'form' || state === 'form-submit') && (
                <form onSubmit={onSubmit}>
                  <div
                    className={`input-group input-group-lg${errors.email ? ' is-invalid' : ''}`}
                  >
                    <input
                      className={`form-control${errors.email ? ' is-invalid' : ''}`}
                      id="newsletter-email"
                      type="text"
                      value={email || ''}
                      onChange={onChangeEmail}
                      placeholder="Email"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary input-group-text"
                      disabled={state === 'form-submit'}
                    >
                      Subscribe to the newsletter
                    </button>
                    {errors.email && errors.email.map((message, i) => (
                      <div
                        key={`error-${i}`}
                        className="invalid-feedback"
                      >
                        {message}
                      </div>
                    ))}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="row py-5">
          <div className="col-lg-12 text-center">
            <h2>Features</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 py-md-5">
            <h3>Note taking philosophy</h3>
            <p>Create your Flows as you take note.</p>
          </div>
          <div className="col-lg-4 py-md-5">
            <h3>Modulable</h3>
            <p>Create your own specific Flows.</p>
          </div>
          <div className="col-lg-4 py-md-5">
            <h3>Multiple clients</h3>
            <p>Run your Flows on dedicated Clients.</p>
          </div>
          <div className="col-lg-4 py-md-5">
            <h3>Open</h3>
            <p>Uniflow is fair-code licensed.</p>
          </div>
          <div className="col-lg-4 py-md-5">
            <h3>Control your data</h3>
            <p>Install and run Uniflow locally.</p>
          </div>
          <div className="col-lg-4 py-md-5">
            <h3>Community</h3>
            <p>Get inspiration from community.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
