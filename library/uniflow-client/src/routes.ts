import Home from './views/home'
import Login from './views/login/login'
import FacebookLogin from './views/login/facebook'
import GithubLogin from './views/login/github'
import Register from './views/login/register'
import Flows from './views/flows'
import Contact from './views/contact'
import Doc from './views/doc/doc'
import Newsletter from './views/newsletter'
import Notifications from './views/notifications'
import Changelog from './views/changelog'
import Contributor from './views/blog/contributor'
import Tag from './views/blog/tag'
import Tags from './views/blog/tags'
import Article from './views/blog/article'
import Blog from './views/blog/blog'
import Card from './views/library/card'
import Library from './views/library/library'
import Settings from './views/settings'
import Admin from './views/admin'
import Feed from './views/feed/feed'
import { compile } from 'path-to-regexp';
import { requireAuthentication } from './helpers';
import { Path } from './services';
import Container from './container';
import { ComponentType } from 'react';

const container = new Container();
const path = container.get(Path);

const routes: {[key: string]: {path: string, exact?: boolean, component: ComponentType<any>}} = {
  home: {
    path: '/',
    exact: true,
    component: Home,
  },
  login: {
    path: '/login',
    exact: true,
    component: Login,
  },
  facebookLogin: {
    path: '/login/facebook',
    exact: true,
    component: FacebookLogin,
  },
  githubLogin: {
    path: '/login/github',
    exact: true,
    component: GithubLogin,
  },
  register: {
    path: '/register',
    exact: true,
    component: Register,
  },
  flows: {
    path: '/flows',
    component: Flows,
  },
  contact: {
    path: '/contact',
    component: Contact,
  },
  doc: {
    path: '/docs/:slug?',
    component: Doc,
  },
  newsletter: {
    path: '/newsletters/:slug',
    component: Newsletter,
  },
  notificationUnsubscribe: {
    path: '/notifications/unsubscribe',
    component: Notifications,
  },
  notificationManage: {
    path: '/notifications/manage',
    component: Notifications,
  },
  changelog: {
    path: '/changelog',
    component: Changelog,
  },
  contributor: {
    path: '/blog/contributors/:slug',
    component: Contributor,
  },
  tag: {
    path: '/blog/tags/:tag',
    component: Tag,
  },
  tags: {
    path: '/blog/tags',
    component: Tags,
  },
  article: {
    path: '/blog/:slug',
    component: Article,
  },
  blog: {
    path: '/blog',
    component: Blog,
  },
  card: {
    path: '/library/:slug',
    component: Card,
  },
  library: {
    path: '/library',
    component: Library,
  },
  settings: {
    path: '/settings',
    component: requireAuthentication(Settings),
  },
  admin: {
    path: '/admin',
    component: requireAuthentication(Admin, 'ROLE_SUPER_ADMIN'),
  },
  feed: {
    path: '/me/feed/:slug1?/:slug2?/:slug3?/:slug4?/:slug5?',
    component: requireAuthentication(Feed),
  },
  userFeed: {
    path: '/:uid/feed/:slug1?/:slug2?/:slug3?/:slug4?/:slug5?',
    component: Feed,
  },
};

export const pathTo = (route: string, params = {}) => {
  if (!(route in routes)) {
    throw new Error(`There is no such view as ${route}`);
  }

  return compile(routes[route].path)(params);
};

export const matchRoute = (pathname: string) => {
  const keys = Object.keys(routes);

  let match = null;

  let route = null;

  for (let i = 0; i < keys.length; i++) {
    route = keys[i];
    match = path.matchPath(pathname, {
      path: routes[route].path,
      exact: routes[route].exact,
    });

    if (match) {
      return {
        route: route,
        match: match,
      };
    }
  }

  return null;
};

export default routes;
