import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import HomeSection from './sections/home/index.js'
import FAQSection from './sections/faq/index.js'

const router = new VueRouter({
    routes: [
        { name: 'home', path: '/', component: HomeSection },
        { name: 'faq', path: '/faq', component: FAQSection },
        { name: 'homeDetail', path: '/detail/:id', component: HomeSection }
    ]
});

export default router;
