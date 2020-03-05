import React, { Component } from 'react'
import { connect } from 'react-redux'
import { contact } from '../reducers/contact/actions'

class Contact extends Component {
  state = {
    email: null,
    emailError: false,
    message: null,
    messageError: false,
    sent: false,
  }

  onChangeEmail = event => {
    this.setState({ email: event.target.value })
  }

  onChangeMessage = event => {
    this.setState({ message: event.target.value })
  }

  onSubmit = e => {
    e.preventDefault()

    let valid = true
    if (!this.state.email) {
      valid = false
      this.setState({ emailError: true })
    } else {
      this.setState({ emailError: false })
    }

    if (!this.state.message) {
      valid = false
      this.setState({ messageError: true })
    } else {
      this.setState({ messageError: false })
    }

    if (valid) {
      this.props
        .dispatch(contact(this.state.email, this.state.message))
        .then(data => {
          if (data === true) {
            this.setState({ sent: true })
          }
        })
    }
  }

  render() {
    const { email, emailError, message, messageError, sent } = this.state

    return (
      <section className="section container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3>Contact</h3>
            {sent && (
              <p className="text-center">Your message has been sent</p>
            )}
            {!sent && [
              <p className="text-center" key="say">
                You got a question about Uniflow, write more here
                <br />
                It will be a pleasure to respond
              </p>,
              <form key="contactForm">
                <div className="form-group col-sm-12">
                  <input
                    className={`form-control${
                      emailError ? ' is-invalid' : ''
                    }`}
                    id="email{{ _uid }}"
                    type="text"
                    value={email || ''}
                    onChange={this.onChangeEmail}
                    placeholder="Email"
                  />
                  {emailError && (
                    <div
                      className="invalid-feedback"
                      htmlFor="email{{ _uid }}"
                    >
                      Enter your email
                    </div>
                  )}
                </div>

                <div className="form-group col-sm-12">
                  <textarea
                    className={`form-control${
                      messageError ? ' is-invalid' : ''
                    }`}
                    id="message{{ _uid }}"
                    type="message"
                    value={message || ''}
                    onChange={this.onChangeMessage}
                    placeholder="Message"
                    rows="15"
                  />
                  {messageError && (
                    <div
                      className="invalid-feedback"
                      htmlFor="message{{ _uid }}"
                    >
                      Enter your message
                    </div>
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
