import Vue from 'vue'
import VueRouter from 'vue-router'

import './directives/select2.js'

import './components/sftp/index.js';
import './components/yaml/index.js';
import './components/search/index.js';


import LayoutSection from './sections/layout/index.js'
import HomeSection from './sections/home/index.js'
import FAQSection from './sections/faq/index.js'

Vue.use(VueRouter);

var router = new VueRouter();
router.map({
    '/': { component: HomeSection },
    '/faq': { component: FAQSection }
});

router.start(LayoutSection, '#content');