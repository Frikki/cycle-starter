var webpack      = require('webpack'),
    path         = require('path'),
    autoprefixer = require('autoprefixer'),
    easings      = require('postcss-easings'),
    variables    = require('postcss-simple-vars'),
    Import       = require('postcss-import'),
    stylelint    = require('stylelint');

var JSLoader = {
  test: /\.js$/,
  loaders: [
    'babel-loader'
  ],
  exclude: /node_modules/
}

var CSSLoader = {
  test: /\.css$/,
  loaders: [
    'style-loader',
    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
    'cssnext-loader',
    'postcss-loader'
  ],
  exclude: /node_modules/
}

module.exports = {
  watch: false,

  devtool: 'sourcemap',

  entry: './src/app.js',

  output : {
    filename: 'app.js',
    path: path.resolve('./build/')
  },

  module: {
    loaders: [
      JSLoader,
      CSSLoader
    ]
  },

  resolveLoader: {
    modulesDirectories: [
      path.resolve('./node_modules')
    ]
  },

  resolve: {
    alias: {
      "utils": path.resolve('./src/utils'),
      "dialogue": path.resolve('./src/dialogue'),
      "driver": path.resolve('./src/driver')
    }
  },

  postcss: function(webpack) {
    return [
      autoprefixer,
      Import({
        addDependencyTo: webpack
      }),
      easings,
      variables,
      stylelint()
    ]
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true
  }
}
