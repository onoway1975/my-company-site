import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// サーバー用のサービスキー。クライアントバンドルには含まれないため、
// ブラウザでの評価時は anon key にフォールバックして createClient が throw しないようにする。
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

// フロントエンド用（RLS適用）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// サーバー用（RLSをバイパス、Route Handlerのみで使用）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
