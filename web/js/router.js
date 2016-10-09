import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import HomeSection from './sections/home/index.js'
import FAQSection from './sections/faq/index.js'

const router = new VueRouter({
    routes: [
        { path: '/', component: HomeSection },
        { path: '/faq', component: FAQSection }
    ]
});

export default router;
