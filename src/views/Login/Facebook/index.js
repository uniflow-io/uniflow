import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { pathTo } from '../../../routes'
import { withRouter } from 'react-router'
import { loginFacebook } from '../../../reducers/auth/actions'
import { commitAddLog } from '../../../reducers/logs/actions'
import connect from 'react-redux/es/connect/connect'

class LoginFacebook extends Component {
  componentWillMount () {
    let accessToken = this.getAccessToken()
    if (accessToken === null) {
      return this.props.history.push(pathTo('login'))
    }

    this.props.dispatch(loginFacebook(accessToken, this.props.auth.token))
      .then(() => {
        if (this.props.auth.isAuthenticated) {
          return this.props.history.push(pathTo('dashboard'))
        } else {
          this.props.dispatch(commitAddLog(this.props.auth.statusText))
          return this.props.history.push(pathTo('login'))
        }
      })
  }

  getAccessToken () {
    let m = this.props.location.hash.match(/access_token=([^&]*)/)
    if (m) {
      return m[1]
    }

    return null
  }

  render () {
    return (
      <div className='content-wrapper'>

        <section className='content-header'>
          <h1>
                        Login Facebook
            <small>Control panel</small>
          </h1>
          <ol className='breadcrumb'>
            <li><Link to={pathTo('home')}><i className='fa fa-dashboard' /> Home</Link></li>
            <li className='active'>Login</li>
          </ol>
        </section>

        <div className='container-fluid content content-login'>

          <div className='row'>
            <div className='col-sm-6 col-sm-offset-3'>
              <div className='box box-default'>
                <div className='box-header with-border'>
                  <h3 className='box-title'>Login Facebook</h3>
                </div>
                <div className='box-body'>
                  <p>Application is currently logging you from Facebook</p>
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
    auth: state.auth
  }
})(withRouter(LoginFacebook))
