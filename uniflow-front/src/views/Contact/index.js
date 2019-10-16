import React, {Component} from 'react'
import {connect} from 'react-redux'
import {contact} from '../../reducers/contact/actions'
import {pathTo} from '../../routes'
import {Link} from 'gatsby'

class Contact extends Component {
  state = {
    email: null,
    emailError: false,
    message: null,
    messageError: false,
    sent: false,
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value})
  }

  onChangeMessage = event => {
    this.setState({message: event.target.value})
  }

  onSubmit = e => {
    e.preventDefault()

    let valid = true
    if (!this.state.email) {
      valid = false
      this.setState({emailError: true})
    } else {
      this.setState({emailError: false})
    }

    if (!this.state.message) {
      valid = false
      this.setState({messageError: true})
    } else {
      this.setState({messageError: false})
    }

    if (valid) {
      this.props
        .dispatch(contact(this.state.email, this.state.message))
        .then(data => {
          if (data === true) {
            this.setState({sent: true})
          }
        })
    }
  }

  render() {
    const {email, emailError, message, messageError, sent} = this.state

    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Contact
            <small>Control panel</small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <Link to={pathTo('home')}>
                <i className="fa fa-dashboard"/> Home
              </Link>
            </li>
            <li className="active">Contact</li>
          </ol>
        </section>

        <div className="container-fluid content content-contact">
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              <div className="box box-default">
                <div className="box-header with-border">
                  <h3 className="box-title">Contact</h3>
                </div>
                <div className="box-body">
                  {sent && (
                    <p className="text-center">Your message has been sent</p>
                  )}
                  {!sent && [
                    <p className="text-center" key="say">
                      You got a question about Uniflow, write more here
                      <br/>
                      It will be a pleasure to respond
                    </p>,
                    <form key="contactForm">
                      <div
                        className={
                          'form-group col-sm-12' +
                          (emailError ? ' has-error' : '')
                        }
                      >
                        {emailError && (
                          <label
                            className="control-label"
                            htmlFor="email{{ _uid }}"
                          >
                            <i className="fa fa-times-circle-o"/>
                            Enter your email
                          </label>
                        )}
                        <input
                          className="form-control"
                          id="email{{ _uid }}"
                          type="text"
                          value={email || ''}
                          onChange={this.onChangeEmail}
                          placeholder="Email"
                        />
                      </div>

                      <div
                        className={
                          'form-group col-sm-12' +
                          (messageError ? ' has-error' : '')
                        }
                      >
                        {messageError && (
                          <label
                            className="control-label"
                            htmlFor="message{{ _uid }}"
                          >
                            <i className="fa fa-times-circle-o"/>
                            Enter your message
                          </label>
                        )}
                        <textarea
                          className="form-control"
                          id="message{{ _uid }}"
                          type="message"
                          value={message || ''}
                          onChange={this.onChangeMessage}
                          placeholder="Message"
                          rows="15"
                        />
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => {
  return {
    env: state.env,
  }
})(Contact)
