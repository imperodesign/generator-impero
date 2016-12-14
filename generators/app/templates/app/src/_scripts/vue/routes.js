// These routes are lazy loaded by Webpack, hence import() syntax

export default [
  {
    path: '/',
    name: 'home',
    component: () => import('./components/pages/Home')
  },
  // Backup catch-all route 404
  {
    path: '*',
    name: '404',
    component: () => import('./components/pages/404')
  }
]
