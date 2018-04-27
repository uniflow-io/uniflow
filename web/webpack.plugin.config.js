const path = require('path');

module.exports = {
    entry: './js/plugin.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../idea-plugin/src/main/resources/js')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react', 'es2015', 'flow', 'stage-0']
                }
            }
        }]
    }
};