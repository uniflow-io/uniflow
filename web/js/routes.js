import { FAQ, Home, Logs } from './views/index'
import pathToRegexp from 'path-to-regexp'

const routes = {
    home: {
        path: '/',
        exact: true,
        component: Home,
    },
    logged: {
        path: '/_=_',
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
    homeDetail: {
        path: '/detail/:id',
        component: Home,
    },
}

export const pathTo = (view, params = {}) => {
    if (!(view in routes)) {
        throw new Error(`There is no such view as ${view}`)
    }

    return pathToRegexp.compile(routes[view].path)(params)
}

export default routes
