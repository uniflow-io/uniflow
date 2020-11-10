import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ApiException } from '../exceptions'
import { contact } from '../reducers/contact/actions'

class Contact extends Component {
  state = {
    email: '',
    message: '',
    errors: {},
    status: 'form',
  }

  onChangeEmail = event => {
    this.setState({ email: event.target.value })
  }

  onChangeMessage = event => {
    this.setState({ message: event.target.value })
  }

  onSubmit = e => {
    e.preventDefault()
    
    this.props
      .dispatch(contact(this.state.email, this.state.message))
      .then(data => {
        if (data === true) {
          this.setState({ status: 'sent' })
        }
      })
      .catch(error => {
        if(error instanceof ApiException) {
          this.setState({ errors: {...error.errors} })
        }
      })
  }

  render() {
    const { email, message, errors, status } = this.state

    return (
      <section className="section container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3>Contact</h3>
            {status === 'sent' && (
              <p className="text-center">Your message has been sent</p>
            )}
            {status === 'form' && [
              <p className="text-center" key="say">
                You got a question about Uniflow, write more here
                <br />
                It will be a pleasure to respond
              </p>,
              <form key="contactForm">
                <div className="form-group col-sm-12">
                  <input
                    className={`form-control${
                      errors.email ? ' is-invalid' : ''
                    }`}
                    id="email{{ _uid }}"
                    type="text"
                    value={email || ''}
                    onChange={this.onChangeEmail}
                    placeholder="Email"
                  />
                  {errors.email && errors.email.map((message, i) =>
                    <div
                      key={`error-${i}`}
                      className="invalid-feedback"
                      htmlFor="email{{ _uid }}"
                    >{message}</div>
                  )}
                </div>

                <div className="form-group col-sm-12">
                  <textarea
                    className={`form-control${
                      errors.message ? ' is-invalid' : ''
                    }`}
                    id="message{{ _uid }}"
                    type="message"
                    value={message || ''}
                    onChange={this.onChangeMessage}
                    placeholder="Message"
                    rows="15"
                  />
                  {errors.message && errors.message.map((message, i) =>
                    <div
                      key={`error-${i}`}
                      className="invalid-feedback"
                      htmlFor="message{{ _uid }}"
                    >{message}</div>
                  )}
                </div>

                <div className="form-group col-sm-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-flat"
                    onClick={this.onSubmit}
                  >
                    Send
                  </button>
                </div>
              </form>,
            ]}
          </div>
        </div>
      </section>
    )
  }
}

export default connect(state => {
  return {
    env: state.env,
  }
})(Contact)
