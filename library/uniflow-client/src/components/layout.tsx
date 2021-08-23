import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useLocation } from "@reach/router";
import Helmet from 'react-helmet';
import { Link, graphql, StaticQuery } from 'gatsby';
import { WindowLocation } from '@reach/router';
import routes, { pathTo } from '../routes';
import { UserManager } from '.';
import { getNewLogs, commitReadLog } from '../contexts/logs';
import { commitLogoutUser } from '../contexts/user';
import { isGranted } from '../contexts/user';
import { useApp, useAuth, useLogs, useUser } from '../contexts';
import Container from '../container';
import { Path } from '../services';
import { Env } from '../services';
import { useEffect } from 'react';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import { ROLE } from '../models/api-type-interface';
import { Log } from '../models';

const container = new Container();
const path = container.get(Path);
const env = container.get(Env);

function MessengerPlatform() {
  return (
    <div>
      <Helmet>
        <script
          type="text/javascript"
          src={`
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
      {(React.createElement('div', {
        className: "fb-customerchat",
        attribution: "setup_tool",
        page_id: "1899593680350111",
      }))}
    </div>
  );
}

interface AlertProps {
  log: Log
}

function Alert(props: AlertProps) {
  const { log } = props;
  const { logsDispatch } = useLogs();

  useEffect(() => {
    setTimeout(() => {
      commitReadLog(log.id)(logsDispatch);
    }, 5000);
  }, [])

  const onClose: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    commitReadLog(log.id)(logsDispatch);
  };

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlinkHref="#exclamation-triangle-fill"/></svg>
      {log.message}
      <button
        type="button"
        className="btn-close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
}

function Alerts() {
  const { logs } = useLogs();
  const newLogs = getNewLogs(logs)

  return (
    <>
      {Object.keys(newLogs).map((log, index) => (
        <Alert key={index} log={logs[log]} />
      ))}
    </>
  );
}

interface HeaderProps {
  logo: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
    publicURL: string
  }
  changeLogTags: {
    edges: [{
      node: {
        tag: string
      }
    }]
  }
}

function Header(props: HeaderProps) {
  const { logo, changeLogTags } = props;
  const app = useApp();
  const { auth } = useAuth();
  const { user, userDispatch } = useUser()
  const {authDispatch} = useAuth()
  const location = useLocation()

  const onLocation = (location: WindowLocation) => {
    if (
      path.matchPath(location.pathname, {
        path: routes.home.path,
        exact: true,
      })
    ) {
      return 'home';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.flows.path,
        exact: true,
      })
    ) {
      return 'flows';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.doc.path,
        exact: true,
      })
    ) {
      return 'doc';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.settings.path,
        exact: true,
      })
    ) {
      return 'settings';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.admin.path,
        exact: true,
      })
    ) {
      return 'admin';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.blog.path,
        exact: true,
      }) ||
      path.matchPath(location.pathname, {
        path: routes.article.path,
      }) ||
      path.matchPath(location.pathname, {
        path: routes.contributor.path,
      }) ||
      path.matchPath(location.pathname, {
        path: routes.tags.path,
        exact: true,
      }) ||
      path.matchPath(location.pathname, {
        path: routes.tag.path,
      })
    ) {
      return 'blog';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.library.path,
        exact: true,
      }) ||
      path.matchPath(location.pathname, {
        path: routes.card.path,
      })
    ) {
      return 'library';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.changelog.path,
        exact: true,
      })
    ) {
      return 'changelog';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.contact.path,
        exact: true,
      })
    ) {
      return 'contact';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.login.path,
        exact: true,
      }) ||
      path.matchPath(location.pathname, {
        path: routes.register.path,
        exact: true,
      })
    ) {
      return 'login';
    } else if (
      path.matchPath(location.pathname, {
        path: routes.feed.path,
      }) ||
      path.matchPath(location.pathname, {
        path: routes.userFeed.path,
      })
    ) {
      return 'dashboard';
    }

    return null;
  };

  const onLogout: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();

    commitLogoutUser()(userDispatch, authDispatch);
  };

  const active = onLocation(location);

  return (
    <>
      <header className="navbar navbar-top navbar-expand flex-row">
        <Link className="navbar-brand mr-0 mr-md-2" aria-label="Uniflow" to={pathTo('home')}>
          <img src={logo.publicURL} width="36" height="36" className="d-block" alt="Uniflow" />
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
            {auth.isAuthenticated && isGranted(user, ROLE.USER) && (
              <li className="nav-item">
                <Link
                  className={`nav-link${active === 'dashboard' ? ' active' : ''}`}
                  to={pathTo('feed')}
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
              <Link className={`nav-link${active === 'doc' ? ' active' : ''}`} to={pathTo('doc')}>
                Docs
              </Link>
            </li>
            {auth.isAuthenticated && isGranted(user, ROLE.USER) && (
              <li className="nav-item">
                <Link
                  className={`nav-link${active === 'settings' ? ' active' : ''}`}
                  to={pathTo('settings')}
                >
                  Settings
                </Link>
              </li>
            )}
            {auth.isAuthenticated && isGranted(user, ROLE.SUPER_ADMIN) && (
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
              <Link className={`nav-link${active === 'blog' ? ' active' : ''}`} to={pathTo('blog')}>
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <ul className="navbar-nav flex-row ms-auto">
          <li className="nav-item">
            <Link
              className={`nav-item nav-link ${active === 'changelog' ? ' active' : ''}`}
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
              href="#"
              aria-label="Theme"
              onClick={(event) => {
                event.preventDefault();
                app.switchTheme();
              }}
            >
              {app.theme === 'light' && (
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
              {app.theme === 'dark' && (
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
              {app.theme === 'sepia' && (
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
          {auth.isAuthenticated && isGranted(user, ROLE.USER) && (
            <li className="nav-item">
              <a
                className={`nav-link`}
                href="/logout"
                onClick={onLogout}
              >
                <FontAwesomeIcon icon={faPowerOff} />
              </a>
            </li>
          )}
        </ul>
      </header>
      <ul className="nav nav-bar-bottom fixed-bottom justify-content-center d-flex d-md-none">
        <li className="nav-item">
          <Link className={`nav-link${active === 'flows' ? ' active' : ''}`} to={pathTo('flows')}>
            Flows
          </Link>
        </li>
        {auth.isAuthenticated && isGranted(user, ROLE.USER) && (
          <li className="nav-item">
            <Link
              className={`nav-link${active === 'dashboard' ? ' active' : ''}`}
              to={pathTo('feed')}
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
          <Link className={`nav-link${active === 'doc' ? ' active' : ''}`} to={pathTo('doc')}>
            Docs
          </Link>
        </li>
        {auth.isAuthenticated && isGranted(user, ROLE.USER) && (
          <li className="nav-item">
            <Link
              className={`nav-link${active === 'settings' ? ' active' : ''}`}
              to={pathTo('settings')}
            >
              Settings
            </Link>
          </li>
        )}
        {auth.isAuthenticated && isGranted(user, ROLE.SUPER_ADMIN) && (
          <li className="nav-item">
            <Link className={`nav-link${active === 'admin' ? ' active' : ''}`} to={pathTo('admin')}>
              Admin
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link className={`nav-link${active === 'blog' ? ' active' : ''}`} to={pathTo('blog')}>
            Blog
          </Link>
        </li>
      </ul>
    </>
  );
}

function Footer() {
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
  );
}

export interface LayoutProps {
  location: WindowLocation
  children: React.ReactNode
}

function Layout(props: LayoutProps) {
  const app = useApp();
  const environement = env.get('env')

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
          logo: file(sourceInstanceName: { eq: "images" }, relativePath: { eq: "logo.svg" }) {
            publicURL
          }
          logoSeo: file(sourceInstanceName: { eq: "images" }, relativePath: { eq: "logo.png" }) {
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
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>{siteMetadata.title}</title>
            <meta name="description" content={siteMetadata.description} />

            <meta property="og:title" content={siteMetadata.title} />
            <meta property="og:description" content={siteMetadata.description} />
            <meta property="og:url" content={env.get('clientUrl')} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="en" />
            <meta property="og:site_name" content={siteMetadata.title} />
            <meta property="og:image" content={`${env.get('clientUrl')}${logoSeo.publicURL}`} />
            <meta property="og:image:width" content="512" />
            <meta property="og:image:height" content="512" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="uniflow_io" />
            <meta name="twitter:title" content={siteMetadata.title} />
            <meta name="twitter:description" content={siteMetadata.description} />
            <meta name="twitter:image" content={`${env.get('clientUrl')}${logo.publicURL}`} />
          </Helmet>
          <UserManager />
          {environement && ([
            /*'production', 'preprod'*/
          ] as string[]).indexOf(environement) !== -1 && <MessengerPlatform />}
          <svg xmlns="http://www.w3.org/2000/svg" style={{display: 'none'}}>
            <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </symbol>
            <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </symbol>
            <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </symbol>
          </svg>
          <Header logo={logo} changeLogTags={changeLogTags} />
          <Alerts />
          {props.children}
          <Footer />
        </>
      )}
    />
  );
}

export default Layout;
