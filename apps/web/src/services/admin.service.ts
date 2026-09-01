import { supabase } from '../lib/supabase'
import type { RoleCode } from '../lib/rbac'
import type { UserListItem } from '../types/api'

export const adminService = {
  async listUsers(): Promise<UserListItem[]> {
    const { data, error } = await supabase.rpc('list_users')
    if (error) throw error
    return (data ?? []) as UserListItem[]
  },

  async setUserRole(targetUserId: string, newRole: RoleCode): Promise<void> {
    const { error } = await supabase.rpc('set_user_role', {
      target_user_id: targetUserId,
      new_role: newRole,
    })
    if (error) throw error
  },
}
