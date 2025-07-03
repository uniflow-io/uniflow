// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';


const config = {
    entry: './src/index.ts',
    output: {
        filename: 'node.js',
        publicPath: "/",
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        contentBase: "./dist/js",
        publicPath: "/",
        filename: "node.js",
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.ts'],
    },
    target: 'node'
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
