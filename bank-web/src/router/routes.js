import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: 'auth'
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: () => import('../views/Transfer.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/Auth.vue')
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import('../views/Reset.vue')
    },
    {
      path: '/update/password/token/:token',
      name: 'updatePassword',
      component: () => import('../views/UpdatePassword.vue')
    }
  ]
})

export default router
