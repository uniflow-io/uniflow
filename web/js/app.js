import Vue from 'vue'

import store from './store.js'
import router from './router.js'

import './components/select2.js'
import './components/tagit.js'

import LayoutSection from './sections/layout/index.js'

const app = new Vue(Vue.util.extend({
    store: store,
    router: router
}, LayoutSection));
app.$mount('#app');