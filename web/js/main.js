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
        'systemjs-babel-build': 'libs/systemjs-plugin-babel/systemjs-babel-browser.js'
    },
    transpiler: 'plugin-babel',
    meta: {
        '*.js': {
            babelOptions: {
                stage0: true,
                es2015: true
            }
        }
    }
});
SystemJS.import('app.js').then(function() {
    console.log('dede');
});