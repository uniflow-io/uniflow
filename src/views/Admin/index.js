import React, { Component } from 'react'
import { fetchConfig, updateConfig } from '../../reducers/config/actions'
import { connect } from 'react-redux'
import { pathTo } from '../../routes'
import { Link } from 'gatsby'
import { loginMediumUrl } from '../../reducers/auth/actions'

class Admin extends Component {
  state = {
    config: {
      mediumToken: null,
    },
    isSaving: false,
  }

  componentDidMount () {
    this.props.dispatch(fetchConfig(this.props.auth.token)).then(response => {
      this.setState({
        config: Object.assign({}, this.state.config, response.data),
      })
    })
  }

  onRevokeMedium = event => {
    event.preventDefault()
    this.setState(
      { config: { ...this.state.config, ...{ mediumToken: null } } },
      this.onUpdate
    )
  }

  onUpdate = event => {
    if (event) {
      event.preventDefault()
    }

    this.setState({ isSaving: true }, () => {
      this.props
        .dispatch(updateConfig(this.state.config, this.props.auth.token))
        .then(() => {
          this.setState({ isSaving: false })
        })
    })
  }

  render () {
    const { env } = this.props
    const { config } = this.state

    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Admin
            <small>Control panel</small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <Link to={pathTo('home')}>
                <i className="fa fa-dashboard" /> Home
              </Link>
            </li>
            <li className="active">Admin</li>
          </ol>
        </section>

        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <form className="form-horizontal">
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">Admin</h3>
                  </div>
                  <div className="box-body">
                    <div className="form-group">
                      <label className="col-sm-2 control-label">Medium</label>
                      <div className="col-sm-10">
                        {(config.mediumToken && (
                          <button
                            onClick={this.onRevokeMedium}
                            className="btn btn-info"
                          >
                            <i className="fa fa-medium" /> Revoke Medium
                          </button>
                        )) || (
                          <a
                            href={loginMediumUrl(env.mediumAppId)}
                            className="btn btn-block btn-social btn-medium"
                          >
                            <i className="fa fa-medium" /> Connect with Medium
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    env: state.env,
    user: state.user,
  }
})(Admin)
