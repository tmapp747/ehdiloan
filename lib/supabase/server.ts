import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const FALLBACK_SUPABASE_URL = "https://your-project.supabase.co"
const FALLBACK_SUPABASE_ANON_KEY = "your-anon-key"

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    globalThis.process?.env?.NEXT_PUBLIC_SUPABASE_URL ||
    globalThis.process?.env?.SUPABASE_URL

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    globalThis.process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    globalThis.process?.env?.SUPABASE_ANON_KEY

  console.log("[v0] Server Supabase env check:", {
    hasClientUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasClientKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServerUrl: !!process.env.SUPABASE_URL,
    hasServerKey: !!process.env.SUPABASE_ANON_KEY,
    finalUrl: !!supabaseUrl,
    finalKey: !!supabaseAnonKey,
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Environment variables not accessible, creating mock client")

    // Return a mock client that provides the same interface but returns empty data
    return {
      from: (table: string) => ({
        select: () => ({
          eq: () => ({ data: [], error: null }),
          order: () => ({ data: [], error: null }),
          single: () => ({ data: null, error: null }),
        }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
      auth: {
        getUser: () => ({ data: { user: null }, error: null }),
        signOut: () => ({ error: null }),
      },
    } as any
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
