const webpack = require('webpack')
const dotenv  = require('dotenv')
const path    = require('path')
const fs      = require('fs')

module.exports = (env) => {
    let envMode  = env && env.NODE_ENV ? env.NODE_ENV : 'development'
    let buildEnv = ['.env', '.env.local', `.env.${envMode}.local`].reduce((item, envPath) => {
        if (fs.existsSync(path.resolve(__dirname, envPath))) {
            return Object.assign(item, dotenv.parse(fs.readFileSync(path.resolve(__dirname, envPath))));
        }
        return item
    }, env || {})
    buildEnv     = Object.keys(buildEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(buildEnv[next]);
        return prev;
    }, {});

    let loaders = [{
        loader: 'babel-loader',
        options: {
            presets: ['env', 'react', 'es2015', 'flow', 'stage-0']
        }
    }]
    if (envMode !== 'development') {
        loaders.push({
            loader: 'cache-loader'
        })
    }

    return {
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
            filename: "bash.js",
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
        target: 'node'
    }
};
