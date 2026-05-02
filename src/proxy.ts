import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match only the routes that require auth or session management:
     * - dashboard
     * - messages
     * - workspace
     * - checkout
     * - ai-matchmaker
     * - profile (if editing)
     * - api routes
     */
    '/(dashboard|messages|workspace|checkout|ai-matchmaker|api|profile)(.*)',
  ],
}
