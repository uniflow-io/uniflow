import { FAQ, Home, Flow, Logs, Settings } from './views/index'
import pathToRegexp from 'path-to-regexp'

const routes = {
    home: {
        path: '/',
        exact: true,
        component: Home,
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
        path: '/profile',
        component: Settings,
    },
    dashboard: {
        path: '/me',
        component: Flow,
    },
    flow: {
        path: '/me/flow/:id',
        component: Flow,
    },
}

export const pathTo = (view, params = {}) => {
    if (!(view in routes)) {
        throw new Error(`There is no such view as ${view}`)
    }

    return pathToRegexp.compile(routes[view].path)(params)
}

export default routes
