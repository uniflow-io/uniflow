const webpack = require('webpack')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

module.exports = (env) => {
    let buildEnv = ['.env', '.env.local', `.env.${env.NODE_ENV}.local`].reduce((item, envPath) => {
        if(fs.existsSync(path.resolve(__dirname, envPath))) {
            return Object.assign(item, dotenv.parse(fs.readFileSync(path.resolve(__dirname, envPath))));
        }
        return item
    }, env)
    buildEnv = Object.keys(buildEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(buildEnv[next]);
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
            new webpack.DefinePlugin(buildEnv)
        ],
        devtool: 'source-map',
    }
}
