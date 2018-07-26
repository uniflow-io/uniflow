const path = require('path');

module.exports = {
    entry: './js/index.js',
    output: {
        filename: 'bundle.js',
        publicPath: "/",
        path: path.resolve(__dirname, './dist/js')
    },
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        contentBase: "./dist/js",
        publicPath: "/",
        filename: "bundle.js",
        historyApiFallback: true
    },
    optimization: {
        minimize: false
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
    },
    devtool: 'source-map',
    target: 'node'
};