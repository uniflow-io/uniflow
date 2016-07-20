/*requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        polyfill: 'libs/polyfill.min',
        vuejs: 'libs/vue.min',
        vuerouter: 'libs/vue-router.min',
        superagent: 'libs/superagent.min',
        jquery: 'libs/jquery.min'
    }
});

requirejs([
    'vuejs',
    'vuerouter',
    'sections/layout/index'
], function(Vue, VueRouter, LayoutSection) {
    Vue.use(VueRouter);

    var router = new VueRouter();

    router.start(LayoutSection, '#content');
});
*/

SystemJS.config({
    baseURL: '/js',
    map: {
        'plugin-babel': 'libs/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'libs/systemjs-plugin-babel/systemjs-babel-browser.js',
        'text': 'libs/systemjs-plugin-text/text.js',
        'vue': 'libs/vue.min.js',
        'vue-router': 'libs/vue-router.min.js',
        'superagent': 'libs/superagent.min.js',
        'jquery': 'libs/jquery.min.js',
        'jquery-ui': 'libs/plugins/jQueryUI/jquery-ui.min.js',
        'select2': 'libs/plugins/select2/select2.full.min.js',
        'tagit': 'libs/plugins/tagit/js/tag-it.min.js'
    },
    transpiler: 'plugin-babel',
    meta: {
        '*.js': {
            babelOptions: {
                stage0: true,
                stage1: true,
                es2015: true
            }
        },
        'tagit': {
            deps: ['jquery', 'jquery-ui']
        }
    }
});
SystemJS.import('app.js');