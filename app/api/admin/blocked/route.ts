import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const auth = req.cookies.get('admin_auth')?.value
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data, error } = await supabaseAdmin
    .from('blocked_slots')
    .select('date,time')
    .order('date').order('time')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slots: data })
}
