SystemJS.config({
    baseURL: '/js',
    map: {
        'plugin-babel': 'libs/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': 'libs/systemjs-plugin-babel/systemjs-babel-browser.js',
        'text': 'libs/systemjs-plugin-text/text.js',
        'vue': 'libs/vue.min.js',
        'vuex': 'libs/vuex.min.js',
        'vue-router': 'libs/vue-router.min.js',
        'superagent': 'libs/superagent.min.js',
        'axios': 'libs/axios.min.js',
        'jquery': 'libs/jquery.min.js',
        'jquery-ui': 'libs/plugins/jQueryUI/jquery-ui.min.js',
        'select2': 'libs/plugins/select2/select2.full.min.js',
        'icheck': 'libs/plugins/iCheck/icheck.min.js',
        'tagit': 'libs/plugins/tagit/js/tag-it.min.js',
        'lodash': 'libs/lodash.min.js',
        'acorn-interpreter': 'libs/acorn/acorn_interpreter.min.js',
        'babel': 'libs/babel.min.js',
        'ace': 'libs/ace/ace.js',
        'moment': 'libs/momentjs/moment.min.js',
        'lz-string': 'libs/lz-string.js'
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
        },
        'acorn-interpreter': {
            exports: 'Interpreter'
        },
        'babel': {
            exports: ['Babel']
        },
    }
});
SystemJS.import('app.js');