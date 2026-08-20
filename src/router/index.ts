import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
