import { createRouter, createWebHistory } from 'vue-router'
import {
  EditorLayout,
  EditorStage,
  PreviewScenario,
  DevScenario,
} from '@visual/editor'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/preview',
      name: 'preview',
      component: PreviewScenario,
    },
    {
      path: '/',
      component: EditorLayout,
      children: [
        {
          path: '',
          name: 'editor',
          component: EditorStage,
        },
        {
          path: 'dev',
          name: 'dev',
          component: DevScenario,
        },
      ],
    },
  ],
})

export default router