import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasPassword: !!process.env.ADMIN_PASSWORD,
    passwordLength: process.env.ADMIN_PASSWORD?.length,
    firstChar: process.env.ADMIN_PASSWORD?.[0],
  })
}
