const path    = require('path')

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
            filename: 'node.js',
            publicPath: "/",
            path: path.resolve(__dirname, 'dist/js')
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
            rules: [{
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: loaders
            }]
        },
        devtool: 'source-map',
        target: 'node'
    }
};
