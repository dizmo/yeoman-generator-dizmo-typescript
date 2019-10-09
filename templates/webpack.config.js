const { resolve } = require('path');

module.exports = {
    entry: {
        main: ['@babel/polyfill', './src/index.ts']
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader'
        }, {
            test: /\.js$/,
            exclude: [/\.(min|umd)\.js$/],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    cacheDirectory: true
                }
            }
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: resolve(__dirname, 'build', '<%= dizmoName %>'),
        filename: 'index.js'
    },
    mode: 'none'
};
