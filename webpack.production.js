var Extract = require('extract-text-webpack-plugin');
var Webpack = require('webpack');
var path = require('path');

var webpackConfig = {

  entry: './src/clientBundle.js',

  output: {
    filename: 'app.js',
    path: path.resolve('./dist/')
  },

  module: {
    loaders: [
      { test: /\.styl$/, loader: Extract.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!cssnext-loader!stylus-loader') },
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/},
    ]
  },

  resolveLoader: {
    modulesDirectories: [
      path.resolve('./node_modules')
    ]
  },

  plugins: [
    new Extract('styles.css', {allChunks: true})
  ],

};

module.exports = webpackConfig;
