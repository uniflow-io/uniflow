import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import Helmet from 'react-helmet'
import { Link, graphql, StaticQuery } from 'gatsby'
import { connect } from 'react-redux'
import routes, { pathTo } from '../routes'
import { UserManager } from '../components'
import { getNewLogs, commitReadLog } from '../reducers/logs/actions'
import { commitLogoutUser } from '../reducers/auth/actions'
import { isGranted } from '../reducers/user/actions'
import { applyTheme, switchTheme } from '../reducers/app/actions'
import { matchPath } from '../utils'

class MessengerPlatform extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <script
            type="text/javascript"
            innerHTML={`
            window.fbAsyncInit = function() {
                FB.init({
                  xfbml            : true,
                  version          : 'v3.2'
                });
              };

              (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
            `}
          />
        </Helmet>

        {/* Load Facebook SDK for JavaScript */}
        <div id="fb-root" />

        {/* Your customer chat code */}
        <div
          className="fb-customerchat"
          attribution="setup_tool"
          page_id="1899593680350111"
        />
      </div>
    )
  }
}

class Alert extends Component {
  componentDidMount() {
    const { alert, logs } = this.props

    setTimeout(() => {
      this.props.dispatch(commitReadLog(logs[alert].id))
    }, 5000)
  }

  onClose = (event, id) => {
    event.preventDefault()

    this.props.dispatch(commitReadLog(id))
  }

  render() {
    const { alert, logs } = this.props

    return (
      <div
        className="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        {logs[alert].message}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClick={event => this.onClose(event, logs[alert].id)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    )
  }
}

Alert = connect(state => ({
  logs: getNewLogs(state.logs),
}))(Alert)

class Alerts extends Component {
  render() {
    const { logs } = this.props

    return (
      <>
        {Object.keys(logs).map((key, index) => (
          <Alert key={key} alert={key} />
        ))}
      </>
    )
  }
}

Alerts = connect(state => ({
  logs: getNewLogs(state.logs),
}))(Alerts)

class Header extends Component {
  onLocation = location => {
    if (
      matchPath(location.pathname, {
        path: routes.home.path,
        exact: true,
      })
    ) {
      return 'home'
    } else if (
      matchPath(location.pathname, {
        path: routes.flows.path,
        exact: true,
      })
    ) {
      return 'flows'
    } else if (
      matchPath(location.pathname, {
        path: routes.doc.path,
        exact: true,
      })
    ) {
      return 'doc'
    } else if (
      matchPath(location.pathname, {
        path: routes.settings.path,
        exact: true,
      })
    ) {
      return 'settings'
    } else if (
      matchPath(location.pathname, {
        path: routes.admin.path,
        exact: true,
      })
    ) {
      return 'admin'
    } else if (
      matchPath(location.pathname, {
        path: routes.blog.path,
        exact: true,
      }) ||
      matchPath(location.pathname, {
        path: routes.article.path,
      }) ||
      matchPath(location.pathname, {
        path: routes.contributor.path,
      }) ||
      matchPath(location.pathname, {
        path: routes.tags.path,
        exact: true,
      }) ||
      matchPath(location.pathname, {
        path: routes.tag.path,
      })
    ) {
      return 'blog'
    } else if (
      matchPath(location.pathname, {
        path: routes.library.path,
        exact: true,
      }) ||
      matchPath(location.pathname, {
        path: routes.card.path,
      })
    ) {
      return 'library'
    } else if (
      matchPath(location.pathname, {
        path: routes.changelog.path,
        exact: true,
      })
    ) {
      return 'changelog'
    } else if (
      matchPath(location.pathname, {
        path: routes.contact.path,
        exact: true,
      })
    ) {
      return 'contact'
    } else if (
      matchPath(location.pathname, {
        path: routes.login.path,
        exact: true,
      }) ||
      matchPath(location.pathname, {
        path: routes.register.path,
        exact: true,
      })
    ) {
      return 'login'
    } else if (
      matchPath(location.pathname, {
        path: routes.feed.path,
      }) ||
      matchPath(location.pathname, {
        path: routes.userFeed.path,
      })
    ) {
      return 'dashboard'
    }

    return null
  }

  onLogout = e => {
    e.preventDefault()

    this.props.dispatch(commitLogoutUser())
  }

  onChangeTheme = e => {
    e.preventDefault()

    this.props.dispatch(switchTheme(this.props.app.theme))
  }

  render() {
    const { auth, user, logo, changeLogTags } = this.props
    const active = this.onLocation(this.props.location)

    return (
      <>
        <header className="navbar navbar-top navbar-expand flex-row">
          <Link
            className="navbar-brand mr-0 mr-md-2"
            aria-label="Uniflow"
            to={pathTo('home')}
          >
            <img
              src={logo.publicURL}
              width="36"
              height="36"
              className="d-block"
              alt="Uniflow"
            />
          </Link>

          <div className="navbar-nav-scroll d-none d-md-flex">
            <ul className="navbar-nav bd-navbar-nav flex-row">
              <li className="nav-item">
                <Link
                  className={`nav-link${active === 'flows' ? ' active' : ''}`}
                  to={pathTo('flows')}
                >
                  Flows
                </Link>
              </li>
              {auth.isAuthenticated &&
                isGranted(user, 'ROLE_USER') &&
                user.uid === null && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link${
                        active === 'dashboard' ? ' active' : ''
                      }`}
                      to={pathTo('feed')}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              {auth.isAuthenticated &&
                isGranted(user, 'ROLE_USER') &&
                user.uid !== null && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link${
                        active === 'dashboard' ? ' active' : ''
                      }`}
                      to={pathTo('userFeed', { uid: user.uid })}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
              <li className="nav-item">
                <Link
                  className={`nav-link${active === 'library' ? ' active' : ''}`}
                  to={pathTo('library')}
                >
                  Library
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link${active === 'doc' ? ' active' : ''}`}
                  to={pathTo('doc')}
                >
                  Docs
                </Link>
              </li>
              {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && (
                <li className="nav-item">
                  <Link
                    className={`nav-link${
                      active === 'settings' ? ' active' : ''
                    }`}
                    to={pathTo('settings')}
                  >
                    Settings
                  </Link>
                </li>
              )}
              {auth.isAuthenticated && isGranted(user, 'ROLE_SUPER_ADMIN') && (
                <li className="nav-item">
                  <Link
                    className={`nav-link${active === 'admin' ? ' active' : ''}`}
                    to={pathTo('admin')}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link
                  className={`nav-link${active === 'blog' ? ' active' : ''}`}
                  to={pathTo('blog')}
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <ul className="navbar-nav flex-row ml-auto">
            <li className="nav-item">
              <Link
                className={`nav-item nav-link ${
                  active === 'changelog' ? ' active' : ''
                }`}
                to={pathTo('changelog')}
              >
                {changeLogTags.edges[0].node.tag}
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://github.com/uniflow-io/uniflow"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://twitter.com/uniflow_io"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="https://twitter.com/uniflow_io"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Theme"
                onClick={this.onChangeTheme}
              >
                {this.props.app.theme === 'light' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="svg-inline--fa fa-w-16"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )}
                {this.props.app.theme === 'dark' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="svg-inline--fa fa-w-16"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
                {this.props.app.theme === 'sepia' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="svg-inline--fa fa-w-16"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                )}
              </a>
            </li>
            {!auth.isAuthenticated && (
              <li className="nav-item">
                <Link
                  className={`nav-link${active === 'login' ? ' active' : ''}`}
                  to={pathTo('login')}
                >
                  Login
                </Link>
              </li>
            )}
            {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && (
              <li className="nav-item">
                <a
                  className={`nav-link${active === 'logout' ? ' active' : ''}`}
                  href="/logout"
                  onClick={this.onLogout}
                >
                  <FontAwesomeIcon icon={faPowerOff} />
                </a>
              </li>
            )}
          </ul>
        </header>
        <ul className="nav nav-bar-bottom fixed-bottom justify-content-center d-flex d-md-none">
          <li className="nav-item">
            <Link
              className={`nav-link${active === 'flows' ? ' active' : ''}`}
              to={pathTo('flows')}
            >
              Flows
            </Link>
          </li>
          {auth.isAuthenticated &&
            isGranted(user, 'ROLE_USER') &&
            user.uid === null && (
              <li className="nav-item">
                <Link
                  className={`nav-link${
                    active === 'dashboard' ? ' active' : ''
                  }`}
                  to={pathTo('feed')}
                >
                  Dashboard
                </Link>
              </li>
            )}
          {auth.isAuthenticated &&
            isGranted(user, 'ROLE_USER') &&
            user.uid !== null && (
              <li className="nav-item">
                <Link
                  className={`nav-link${
                    active === 'dashboard' ? ' active' : ''
                  }`}
                  to={pathTo('userFeed', { uid: user.uid })}
                >
                  Dashboard
                </Link>
              </li>
            )}
          <li className="nav-item">
            <Link
              className={`nav-link${active === 'library' ? ' active' : ''}`}
              to={pathTo('library')}
            >
              Library
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link${active === 'doc' ? ' active' : ''}`}
              to={pathTo('doc')}
            >
              Docs
            </Link>
          </li>
          {auth.isAuthenticated && isGranted(user, 'ROLE_USER') && (
            <li className="nav-item">
              <Link
                className={`nav-link${active === 'settings' ? ' active' : ''}`}
                to={pathTo('settings')}
              >
                Settings
              </Link>
            </li>
          )}
          {auth.isAuthenticated && isGranted(user, 'ROLE_SUPER_ADMIN') && (
            <li className="nav-item">
              <Link
                className={`nav-link${active === 'admin' ? ' active' : ''}`}
                to={pathTo('admin')}
              >
                Admin
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link
              className={`nav-link${active === 'blog' ? ' active' : ''}`}
              to={pathTo('blog')}
            >
              Blog
            </Link>
          </li>
        </ul>
      </>
    )
  }
}

Header = connect(state => ({
  app: state.app,
  auth: state.auth,
  user: state.user,
}))(Header)

class Footer extends Component {
  render() {
    return (
      <footer className="text-muted d-flex border-top">
        <div className="container-fluid">
          <ul className="nav nav-bottom justify-content-end">
            <li className="nav-item">
              <Link className="nav-link" to={pathTo('contact')}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    )
  }
}

class Layout extends Component {
  componentDidMount() {
    this.props.dispatch(applyTheme())
  }

  render() {
    const { app, env } = this.props

    return (
      <StaticQuery
        query={graphql`
          query LayoutQuery {
            site {
              siteMetadata {
                title
                description
              }
            }
            logo: file(
              sourceInstanceName: { eq: "images" }
              relativePath: { eq: "logo.svg" }
            ) {
              publicURL
            }
            logoSeo: file(
              sourceInstanceName: { eq: "images" }
              relativePath: { eq: "logo.png" }
            ) {
              publicURL
            }
            changeLogTags: allChangelogYaml(limit: 1) {
              edges {
                node {
                  tag
                }
              }
            }
          }
        `}
        render={({ site: { siteMetadata }, logo, logoSeo, changeLogTags }) => (
          <>
            <Helmet>
              <html lang="en" />
              <body id={app.page} className={`theme-${app.theme}`} />

              <meta charSet="utf-8" />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
              />
              <title>{siteMetadata.title}</title>
              <meta name="description" content={siteMetadata.description} />

              <meta property="og:title" content={siteMetadata.title} />
              <meta
                property="og:description"
                content={siteMetadata.description}
              />
              <meta property="og:url" content={env.url} />
              <meta property="og:type" content="website" />
              <meta property="og:locale" content="en" />
              <meta property="og:site_name" content={siteMetadata.title} />
              <meta
                property="og:image"
                content={`${env.url}${logoSeo.publicURL}`}
              />
              <meta property="og:image:width" content="512" />
              <meta property="og:image:height" content="512" />

              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:site" content="uniflow_io" />
              <meta name="twitter:title" content={siteMetadata.title} />
              <meta
                name="twitter:description"
                content={siteMetadata.description}
              />
              <meta
                name="twitter:image"
                content={`${env.url}${logo.publicURL}`}
              />
            </Helmet>
            <UserManager location={this.props.location} />
            {[
              /*'production', 'preprod'*/
            ].indexOf(env.env) !== -1 && <MessengerPlatform />}
            <Header
              location={this.props.location}
              logo={logo}
              changeLogTags={changeLogTags}
            />
            <Alerts />
            {this.props.children}
            <Footer />
          </>
        )}
      />
    )
  }
}

Layout = connect(state => ({
  app: state.app,
  env: state.env,
}))(Layout)

export default Layout
