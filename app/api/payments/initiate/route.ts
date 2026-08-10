import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { createPaymentLink } from '@/lib/alghahim-pay'

const USD_TO_KES = 134

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { programId, amount } = await request.json()
    const amountKes = Number(amount)
    if (!programId || !Number.isInteger(amountKes) || amountKes <= 0) {
      return NextResponse.json({ error: 'A valid program and amount are required' }, { status: 400 })
    }

    const adminDb = createAdminClient()
    const { data: program } = await adminDb.from('programs').select('title, price_cents').eq('id', programId).single()
    if (!program) return NextResponse.json({ error: 'Program not found' }, { status: 404 })

    const expectedKes = Math.round(Number(program.price_cents) / 100)
    if (expectedKes > 0 && amountKes !== expectedKes) {
      return NextResponse.json({ error: 'Payment amount does not match the program price' }, { status: 400 })
    }

    const amountUsd = Number((amountKes / USD_TO_KES).toFixed(2))
    const idempotencyPath = `program-${programId}-${user.id}-${amountKes}`
    const link = await createPaymentLink({
      amountUsd,
      description: `${program.title} enrollment`,
      productSlug: `program-${programId}`,
      customPath: idempotencyPath,
    })

    const { data: payment, error } = await adminDb.from('payments').insert({
      student_id: user.id,
      program_id: programId,
      amount_cents: amountKes * 100,
      currency: 'KES',
      status: 'pending',
      alghahim_link_id: link.id,
      alghahim_payment_url: link.payment_url,
    }).select('id').single()

    if (error) {
      console.error('[LinguaBridge] Payment record error:', error.message)
      return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      paymentUrl: link.payment_url,
      amountUsd,
      message: 'Secure payment link created.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment initiation failed'
    console.error('[LinguaBridge] Payment initiation error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
