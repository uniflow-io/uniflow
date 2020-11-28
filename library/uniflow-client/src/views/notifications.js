import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Checkbox } from '../components'
import { ApiException } from '../exceptions'
import { getLead, updateLead } from '../reducers/lead/actions'
import { matchRoute } from '../routes'

class Notifications extends Component {
  state = {
    lead: {
      uid: undefined,
      optinNewsletter: false,
      optinBlog: false,
      optinGithub: false,
      githubUsername: null,
    },
    errors: {},
    state: 'loading',
  }

  componentDidMount() {
    const { location } = this.props

    let uid = this.getId()

    const match = matchRoute(location.pathname)
    if (uid !== null && match) {
      if(match.route === 'notificationUnsubscribe') {
        this.props
        .dispatch(updateLead(uid, {
          optinNewsletter: false,
          optinBlog: false,
          optinGithub: false,
        }))
        .then(() => {
          this.setState({
            lead: {...this.state.lead, ...{ uid }},
            state: 'sent-unsubscribe',
          })
        })
        .catch(() => {
          this.setState({state: 'not-found'})
        })
      } else if(match.route === 'notificationManage') {
        this.props
          .dispatch(getLead(uid))
          .then(data => {
            this.setState({
              lead: {...this.state.lead, ...{
                uid,
                optinNewsletter: data.optinNewsletter,
                optinBlog: data.optinBlog,
                optinGithub: data.optinGithub,
                githubUsername: data.githubUsername,
              }},
              state: 'form',
            })
          })
          .catch(() => {
            this.setState({state: 'not-found'})
          })
      } else {
        this.setState({state: 'not-found'})
      }
    } else {
      this.setState({state: 'not-found'})
    }
  }

  getId() {
    let m = this.props.location.search.match(/id=([^&]+)/)
    if (m) {
      return m[1]
    }

    return null
  }

  onChangeOptinNewsletter = value => {
    this.setState({lead: {...this.state.lead, ...{optinNewsletter: value}}})
  }

  onChangeOptinBlog = value => {
    this.setState({lead: {...this.state.lead, ...{optinBlog: value}}})
  }

  onChangeOptinGithub = value => {
    this.setState({lead: {...this.state.lead, ...{optinGithub: value}}})
  }

  onSubmit = e => {
    e.preventDefault()

    const { lead } = this.state

    this.setState({ state: 'sending' }, () => {
      this.props
      .dispatch(updateLead(lead.uid, {
        optinNewsletter: lead.optinNewsletter,
        optinBlog: lead.optinBlog,
        optinGithub: lead.optinGithub,
      }))
      .then(() => {
        this.setState({ state: 'sent' })
      })
      .catch(error => {
        if(error instanceof ApiException) {
          this.setState({ state: 'form', errors: {...error.errors} })
        }
      })
    })
  }

  render() {
    const { state, lead } = this.state
    return (
      <section className="section container-fluid">
        <h3 className="box-title">Notifications</h3>
        {state === 'loading' && (
        <p className="text-center">
          Loading notifications
        </p>
        )}
        {state === 'not-found' && (
        <div className="alert alert-danger text-center" role="alert">
          Notifications coudn't be restored.<br />
          You may check your notification link.
        </div>
        )}
        {['form', 'sending'].indexOf(state) !== -1 && (
        <form className="form-sm-horizontal">
          <div className="form-group row">
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
                onChange={this.onChangeOptinNewsletter}
                id="notifications_optinNewsletter_{{ _uid }}"
              />
            </div>
          </div>
          <div className="form-group row">
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
                onChange={this.onChangeOptinBlog}
                id="notifications_optinBlog_{{ _uid }}"
              />
            </div>
          </div>
          {lead.githubUsername && (
          <div className="form-group row">
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
                onChange={this.onChangeOptinGithub}
                id="notifications_optinGithub_{{ _uid }}"
              />
            </div>
          </div>
          )}
          <div className="form-group row">
            <div className="offset-sm-2 col-sm-10">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-flat"
                disabled={state === 'sending'}
                onClick={this.onSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </form>
        )}
        {state === 'sent' && (
        <div className="alert alert-success text-center" role="alert">
          Your notifications settings were saved.
        </div>
        )}
        {state === 'sent-unsubscribe' && (
        <div className="alert alert-success text-center" role="alert">
          Your were succefully unsubscribed from our emails.
        </div>
        )}
      </section>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
  }
})(Notifications)
