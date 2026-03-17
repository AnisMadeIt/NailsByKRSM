import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const auth = req.cookies.get('admin_auth')?.value
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date, time, reason } = await req.json()
  if (!date || !time) return NextResponse.json({ error: 'date and time required' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('blocked_slots')
    .upsert({ date, time, reason }, { onConflict: 'date,time' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const auth = req.cookies.get('admin_auth')?.value
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { date, time } = await req.json()
  const { error } = await supabaseAdmin
    .from('blocked_slots')
    .delete()
    .eq('date', date)
    .eq('time', time)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
