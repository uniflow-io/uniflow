import Vue from 'vue'
import VueRouter from 'vue-router'
import LayoutSection from './sections/layout/index.js'

Vue.use(VueRouter);

var router = new VueRouter();

router.start(LayoutSection, '#content');