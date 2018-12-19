const webpack = require('webpack')
const path    = require('path')
const fs      = require('fs')

module.exports = () => {
    let loaders = [{
        loader: 'babel-loader',
        options: {
            presets: ['env', 'react', 'es2015', 'flow', 'stage-0']
        }
    }]

    return {
        entry: './src/index.js',
        output: {
            filename: 'uniflow.js',
            publicPath: "/",
            path: path.resolve(__dirname, './dist')
        },
        devServer: {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            contentBase: "../back/public",
            publicPath: "/",
            filename: "bundle.js",
            historyApiFallback: true
        },
        module: {
            rules: [{
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: loaders
            }]
        },
        plugins: [
            new webpack.DefinePlugin(buildEnv)
        ],
        devtool: envMode === 'development' ? 'source-map' : 'none',
    }
}
