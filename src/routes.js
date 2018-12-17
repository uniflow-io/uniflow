import {FAQ, Home, Flow, Versions, Login, Register, Settings, LoginFacebook, LoginGithub} from './views/index'
import pathToRegexp from 'path-to-regexp'
import { requireAuthentication } from './components/index'
import { matchPath } from 'react-router'

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
    loginFacebook: {
        path: '/login/facebook',
        exact: true,
        component: LoginFacebook,
    },
    loginGithub: {
        path: '/login/github',
        exact: true,
        component: LoginGithub,
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
    versions: {
        path: '/versions',
        component: Versions,
    },
    settings: {
        path: '/settings',
        component: requireAuthentication(Settings),
    },
    flow: {
        path: '/me/flow/:slug',
        component: requireAuthentication(Flow),
    },
    dashboard: {
        path: '/me',
        component: requireAuthentication(Flow),
    },
    userFlow: {
        path: '/:username/flow/:slug',
        component: Flow,
    },
    userDashboard: {
        path: '/:username',
        component: Flow,
    },
}

export const pathTo = (view, params = {}) => {
    if (!(view in routes)) {
        throw new Error(`There is no such view as ${view}`)
    }

    return pathToRegexp.compile(routes[view].path)(params)
}

export const matchRoute = (pathname) => {
    let keys = Object.keys(routes),
        match = null,
        route = null

    for (let i = 0; i < keys.length; i++ ) {
        route = keys[i]
        match = matchPath(pathname, {
            path: routes[route].path,
            exact: routes[route].exact
        })

        if(match) {
            return {
                route: route,
                match: match
            }
        }
    }

    return null
}

export default routes
