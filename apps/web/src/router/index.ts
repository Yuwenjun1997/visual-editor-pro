import { createRouter, createWebHashHistory } from 'vue-router'
import { EditorLayout, EditorStage, PreviewScenario, DevScenario } from '@visual/editor'
import AdminLayout from '@/AdminLayoutV2.vue'
import LoginView from '@/views/LoginView.vue'
import EditorShell from '@/views/editor/EditorShell.vue'
import PagesView from '@/views/admin/PagesView.vue'
import ProductsView from '@/views/admin/ProductsView.vue'
import ArticlesView from '@/views/admin/ArticlesView.vue'
import CategoriesView from '@/views/admin/CategoriesView.vue'
import ProfileView from '@/views/admin/ProfileView.vue'
import UsersView from '@/views/admin/UsersView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import PreviewBridgePage from '@/views/PreviewBridgePage.vue'
import { useAuthStore } from '@/stores/auth'
import { hasPermission } from '@/lib/rbac'
import type { PermissionCode } from '@/lib/rbac'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/preview',
      name: 'preview',
      component: PreviewScenario,
      meta: { requiresAuth: true, permission: 'page:view' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      // 新建页面入口:需登录与 editor 权限(未登录/无权限由守卫拦截)
      path: '/editor',
      component: EditorShell,
      meta: { requiresAuth: true, permission: 'editor:access' },
      children: [
        {
          path: '',
          component: EditorLayout,
          children: [
            {
              path: '',
              name: 'editor-create',
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
    },
    {
      // 重新打开已保存页面,EditorStage 按 :pageId 装载
      path: '/editor/:pageId',
      component: EditorShell,
      meta: { requiresAuth: true, permission: 'editor:access' },
      children: [
        {
          path: '',
          component: EditorLayout,
          children: [
            {
              path: '',
              name: 'editor-review',
              component: EditorStage,
            },
          ],
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: DashboardView,
        },
        {
          path: 'pages',
          name: 'pages',
          component: PagesView,
        },
        {
          path: 'products',
          name: 'products',
          component: ProductsView,
        },
        {
          path: 'articles',
          name: 'articles',
          component: ArticlesView,
        },
        {
          path: 'categories',
          name: 'categories',
          component: CategoriesView,
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { permission: 'profile:manage' },
        },
        {
          path: 'users',
          name: 'users',
          component: UsersView,
          meta: { permission: 'user:manage' },
        },
      ],
    },
    {
      path: '/page/:pageId',
      name: 'page-preview',
      component: PreviewBridgePage,
      meta: { requiresAuth: true, permission: 'page:view' },
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.isInitialized) await auth.init()

  if (to.path === '/') {
    return auth.user
      ? { name: 'admin-dashboard' }
      : { name: 'login', query: { redirect: '/admin' } }
  }

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  const required = to.meta.permission as PermissionCode | undefined
  if (required && !hasPermission(auth.role, required)) {
    ElMessage.warning('无权访问该页面')
    // 已登录但缺权限 → 落到人人可进的个人中心,避免回跳死循环
    return auth.user ? { name: 'profile' } : { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
