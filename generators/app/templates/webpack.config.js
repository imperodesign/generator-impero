const fs = require('fs')
const webpack = require('webpack')
const browsersync = require('browser-sync-webpack-plugin')
const autoprefixer = require('autoprefixer')<% if (cssChoice === 'Sass' || cssChoice === 'Sass (SCSS)') { %>
const sassImporter = require('sass-module-importer')<% } %>

if (fs.existsSync(`${__dirname}/.env`)) require('dotenv').load()
else process.env.NODE_PORT = 5000

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './app/src/scripts/main.js'
  ],
  output: {
    path: __dirname + '/app/assets/dist',
    publicPath: '/assets/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new browsersync(
      // BrowserSync options
      {
        host: 'localhost',
        port: parseInt(process.env.NODE_PORT) + 1,
        proxy: `localhost:${process.env.NODE_PORT}`,
        ui: false,
        files: 'app/views/**/*.pug',
        open: false,
        notify: false,
        injectChanges: false
      },
      // Plugin options
      {
        reload: false
      }
    )
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'stage-1'
          ]
        },
        exclude: /node_modules/
      },
      {
        test: /\.<%= cssExt %>$/,
        loaders: [
          'style',
          'css?sourceMap',
          'postcss',
          '<%= cssLoader %>?sourceMap'
        ]
      }
    ]
  },
  eslint: {
    configFile: './.eslintrc',
    emitError: true,
    emitWarning: true
  },
  postcss: () => [autoprefixer],<% if (cssChoice === 'Sass' || cssChoice === 'Sass (SCSS)') { %>
  sassLoader: {
    importer: sassImporter()
  }<% } %>
}
