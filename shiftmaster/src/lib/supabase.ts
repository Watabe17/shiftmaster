import { createClient } from '@supabase/supabase-js'

// 環境変数から設定を読み込み（フォールバック値付き）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wxiuskoajuqhfociuaou.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aXVza29hanVxaGZvY2l1YW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

// 環境変数の詳細ログ
console.log('Environment variables check:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'using fallback')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 'using fallback')
console.log('Final URL:', supabaseUrl)
console.log('Final Key length:', supabaseAnonKey.length)

// デバッグ情報
if (typeof window !== 'undefined') {
  console.log('=== Client Side Supabase Debug ===')
  console.log('Final Supabase URL:', supabaseUrl)
  console.log('Final Supabase Anon Key length:', supabaseAnonKey.length)
  console.log('==================================')
}

if (typeof window === 'undefined') {
  console.log('=== Server Side Supabase Debug ===')
  console.log('Final Supabase URL:', supabaseUrl)
  console.log('Final Supabase Anon Key length:', supabaseAnonKey.length)
  console.log('==================================')
}

// モッククライアントの作成
const createMockClient = () => ({
  auth: {
    signIn: async () => ({ error: null, data: { user: null } }),
    signUp: async () => ({ error: null, data: { user: null } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getUser: async () => ({ error: null, data: { user: null } }),
    getSession: async () => ({ error: null, data: { session: null } }),
    signInWithPassword: async () => ({ error: null, data: { user: null, session: null } }),
    resetPasswordForEmail: async () => ({ error: null, data: {} })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ error: null, data: null }) }) }),
    insert: async () => ({ error: null, data: null }),
    update: async () => ({ error: null, data: null }),
    delete: async () => ({ error: null, data: null })
  })
})

// Supabaseクライアントを作成する関数
const createSupabaseClients = () => {
  try {
    console.log('Creating Supabase clients...')
    console.log('URL:', supabaseUrl)
    console.log('Key length:', supabaseAnonKey.length)
    
    if (supabaseUrl && supabaseAnonKey) {
      console.log('Creating Supabase client with credentials')
      console.log('URL type:', typeof supabaseUrl, 'Value:', supabaseUrl)
      console.log('Key type:', typeof supabaseAnonKey, 'Value length:', supabaseAnonKey.length)
      console.log('Key first 50 chars:', supabaseAnonKey.substring(0, 50))
      
      const client = createClient(supabaseUrl, supabaseAnonKey)
      
      const adminClient = createClient(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )
      
      console.log('Supabase clients created successfully')
      return { client, adminClient }
    } else {
      console.warn('Missing Supabase credentials - using mock client')
      return { 
        client: createMockClient(), 
        adminClient: createMockClient() 
      }
    }
  } catch (error) {
    console.warn('Error creating Supabase clients - using mock client:', error)
    return { 
      client: createMockClient(), 
      adminClient: createMockClient() 
    }
  }
}

const { client: supabaseClient, adminClient: supabaseAdminClient } = createSupabaseClients()

export const supabase = supabaseClient
export const supabaseAdmin = supabaseAdminClient
