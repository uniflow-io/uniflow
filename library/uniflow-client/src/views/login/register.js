import React, { Component } from "react"
import { connect } from "react-redux"
import { register, facebookLoginUrl, githubLoginUrl } from "../../reducers/auth/actions"
import { pathTo } from "../../routes"
import { commitAddLog } from "../../reducers/logs/actions"
import { navigate } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons"
import { faFacebookF, faGithub } from "@fortawesome/free-brands-svg-icons"

class Register extends Component {
  state = {
    email: "",
    password: "",
  }

  onChangeEmail = (event) => {
    this.setState({ email: event.target.value })
  }

  onChangePassword = (event) => {
    this.setState({ password: event.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.props.dispatch(register(this.state.email, this.state.password)).then(() => {
      if (this.props.auth.isAuthenticated) {
        return navigate(pathTo("feed"))
      } else {
        return this.props.dispatch(commitAddLog(this.props.auth.statusText))
      }
    })
  }

  render() {
    const { auth, env } = this.props
    const { email, password } = this.state

    return (
      <section className="section container-fluid">
        <h3>Register</h3>
        <div className="row">
          <div className="col-sm-6 offset-sm-3">
            <div className="card">
              <article className="card-body">
                <form>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                      </div>
                      <input
                        className="form-control"
                        id="email{{ _uid }}"
                        type="text"
                        value={email || ""}
                        onChange={this.onChangeEmail}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faKey} />
                        </div>
                      </div>
                      <input
                        className="form-control"
                        id="password{{ _uid }}"
                        type="password"
                        value={password || ""}
                        onChange={this.onChangePassword}
                        placeholder="Password"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          disabled={auth.isAuthenticating}
                          onClick={this.onSubmit}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                {env.facebookAppId && (
                  <p>
                    <a href={facebookLoginUrl(env.facebookAppId)} className="btn btn-block btn-social btn-facebook">
                      <FontAwesomeIcon icon={faFacebookF} /> Register with Facebook
                    </a>
                  </p>
                )}
                {env.githubAppId && (
                  <p>
                    <a href={githubLoginUrl(env.githubAppId)} className="btn btn-block btn-social btn-github">
                      <FontAwesomeIcon icon={faGithub} /> Register with Github
                    </a>
                  </p>
                )}
              </article>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default connect((state) => {
  return {
    auth: state.auth,
    env: state.env,
  }
})(Register)
