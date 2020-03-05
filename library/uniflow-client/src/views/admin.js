import React, { Component } from 'react'
import { fetchConfig, updateConfig } from '../reducers/config/actions'
import { connect } from 'react-redux'
import { mediumLoginUrl } from '../reducers/auth/actions'
import { faMedium } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Admin extends Component {
  state = {
    config: {
      mediumToken: null,
    },
    isSaving: false,
  }

  componentDidMount() {
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

  render() {
    const { env } = this.props
    const { config } = this.state

    return (
      <>
        <section className="section container-fluid">
          <h3 className="box-title">Admin</h3>
          <form className="form-sm-horizontal">
            <div className="form-group row">
              <label
                htmlFor="admin_medium"
                className="col-sm-2 col-form-label"
              >Medium</label>
              <div className="col-sm-10">
                {(config.mediumToken && (
                  <button
                    onClick={this.onRevokeMedium}
                    className="btn btn-info"
                  >
                    <FontAwesomeIcon icon={faMedium} /> Revoke Medium
                  </button>
                )) || (
                  <a
                    href={mediumLoginUrl(env.mediumAppId)}
                    className="btn btn-block btn-social btn-medium"
                  >
                    <FontAwesomeIcon icon={faMedium} /> Connect with Medium
                  </a>
                )}
              </div>
            </div>
          </form>
        </section>
      </>
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
