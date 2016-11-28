// These routes are lazy loaded by Webpack, hence System.import() syntax

export default [
  {
    path: '/',
    name: 'home',
    component: () => System.import('./components/pages/Home')
  },
  // Backup catch-all route 404
  {
    path: '*',
    name: '404',
    component: () => System.import('./components/pages/404')
  }
]

