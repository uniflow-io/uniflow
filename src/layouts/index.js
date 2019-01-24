import favicon from '../../content/favicon.ico'

// <!-- Bootstrap CSS -->
import '../../content/js/plugins/bootstrap/css/bootstrap.min.css'

// <!-- Font Awesome -->
import '../../content/css/font-awesome.min.css'
// <!-- Ionicons -->
import '../../content/css/ionicons.min.css'
// <!-- iCheck -->
import '../../content/js/plugins/iCheck/all.css'
// <!-- Date Picker -->
import '../../content/js/plugins/datepicker/datepicker3.css'
// <!-- Select2 -->
import '../../content/js/plugins/select2/select2.min.css'
// <!-- Tag It -->
import '../../content/js/plugins/tagit/css/jquery.tagit.css'
import '../../content/js/plugins/tagit/css/tagit.ui-zendesk.css'
// <!-- Daterange picker -->
import '../../content/js/plugins/daterangepicker/daterangepicker-bs3.css'
// <!-- bootstrap wysihtml5 - text editor -->
import '../../content/js/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css'

// <!-- Theme style -->
import '../../content/css/AdminLTE.css'

// <!-- AdminLTE Skins. Choose a skin from the css/skins
//      folder instead of downloading all of them to reduce the load. -->
import '../../content/css/skins/_all-skins.min.css'
import '../../content/css/uniflow.css'

import React, {Component} from 'react'
import Helmet from 'react-helmet'
import {Link} from 'gatsby'
import {connect} from 'react-redux'
import routes, {pathTo} from './../routes'
import {UserManagerComponent} from './../components'
import {getNewLogs, commitReadLog} from './../reducers/logs/actions'
import {commitLogoutUser} from './../reducers/auth/actions'
import {isGranted} from './../reducers/user/actions'
import {getLastVersion} from './../reducers/versions/actions'
import {matchPath} from '../utils'

class Alert extends Component {
  componentDidMount() {
    const {alert, logs} = this.props

    setTimeout(() => {
      this.props.dispatch(commitReadLog(logs[alert].id))
    }, 5000)
  }

  onClose = (event, id) => {
    event.preventDefault()

    this.props.dispatch(commitReadLog(id))
  }

  render() {
    const {alert, logs} = this.props

    return (
      <div className='alert alert-danger' style={{marginBottom: '0px'}}>
        <button type='button' className='close' aria-hidden='true'
                onClick={(event) => this.onClose(event, logs[alert].id)}>×
        </button>
        <h4><i className='icon fa fa-ban'/> {logs[alert].message}</h4>
      </div>
    )
  }
}

Alert = connect(state => ({
  logs: getNewLogs(state.logs)
}))(Alert)

class Alerts extends Component {
  render() {
    const {logs} = this.props

    return (
      <div>
        {Object.keys(logs).map((key, index) => (
          <Alert key={key} alert={key}/>
        ))}
      </div>
    )
  }
}

Alerts = connect(state => ({
  logs: getNewLogs(state.logs)
}))(Alerts)

class Header extends Component {
  onLocation = (location) => {
    let active = null

    if (matchPath(location.pathname, {
      path: routes.home.path,
      exact: true
    })) {
      active = 'home'
    } else if (matchPath(location.pathname, {
      path: routes.faq.path,
      exact: true
    })) {
      active = 'faq'
    } else if (matchPath(location.pathname, {
      path: routes.settings.path,
      exact: true
    })) {
      active = 'settings'
    } else if (matchPath(location.pathname, {
      path: routes.admin.path,
      exact: true
    })) {
      active = 'admin'
    } else if (matchPath(location.pathname, {
      path: routes.blog.path,
      exact: true
    })) {
      active = 'blog'
    } else if (matchPath(location.pathname, {
      path: routes.login.path,
      exact: true
    })) {
      active = 'login'
    } else if (matchPath(location.pathname, {
      path: routes.register.path,
      exact: true
    })) {
      active = 'login'
    } else if (matchPath(location.pathname, {
      path: routes.feed.path
    }) || matchPath(location.pathname, {
      path: routes.userFeed.path
    })) {
      active = 'dashboard'
    }

    return active
  }

  onLogout = (e) => {
    e.preventDefault()

    this.props.dispatch(commitLogoutUser())
  }

  render() {
    const {auth, user} = this.props
    const active       = this.onLocation(this.props.location)

    return (
      <header className='main-header'>
        <nav className='navbar navbar-static-top'>
          <div className='navbar-custom-menu'>
            <ul className='nav navbar-nav'>
              <li className={active === 'home' ? 'active' : ''}>
                <Link to={pathTo('home')}>Home</Link>
              </li>
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && user.username === null && (
                <li className={active === 'dashboard' ? 'active' : ''}>
                  <Link to={pathTo('feed')}>Dashboard</Link>
                </li>
              )}
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && user.username !== null && (
                <li className={active === 'dashboard' ? 'active' : ''}>
                  <Link to={pathTo('userFeed', {username: user.username})}>Dashboard</Link>
                </li>
              )}
              <li className={active === 'faq' ? 'active' : ''}>
                <Link to={pathTo('faq')}>FAQ</Link>
              </li>
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && (
                <li className={active === 'settings' ? 'active' : ''}>
                  <Link to={pathTo('settings')}>Settings</Link>
                </li>
              )}
              {auth.isAuthenticated && isGranted(user, 'ROLE_SUPER_ADMIN') && (
                <li className={active === 'admin' ? 'active' : ''}>
                  <Link to={pathTo('admin')}>Admin</Link>
                </li>
              )}
              <li className={active === 'blog' ? 'active' : ''}>
                <Link to={pathTo('blog')}>Blog</Link>
              </li>
              {!auth.isAuthenticated && (
                <li className={active === 'login' ? 'active' : ''}>
                  <Link to={pathTo('login')}>Login</Link>
                </li>
              )}
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && (
                <li className={active === 'logout' ? 'active' : ''}>
                  <a onClick={this.onLogout}><span className='glyphicon glyphicon-off logout' aria-hidden='true'/></a>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>
    )
  }
}

Header = connect(state => ({
  auth: state.auth,
  user: state.user
}))(Header)

class Footer extends Component {
  render() {
    const {version} = this.props

    return (
      <footer className='main-footer'>
        <div className='pull-right hidden-xs'>
          <Link to={pathTo('versions')}><b>Version</b> {version}</Link>
        </div>
        <a className='btn' href='https://github.com/uniflow-io/uniflow' target='_blank'><i
          className='fa fa-github'/></a>
        <a className='btn' href='https://www.facebook.com/uniflow.io' target='_blank'><i
          className='fa fa-facebook'/></a>
        <a className='btn' href='https://twitter.com/uniflow_io' target='_blank'><i className='fa fa-twitter'/></a>
        <a className='btn' href='https://medium.com/@uniflow.io' target='_blank'><i className='fa fa-medium'/></a>
      </footer>
    )
  }
}

Footer = connect(state => ({
  version: getLastVersion(state.versions)
}))(Footer)

export default class Layout extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <html lang="en"/>
          <body className="hold-transition skin-blue sidebar-mini"/>

          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
          <meta http-equiv="x-ua-compatible" content="ie=edge"/>
          <title>Uniflow</title>

          <link rel="icon" href={favicon}/>

          <link
            href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i,900,900i|Lustria|Playfair+Display:400,400i,700,700i,900,900i"
            rel="stylesheet"/>

          {/*<script async src="https://www.googletagmanager.com/gtag/js?id=UA-2319330-13" />
                <script>
                    window.dataLayer = window.dataLayer || [];

                    function gtag() {
                        dataLayer.push(arguments);
                    }

                    gtag('js', new Date());

                    gtag('config', 'UA-2319330-13');
                </script>*/}
        </Helmet>
        {/*<UserManagerComponent/>*/}

        <div className='wrapper'>

          <Alerts/>
          <Header location={this.props.location}/>

          {this.props.children}

          <Footer/>
        </div>
      </div>
    )
  }
}
