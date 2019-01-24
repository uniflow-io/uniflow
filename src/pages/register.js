import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
  register,
  loginFacebookUrl,
  loginGithubUrl
} from '../reducers/auth/actions'
import {pathTo} from '../routes'
import {commitAddLog} from '../reducers/logs/actions'
import {Link, navigate} from 'gatsby'
import Layout from "../layouts";

class Register extends Component {
  state = {
    email: null,
    password: null
  }

  onChangeEmail = (event) => {
    this.setState({email: event.target.value})
  }

  onChangePassword = (event) => {
    this.setState({password: event.target.value})
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.props.dispatch(register(this.state.email, this.state.password))
      .then(() => {
        if (this.props.auth.isAuthenticated) {
          return navigate(pathTo('feed'))
        } else {
          return this.props.dispatch(commitAddLog(this.props.auth.statusText))
        }
      })
  }

  render() {
    const {auth, env}       = this.props
    const {email, password} = this.state

    return (
      <Layout>
        <div className='content-wrapper'>

          <section className='content-header'>
            <h1>
              Register
              <small>Control panel</small>
            </h1>
            <ol className='breadcrumb'>
              <li><Link to={pathTo('home')}><i className='fa fa-dashboard'/> Home</Link></li>
              <li className='active'>Register</li>
            </ol>
          </section>

          <div className='container-fluid content content-register'>

            <div className='row'>
              <div className='col-sm-6 col-sm-offset-3'>
                <div className='box box-default'>
                  <div className='box-header with-border'>
                    <h3 className='box-title'>Register</h3>
                  </div>
                  <div className='box-body'>

                    <form>

                      <div className='form-group col-sm-12'>
                        <input className='form-control' id='email{{ _uid }}' type='text'
                               value={email || ''}
                               onChange={this.onChangeEmail} placeholder='Email'/>
                      </div>

                      <div className='form-group col-sm-12'>
                        <input className='form-control' id='password{{ _uid }}' type='password'
                               value={password || ''}
                               onChange={this.onChangePassword} placeholder='Password'/>
                      </div>

                      <div className='form-group col-sm-12'>
                        <button type='submit'
                                className='btn btn-primary btn-block btn-flat'
                                disabled={auth.isAuthenticating}
                                onClick={this.onSubmit}>Register
                        </button>
                      </div>

                      <div className='form-group col-sm-12'>
                        <a href={loginFacebookUrl(env.facebookAppId)}
                           className='btn btn-block btn-social btn-facebook'>
                          <i className='fa fa-facebook'/> Register with Facebook
                        </a>
                      </div>

                      <div className='form-group col-sm-12'>
                        <a href={loginGithubUrl(env.githubAppId)}
                           className='btn btn-block btn-social btn-github'>
                          <i className='fa fa-github'/> Register with Github
                        </a>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Layout>
    )
  }
}

export default connect(state => {
  return {
    auth: state.auth,
    env: state.env
  }
})(Register)
