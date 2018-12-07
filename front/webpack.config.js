const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

module.exports = () => {
    const env = dotenv.config().parsed;

    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            publicPath: "/",
            path: path.resolve(__dirname, '../back/public/dist/js')
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
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react', 'es2015', 'flow', 'stage-0']
                    }
                }
            }]
        },
        plugins: [
            new webpack.DefinePlugin(envKeys)
        ],
        devtool: 'source-map',
    }
}
