import React, { Component } from 'react';
import { connect } from 'react-redux';
import { faFacebookF, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { facebookLoginUrl, githubLoginUrl } from '../reducers/auth/actions';
import { updateSettings, commitUpdateSettings } from '../reducers/user/actions';
import { getLead, createLead, updateLead } from '../reducers/lead/actions';
import { copyTextToClipboard } from '../utils';
import { Checkbox } from '../components';
import { env } from '../utils';

class Settings extends Component {
  state = {
    user: {
      apiKey: undefined,
      username: undefined,
      email: undefined,
      firstname: undefined,
      lastname: undefined,
      facebookId: undefined,
      githubId: undefined,
      links: {
        lead: undefined,
      },
    },
    lead: {
      optinNewsletter: false,
      optinBlog: false,
      optinGithub: false,
      githubUsername: null,
    },
    isSaving: false,
  };

  async componentDidMount() {
    this.setState({ user: Object.assign({}, this.props.user) });

    if (this.props.user.links.lead) {
      const data = await this.props.dispatch(getLead(this.props.user.links.lead));
      this.setState({
        lead: {
          ...this.state.lead,
          ...{
            optinNewsletter: data.optinNewsletter,
            optinBlog: data.optinBlog,
            optinGithub: data.optinGithub,
            githubUsername: data.githubUsername,
          },
        },
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.setState({ user: Object.assign({}, this.props.user) });

      if (this.props.user.links.lead) {
        this.props.dispatch(getLead(this.props.user.links.lead)).then((data) => {
          this.setState({
            lead: {
              ...this.state.lead,
              ...{
                optinNewsletter: data.optinNewsletter,
                optinBlog: data.optinBlog,
                optinGithub: data.optinGithub,
                githubUsername: data.githubUsername,
              },
            },
          });
        });
      }
    }
  }

  onUpdateFirstname = (event) => {
    this.setState({
      user: { ...this.state.user, ...{ firstname: event.target.value } },
    });
  };

  onUpdateLastname = (event) => {
    this.setState({
      user: { ...this.state.user, ...{ lastname: event.target.value } },
    });
  };

  onUpdateUsername = (event) => {
    this.setState({
      user: { ...this.state.user, ...{ username: event.target.value } },
    });
  };

  onUpdateApiKey = (event) => {
    this.setState({
      user: { ...this.state.user, ...{ apiKey: event.target.value } },
    });
  };

  onRevokeFacebook = (event) => {
    event.preventDefault();
    this.setState({ user: { ...this.state.user, ...{ facebookId: null } } }, this.onUpdate);
  };

  onRevokeGithub = (event) => {
    event.preventDefault();
    this.setState({ user: { ...this.state.user, ...{ githubId: null } } }, this.onUpdate);
  };

  onChangeOptinNewsletter = (value) => {
    this.setState({
      lead: { ...this.state.lead, ...{ optinNewsletter: value } },
    });
  };

  onChangeOptinBlog = (value) => {
    this.setState({
      lead: { ...this.state.lead, ...{ optinBlog: value } },
    });
  };

  onChangeOptinGithub = (value) => {
    this.setState({
      lead: { ...this.state.lead, ...{ optinGithub: value } },
    });
  };

  onUpdate = (event) => {
    if (event) {
      event.preventDefault();
    }

    const { user, lead } = this.state;

    new Promise((resolve) => {
      this.setState({ isSaving: true }, resolve);
    })
      .then(() => {
        if (user.links.lead) {
          return this.props.dispatch(
            updateLead(user.links.lead, {
              optinNewsletter: lead.optinNewsletter,
              optinBlog: lead.optinBlog,
              optinGithub: lead.optinGithub,
            })
          );
        }

        if (lead.optinNewsletter || lead.optinBlog) {
          return this.props.dispatch(
            createLead({
              email: user.email,
              optinNewsletter: lead.optinNewsletter,
              optinBlog: lead.optinBlog,
            })
          );
        }
      })
      .then(() => {
        return this.props.dispatch(updateSettings(user, this.props.auth.token));
      })
      .then(() => {
        this.setState({ isSaving: false });
      });
  };

  generateKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    let apiKey = '';
    for (let i = 0; i < 32; i++) {
      apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.props.dispatch(commitUpdateSettings({ ...this.props.user, ...{ apiKey: apiKey } }));
  };

  getClipboard = (user) => {
    if (user.apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${user.apiKey}`;
    }

    return null;
  };

  onCopyApiUsage = (event) => {
    const { user } = this.state;
    const clipboard = this.getClipboard(user);

    copyTextToClipboard(clipboard);
  };

  render() {
    const { user, lead, isSaving } = this.state;
    const clipboard = this.getClipboard(user);

    return (
      <section className="section container-fluid">
        <h3 className="box-title">Settings</h3>
        <form className="form-sm-horizontal">
          <div className="row mb-3">
            <label htmlFor="settings_firstname" className="col-sm-2 col-form-label">
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
          <div className="row mb-3">
            <label htmlFor="settings_lastname" className="col-sm-2 col-form-label">
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
          <div className="row mb-3">
            <label htmlFor="settings_username" className="col-sm-2 col-form-label">
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
          <div className="row mb-3">
            <label htmlFor="settings_username" className="col-sm-2 col-form-label">
              Facebook
            </label>
            <div className="col-sm-10">
              <div className="d-grid">
                {(user.facebookId && (
                  <button onClick={this.onRevokeFacebook} className="btn btn-info">
                    <FontAwesomeIcon icon={faFacebookF} /> Revoke Facebook
                  </button>
                )) || (
                  <a
                    href={facebookLoginUrl(env.get('facebookAppId'))}
                    className="btn btn-social btn-facebook"
                  >
                    <FontAwesomeIcon icon={faFacebookF} /> Connect with Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="settings_username" className="col-sm-2 col-form-label">
              Github
            </label>
            <div className="col-sm-10">
              <div className="d-grid">
                {(user.githubId && (
                  <button onClick={this.onRevokeGithub} className="btn btn-info">
                    <FontAwesomeIcon icon={faGithub} /> Revoke Github
                  </button>
                )) || (
                  <a
                    href={githubLoginUrl(env.get('githubAppId'))}
                    className="btn btn-social btn-github"
                  >
                    <FontAwesomeIcon icon={faGithub} /> Connect with Github
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="settings_apiKey" className="col-sm-2 col-form-label">
              Api key
            </label>
            <div className="col-sm-10">
              <div className="input-group">
                <button type="button" className="input-group-text" onClick={this.generateKey}>
                  Generate
                </button>
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
          <div className="row mb-3">
            <label htmlFor="settings_key" className="col-sm-2 col-form-label">
              Api usage
            </label>
            <div className="col-sm-10">
              <div className="input-group">
                <button type="button" className="input-group-text" onClick={this.onCopyApiUsage}>
                  <FontAwesomeIcon icon={faClipboard} />
                </button>
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
                onChange={this.onChangeOptinNewsletter}
                id="notifications_optinNewsletter_{{ _uid }}"
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="notifications_optinBlog_{{ _uid }}" className="col-sm-2 col-form-label">
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
                  onChange={this.onChangeOptinGithub}
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
                  disabled={isSaving}
                  onClick={this.onUpdate}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  }
}

export default connect((state) => {
  return {
    auth: state.auth,
    user: state.user,
  };
})(Settings);
