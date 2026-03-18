import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendStatusUpdate } from '@/lib/email'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {

  const { status } = await req.json()
  if (!['confirmed', 'cancelled', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({ status })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify client if confirmed or cancelled
  if (status === 'confirmed' || status === 'cancelled') {
    sendStatusUpdate({
      name: data.name,
      email: data.email,
      service: data.service,
      date: data.date,
      time: data.time,
      status,
    }).catch(console.error)
  }

  return NextResponse.json({ booking: data })
}
