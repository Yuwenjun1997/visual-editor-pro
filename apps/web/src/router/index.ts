import { createRouter, createWebHashHistory } from 'vue-router'
import {
  EditorLayout,
  EditorStage,
  PreviewScenario,
  DevScenario,
} from '@visual/editor'

const router = createRouter({
  history: createWebHashHistory(),
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