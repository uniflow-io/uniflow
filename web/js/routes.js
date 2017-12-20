import { FAQ, Home } from './views/index'

const routes = {
    home: {
        path: '/',
        exact: true,
        component: Home,
    },
    credits: {
        path: '/faq',
        component: FAQ,
    },
    homeDetail: {
        path: '/detail/:id',
        component: Home,
    },
}

export default routes
