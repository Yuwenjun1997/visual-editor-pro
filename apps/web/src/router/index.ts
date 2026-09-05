import { createRouter, createWebHistory } from 'vue-router'
import { EditorLayout, EditorStage } from '@visual/editor'
import AdminLayout from '@/layout/AdminLayout.vue'
import LoginView from '@/views/LoginView.vue'
import EditorShell from '@/views/editor/EditorShell.vue'
import PagesView from '@/views/admin/pages/PagesView.vue'
import ProductsView from '@/views/admin/products/ProductsView.vue'
import ArticlesView from '@/views/admin/articles/ArticlesView.vue'
import CategoriesView from '@/views/admin/categories/CategoriesView.vue'
import ProfileView from '@/views/admin/profile/ProfileView.vue'
import UsersView from '@/views/admin/users/UsersView.vue'
import DashboardView from '@/views/admin/dashboard/DashboardView.vue'
import DataSourcesView from '@/views/admin/data-sources/DataSourcesView.vue'
import AppsView from '@/views/admin/apps/AppsView.vue'
import AppDetailView from '@/views/admin/apps/AppDetailView.vue'
import AppSettingsView from '@/views/admin/apps/AppSettingsView.vue'
import { useAuthStore } from '@/stores/auth'
import { hasPermission } from '@/lib/rbac'
import type { PermissionCode } from '@/lib/rbac'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/admin',
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
      // 应用页面归属仅从路由参数取得，不依赖 schema 内的历史 appId。
      path: '/editor/:appId/:pageId',
      component: EditorShell,
      meta: { requiresAuth: true, permission: 'editor:access' },
      children: [
        {
          path: '',
          component: EditorLayout,
          children: [{ path: '', name: 'editor-app-review', component: EditorStage }],
        },
      ],
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'products/new',
          name: 'product-create',
          component: () => import('../views/admin/products/ProductEditView.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'product-edit',
          component: () => import('../views/admin/products/ProductEditView.vue'),
        },
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: DashboardView,
        },
        { path: 'apps', name: 'apps', component: AppsView, meta: { permission: 'app:view' } },
        {
          path: 'apps/:appId/settings',
          name: 'app-settings',
          component: AppSettingsView,
          meta: { permission: 'app:view' },
        },
        { path: 'apps/:appId', name: 'app-detail', component: AppDetailView, meta: { permission: 'app:view' } },
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
          path: 'data-sources',
          name: 'data-sources',
          component: DataSourcesView,
          meta: { permission: 'editor:access' },
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
  ],
})

router.beforeEach(async (to) => {
  NProgress.start()
  const auth = useAuthStore()
  if (!auth.isInitialized) await auth.init()

  if (to.path === '/') {
    return auth.user ? { name: 'admin-dashboard' } : { name: 'login', query: { redirect: '/admin' } }
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

router.afterEach(() => {
  NProgress.done()
})

router.onError(() => {
  NProgress.done()
})

export default router
