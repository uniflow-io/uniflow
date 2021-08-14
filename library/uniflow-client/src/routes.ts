import {
  Admin,
  Article,
  Blog,
  Contact,
  Contributor,
  Card,
  Library,
  Doc,
  Feed,
  Home,
  Flows,
  Login,
  FacebookLogin,
  GithubLogin,
  Register,
  Settings,
  Tag,
  Tags,
  Changelog,
  Newsletter,
  Notifications,
} from './views';

import { compile } from 'path-to-regexp';
import { requireAuthentication } from './helpers';
import { matchPath } from './utils';

const routes = {
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

export const pathTo = (route, params = {}) => {
  if (!(route in routes)) {
    throw new Error(`There is no such view as ${route}`);
  }

  return compile(routes[route].path)(params);
};

export const matchRoute = (pathname) => {
  const keys = Object.keys(routes);

  let match = null;

  let route = null;

  for (let i = 0; i < keys.length; i++) {
    route = keys[i];
    match = matchPath(pathname, {
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
