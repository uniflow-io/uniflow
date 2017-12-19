import {Home, FAQ} from './views/index'

const routes = {
    home: {
        path: '/',
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
