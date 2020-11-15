import React, { Component } from 'react'
import { connect } from 'react-redux'
import { faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-regular-svg-icons'
import { facebookLoginUrl, githubLoginUrl } from '../reducers/auth/actions'
import { updateSettings, commitUpdateSettings } from '../reducers/user/actions'
import { copyTextToClipboard } from '../utils'

class Settings extends Component {
  state = {
    user: {
      apiKey: null,
      username: null,
      firstname: null,
      lastname: null,
      facebookId: null,
      githubId: null,
    },
    isSaving: false,
  }

  componentDidMount() {
    this.setState({ user: Object.assign({}, this.props.user) })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.setState({ user: Object.assign({}, this.props.user) })
    }
  }

  onUpdateFirstname = event => {
    this.setState({
      user: { ...this.state.user, ...{ firstname: event.target.value } },
    })
  }

  onUpdateLastname = event => {
    this.setState({
      user: { ...this.state.user, ...{ lastname: event.target.value } },
    })
  }

  onUpdateUsername = event => {
    this.setState({
      user: { ...this.state.user, ...{ username: event.target.value } },
    })
  }

  onUpdateApiKey = event => {
    this.setState({
      user: { ...this.state.user, ...{ apiKey: event.target.value } },
    })
  }

  onRevokeFacebook = event => {
    event.preventDefault()
    this.setState(
      { user: { ...this.state.user, ...{ facebookId: null } } },
      this.onUpdate
    )
  }

  onRevokeGithub = event => {
    event.preventDefault()
    this.setState(
      { user: { ...this.state.user, ...{ githubId: null } } },
      this.onUpdate
    )
  }

  onUpdate = event => {
    if (event) {
      event.preventDefault()
    }

    this.setState({ isSaving: true }, () => {
      this.props
        .dispatch(updateSettings(this.state.user, this.props.auth.token))
        .then(() => {
          this.setState({ isSaving: false })
        })
    })
  }

  generateKey = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

    let apiKey = ''
    for (let i = 0; i < 32; i++) {
      apiKey += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    this.props.dispatch(
      commitUpdateSettings({ ...this.props.user, ...{ apiKey: apiKey } })
    )
  }

  getClipboard = user => {
    if (user.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${user.apiKey}`
    }

    return null
  }

  onCopyApiUsage = event => {
    const { user } = this.state
    const clipboard = this.getClipboard(user)

    copyTextToClipboard(clipboard)
  }

  render() {
    const { env } = this.props
    const { user, isSaving } = this.state
    const clipboard = this.getClipboard(user)

    return (
      <section className="section container-fluid">
        <h3 className="box-title">Settings</h3>
        <form className="form-sm-horizontal">
          <div className="form-group row">
            <label
              htmlFor="settings_firstname"
              className="col-sm-2 col-form-label"
            >
              Firstname
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="settings_firstname"
                value={user.firstname || ''}
                onChange={this.onUpdateFirstname}
                placeholder="Firstname"
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="settings_lastname"
              className="col-sm-2 col-form-label"
            >
              Lastname
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="settings_lastname"
                value={user.lastname || ''}
                onChange={this.onUpdateLastname}
                placeholder="Lastname"
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="settings_username"
              className="col-sm-2 col-form-label"
            >
              Username
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="settings_username"
                value={user.username || ''}
                onChange={this.onUpdateUsername}
                placeholder="Username"
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="settings_username"
              className="col-sm-2 col-form-label"
            >
              Facebook
            </label>
            <div className="col-sm-10">
              {(user.facebookId && (
                <button
                  onClick={this.onRevokeFacebook}
                  className="btn btn-info"
                >
                  <FontAwesomeIcon icon={faFacebookF} /> Revoke Facebook
                </button>
              )) || (
                <a
                  href={facebookLoginUrl(env.facebookAppId)}
                  className="btn btn-block btn-social btn-facebook"
                >
                  <FontAwesomeIcon icon={faFacebookF} /> Connect with Facebook
                </a>
              )}
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="settings_username"
              className="col-sm-2 col-form-label"
            >
              Github
            </label>
            <div className="col-sm-10">
              {(user.githubId && (
                <button onClick={this.onRevokeGithub} className="btn btn-info">
                  <FontAwesomeIcon icon={faGithub} /> Revoke Github
                </button>
              )) || (
                <a
                  href={githubLoginUrl(env.githubAppId)}
                  className="btn btn-block btn-social btn-github"
                >
                  <FontAwesomeIcon icon={faGithub} /> Connect with Github
                </a>
              )}
            </div>
          </div>
          <div className="form-group row">
            <label
              htmlFor="settings_apiKey"
              className="col-sm-2 col-form-label"
            >
              Api key
            </label>
            <div className="col-sm-10">
              <div className="input-group">
                <div className="input-group-prepend">
                  <button
                    type="button"
                    className="input-group-text"
                    onClick={this.generateKey}
                  >
                    Generate
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="settings_apiKey"
                  value={user.apiKey || ''}
                  onChange={this.onUpdateApiKey}
                  placeholder="api key"
                />
              </div>
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="settings_key" className="col-sm-2 col-form-label">
              Api usage
            </label>
            <div className="col-sm-10">
              <div className="input-group">
                <div className="input-group-prepend">
                  <button
                    type="button"
                    className="input-group-text"
                    onClick={this.onCopyApiUsage}
                  >
                    <FontAwesomeIcon icon={faClipboard} />
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="settings_key"
                  value={clipboard || ''}
                  readOnly
                  placeholder="api key"
                />
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div className="offset-sm-2 col-sm-10">
              <button
                type="submit"
                className="btn btn-primary btn-block btn-flat"
                disabled={isSaving}
                onClick={this.onUpdate}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </section>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    env: state.env,
    user: state.user,
  }
})(Settings)
