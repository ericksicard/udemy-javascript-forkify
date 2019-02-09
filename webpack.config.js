/*
* Four Core Concepts:
* 1. Entry point: it's where webpack will start the bundling, the file where it will start looking
*                 for all the dependencies which it should then bundle together.   
* 2. Output: it tells webpack where to save our bundle file(path to the folder and file name)
* 3. Loaders: allow us to import or to load all king of different files. And more importantly,
*             to also process them. Like converting SASS to CSS Code or convert ES6 code to ES5 JavaScript. 
* 4. Plugins: allow us to do complex processing of our input files.
*/

const path = require('path');  // Including the "path" package
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill','./src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),  // "resolve" is a method of the "path" package included before.
        filename: 'js/bundle.js'
    },
    // Installing a development server(npm install webpack-dev-server)
    devServer: {
        contentBase: './dist'
    },
    // Plugins
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    // Loaders
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'  // Package already installed
                }
            }
        ]
    }
};

