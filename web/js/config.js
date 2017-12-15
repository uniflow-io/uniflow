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
                stage1: true,
                es2015: true
            }
        },
        'babel': {
            exports: ['Babel']
        },
    }
});
SystemJS.import('index.js');