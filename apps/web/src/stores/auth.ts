import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'
import type { ProfileRow } from '../types/api'
import type { RoleCode } from '../lib/rbac'

// 模块级 in-flight promise:路由守卫与 main.ts 并发 init 时复用同一过程,避免竞态
let initPromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    session: null as Session | null,
    isInitialized: false,
    profileLoading: false,
    profile: null as ProfileRow | null,
  }),

  getters: {
    role: (state): RoleCode | null => state.profile?.role ?? null,
    displayName: (state): string => state.profile?.full_name || state.user?.email?.split('@')[0] || '',
    avatarUrl: (state): string | null => state.profile?.avatar_url ?? null,
  },

  actions: {
    init(): Promise<void> {
      if (this.isInitialized) return Promise.resolve()
      if (!initPromise) {
        initPromise = (async () => {
          const { data } = await supabase.auth.getSession()
          this.session = data.session
          this.user = data.session?.user ?? null
          if (this.user) await this.refreshProfile()
          this.isInitialized = true
          supabase.auth.onAuthStateChange(async (_event, session) => {
            const previousUserId = this.user?.id
            const nextUserId = session?.user?.id
            this.session = session
            this.user = session?.user ?? null
            if (!session?.user) {
              this.profile = null
              return
            }
            // token 刷新时用户 ID 不变，保留旧 profile，避免权限菜单先消失再出现。
            // 只有实际切换账号时才清空旧角色，防止短暂沿用上一账号权限。
            if (previousUserId !== nextUserId) this.profile = null
            await this.refreshProfile()
          })
        })()
      }
      return initPromise
    },

    async refreshProfile(): Promise<void> {
      const userId = this.user?.id
      if (!userId) {
        this.profile = null
        return
      }
      this.profileLoading = true
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, role, created_at, updated_at')
          .eq('id', userId)
          .maybeSingle()
        // 注册瞬间触发器行可能尚未可见:按未分配角色(null)处理,守卫据此重定向
        if (!error && data) this.profile = data
      } finally {
        this.profileLoading = false
      }
    },

    async login(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      this.user = data.user
      this.session = data.session
      await this.refreshProfile()
      return data
    },

    async register(email: string, password: string, full_name?: string) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: full_name || '' } },
      })
      if (error) throw error
      if (data.session) {
        this.user = data.user
        this.session = data.session
        await this.refreshProfile()
      }
      return data
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      this.session = null
      this.profile = null
    },
  },
})
