import { FAQ, Home, Flow, Logs, Login, Register, Settings } from './views/index'
import pathToRegexp from 'path-to-regexp'
import { requireAuthentication } from './components/index'

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
    register: {
        path: '/register',
        exact: true,
        component: Register,
    },
    faq: {
        path: '/faq',
        component: FAQ,
    },
    logs: {
        path: '/logs',
        component: Logs,
    },
    settings: {
        path: '/settings',
        component: requireAuthentication(Settings),
    },
    dashboard: {
        path: '/me',
        component: requireAuthentication(Flow),
    },
    flow: {
        path: '/me/flow/:slug',
        component: requireAuthentication(Flow),
    },
    userDashboard: {
        path: '/:username',
        component: requireAuthentication(Flow),
    },
    userFlow: {
        path: '/:username/flow/:slug',
        component: requireAuthentication(Flow),
    },
}

export const pathTo = (view, params = {}) => {
    if (!(view in routes)) {
        throw new Error(`There is no such view as ${view}`)
    }

    return pathToRegexp.compile(routes[view].path)(params)
}

export default routes
