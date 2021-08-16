import { Link } from 'gatsby';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApiException } from '../exceptions';
import { contact } from '../reducers/contact/actions';
import { pathTo } from '../routes';

class Contact extends Component {
  state = {
    email: '',
    message: '',
    errors: {},
    state: 'form',
  };

  onChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  onChangeMessage = (event) => {
    this.setState({ message: event.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    this.setState({ state: 'sending' }, async () => {
      try {
        const data = await this.props.dispatch(contact(this.state.email, this.state.message))
        if (data === true) {
          this.setState({ state: 'sent' });
        }
      } catch(error) {
        if (error instanceof ApiException) {
          this.setState({ state: 'form', errors: { ...error.errors } });
        }
      }
    });
  };

  render() {
    const { email, message, errors, state } = this.state;

    return (
      <section className="section container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3>Contact</h3>
            {state === 'sent' && (
              <div className="alert alert-success text-center" role="alert">
                Your message has been sent, we will glad to ear from you !<br />
                In case check <Link to={pathTo('doc', { slug: 'faq' })}>FAQ</Link> page to see if
                your question has been answered already.
              </div>
            )}
            {(state === 'form' || state === 'sending') && [
              <p className="text-center" key="say">
                You got a question about Uniflow, write more here
                <br />
                It will be a pleasure to respond
              </p>,
              <form key="contactForm">
                <div className="row mb-3">
                  <div className="col-md-12">
                    <input
                      className={`form-control${errors.email ? ' is-invalid' : ''}`}
                      id="email{{ _uid }}"
                      type="text"
                      value={email || ''}
                      onChange={this.onChangeEmail}
                      placeholder="Email"
                    />
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'email' does not exist on type '{}'. */}
                    {errors.email &&
                      errors.email.map((message, i) => (
                        <div
                          key={`error-${i}`}
                          className="invalid-feedback"
                          htmlFor="email{{ _uid }}"
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
                      id="message{{ _uid }}"
                      type="message"
                      value={message || ''}
                      onChange={this.onChangeMessage}
                      placeholder="Message"
                      rows="15"
                    />
                    {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'message' does not exist on type '{}'. */}
                    {errors.message &&
                      errors.message.map((message, i) => (
                        <div
                          key={`error-${i}`}
                          className="invalid-feedback"
                          htmlFor="message{{ _uid }}"
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
                        disabled={state === 'sending'}
                        onClick={this.onSubmit}
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
}

export default connect((state) => {
  return {
    env: state.env,
  };
})(Contact);
