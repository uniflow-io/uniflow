import Vue from 'vue'
import VueRouter from 'vue-router'

import './directives/select2.js'
import './directives/tagit.js'

import LayoutSection from './sections/layout/index.js'
import HomeSection from './sections/home/index.js'
import FAQSection from './sections/faq/index.js'

Vue.use(VueRouter);

var router = new VueRouter({
    routes: [
        { path: '/', component: HomeSection },
        { path: '/faq', component: FAQSection }
    ]
});

const app = new Vue(Vue.util.extend({ router: router }, LayoutSection));
app.$mount('#app');