import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('id, name, status')

    return NextResponse.json({
        data,
        error,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
    })
}