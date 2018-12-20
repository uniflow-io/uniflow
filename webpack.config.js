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
            filename: 'uniflow.js',
            publicPath: "/",
            path: path.resolve(__dirname, './dist'),
            library: 'default',
            libraryTarget: 'umd'
        },
        module: {
            rules: [{
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: loaders
            }]
        },
        devtool: 'source-map',
    }
}
