import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layout/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/preview/index.vue'),
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'editor',
          component: () => import('@/views/index/index.vue'),
        },
        {
          path: 'dev',
          name: 'dev',
          component: () => import('@/views/dev/index.vue'),
        },
      ],
    },
  ],
})

export default router
