import { supabase } from '../lib/supabase'
import type { ProfileRow } from '../types/api'

export const profileService = {
  async updateProfile(
    userId: string,
    fields: { full_name?: string | null; avatar_url?: string | null },
  ): Promise<ProfileRow> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('id, full_name, avatar_url, role, created_at, updated_at')
      .single()
    if (error) throw error
    return data as ProfileRow
  },
}
