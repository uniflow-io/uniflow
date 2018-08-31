const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bash.js',
        publicPath: "/",
        path: path.resolve(__dirname, '../back/public/dist/js')
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