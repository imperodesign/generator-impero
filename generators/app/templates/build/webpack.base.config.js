module.exports = {
  context: `${__dirname}/../`,
  target: 'web',
  resolve: {
    extensions: ['.<%= jsExt %>', <% if (jsLang === 'vue') { %>'.vue', '.pug', <% } %>'.json', '.<%= cssExt %>']
  },
  output: {
    filename: 'bundle.js'
  }
}
