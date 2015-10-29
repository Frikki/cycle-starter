var webpackConfig  = require('./webpack.config.js'),
    wallabyWebpack = require('wallaby-webpack');

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

webpackConfig.module.loaders = [
  CSSLoader
]

delete webpackConfig.devtool;

var wallabyPostprocessor = wallabyWebpack(webpackConfig);

module.exports = function (wallaby) {
  return {

    files: [
      { pattern: 'src/**/*.js', load: false },
      { pattern: 'src/**/*spec.js', ignore: true}
    ],

    tests: [
      { pattern: 'src/**/*spec.js', load: false }
    ],

    postprocessor: wallabyPostprocessor,

    testFramework: "mocha",

    compilers: {
      '**/*.js': wallaby.compilers.babel({
        babel: require('babel'),
        stage: 0,
      }),
    },

    bootstrap: function () {
      // required to trigger test loading
      window.__moduleBundler.loadTests();
    }
  };
};
