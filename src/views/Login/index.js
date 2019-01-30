import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  login,
  loginFacebookUrl,
  loginGithubUrl
} from '../../reducers/auth/actions'
import { pathTo } from '../../routes'
import { commitAddLog } from '../../reducers/logs/actions'
import { Link, navigate } from 'gatsby'

class Index extends Component {
  state = {
    username: null,
    password: null,
  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  onSubmit = e => {
    e.preventDefault()

    this.props
      .dispatch(login(this.state.username, this.state.password))
      .then(() => {
        if (this.props.auth.isAuthenticated) {
          return navigate(pathTo('feed'))
        } else {
          return this.props.dispatch(commitAddLog(this.props.auth.statusText))
        }
      })
  }

  render () {
    const { auth, env } = this.props
    const { username, password } = this.state

    return (
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            Login
            <small>Control panel</small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <Link to={pathTo('home')}>
                <i className="fa fa-dashboard" /> Home
              </Link>
            </li>
            <li className="active">Login</li>
          </ol>
        </section>

        <div className="container-fluid content content-login">
          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              <div className="box box-default">
                <div className="box-header with-border">
                  <h3 className="box-title">Login</h3>
                </div>
                <div className="box-body">
                  <form>
                    <div className="form-group col-sm-12">
                      <input
                        className="form-control"
                        id="username{{ _uid }}"
                        type="text"
                        value={username || ''}
                        onChange={this.onChangeUsername}
                        placeholder="Email or Username"
                      />
                    </div>

                    <div className="form-group col-sm-12">
                      <input
                        className="form-control"
                        id="password{{ _uid }}"
                        type="password"
                        value={password || ''}
                        onChange={this.onChangePassword}
                        placeholder="Password"
                      />
                    </div>

                    <div className="form-group col-sm-12">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block btn-flat"
                        disabled={auth.isAuthenticating}
                        onClick={this.onSubmit}
                      >
                        Login
                      </button>
                    </div>

                    <div className="form-group col-sm-12">
                      <a
                        href={loginFacebookUrl(env.facebookAppId)}
                        className="btn btn-block btn-social btn-facebook"
                      >
                        <i className="fa fa-facebook" /> Login with Facebook
                      </a>
                    </div>

                    <div className="form-group col-sm-12">
                      <a
                        href={loginGithubUrl(env.githubAppId)}
                        className="btn btn-block btn-social btn-github"
                      >
                        <i className="fa fa-github" /> Login with Github
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-sm-offset-3">
              <p>
                <Link to={pathTo('register')}>
                  <span
                    className="glyphicon glyphicon-log-in register"
                    aria-hidden="true"
                  />{' '}
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    env: state.env,
  }
})(Index)
