import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { TIME_SLOTS } from '@/lib/services'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const duration = parseInt(searchParams.get('duration') || '120')

  if (!date) return NextResponse.json({ slots: TIME_SLOTS })

  // Fetch existing bookings and blocked slots for this date
  const [{ data: bookings }, { data: blocked }] = await Promise.all([
    supabaseAdmin
      .from('bookings')
      .select('time, duration_mins')
      .eq('date', date)
      .neq('status', 'cancelled'),
    supabaseAdmin
      .from('blocked_slots')
      .select('time')
      .eq('date', date)
  ])

  const bookedTimes = new Set<string>()

  // Mark booked slots + their duration overlap
  for (const b of bookings || []) {
    const [bh, bm] = b.time.split(':').map(Number)
    const startMin = bh * 60 + bm
    const endMin = startMin + (b.duration_mins || 120)

    for (const slot of TIME_SLOTS) {
      const [sh, sm] = slot.split(':').map(Number)
      const slotMin = sh * 60 + sm
      // slot is unavailable if it overlaps with this booking
      if (slotMin >= startMin && slotMin < endMin) {
        bookedTimes.add(slot)
      }
    }
  }

  // Mark admin-blocked slots
  for (const b of blocked || []) {
    bookedTimes.add(b.time)
  }

  // A slot is also unavailable if the requested service would run past closing (17:30 = last slot for 120min)
  const lastSlot = 17 * 60 + 30 // 5:30pm
  const available = TIME_SLOTS.filter(slot => {
    if (bookedTimes.has(slot)) return false
    const [h, m] = slot.split(':').map(Number)
    const slotEnd = h * 60 + m + duration
    if (slotEnd > lastSlot + 120) return false // must fit before 7:30pm
    return true
  })

  return NextResponse.json({ slots: available })
}
