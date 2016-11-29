'use strict'

module.exports = app => {
  <% if (jsLang === 'vue') { %>app.post('/api', (req, res) => {
    // Do something here
  })<% } else { %>// Pass all GET requests onto the client router
  app.get('/', (req, res) => {
    res.render('pages/home', {
      title: 'Home'
    })
  })<% } %>
}
