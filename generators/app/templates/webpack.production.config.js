const webpack = require('webpack')
const autoprefixer = require('autoprefixer')<% if (cssChoice === 'Sass' || cssChoice === 'Sass (SCSS)') { %>
const sassImporter = require('sass-module-importer')<% } %>

module.exports = {
  context: __dirname,
  entry: './app/src/js/main.js',
  output: {
    path: __dirname + '/app/assets/dist',
    publicPath: '/assets/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  module: {
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
          'css',
          'csso',
          'postcss',
          '<%= cssLoader %>'
        ]
      }
    ]
  },
  postcss: () => [autoprefixer],<% if (cssChoice === 'Sass' || cssChoice === 'Sass (SCSS)') { %>
  sassLoader: {
    importer: sassImporter()
  }<% } %>
}
