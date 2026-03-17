import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendBookingConfirmation } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, service, price, duration_mins, date, time, notes } = body

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Double-check slot is still available
    const { data: conflict } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .maybeSingle()

    if (conflict) {
      return NextResponse.json({ error: 'That slot was just taken. Please pick another time.' }, { status: 409 })
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({ name, email, phone, service, price, duration_mins, date, time, notes, status: 'pending' })
      .select()
      .single()

    if (error) throw error

    // Send emails (don't block response on failure)
    sendBookingConfirmation({ name, email, service, price, date, time }).catch(console.error)

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}
