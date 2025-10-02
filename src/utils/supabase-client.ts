import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './supabase/info'

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    )
  }
  return supabaseClient
}

export async function getAccessToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || publicAnonKey
}