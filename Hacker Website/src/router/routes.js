const routes = [
  {
    path: '/home',
    component: () => import('layouts/HomeLayout.vue'), // Root Layout
    children: [
      { path: 'terminalBrowser', component: () => import('pages/Terminal.vue'), name: 'terminalBrowser' },
      { path: 'blogBrowser', component: () => import('pages/Blog.vue'), name: 'blogBrowser' },
      { path: 'aboutBrowser', component: () => import('pages/About.vue'), name: 'aboutBrowser' },
      // You can add more routes that directly use HomeLayout here
    ],
    meta: { isHome: true }
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
