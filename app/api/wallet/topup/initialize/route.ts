import { createClient, createAdminClient } from '@/lib/supabase/server'
import { createPaymentLink } from '@/lib/alghahim-pay'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { amount_usd, user_id } = await request.json()
    const amountUsd = Number(amount_usd)
    if (user_id !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!Number.isFinite(amountUsd) || amountUsd < 1 || amountUsd > 10000) {
      return NextResponse.json({ error: 'Amount must be between USD 1 and USD 10,000' }, { status: 400 })
    }

    const adminDb = createAdminClient()
    const reference = `wallet_topup_${user.id.slice(0, 8)}_${crypto.randomUUID().slice(0, 12)}`
    const link = await createPaymentLink({
      amountUsd: Number(amountUsd.toFixed(2)),
      description: `LinguaBridge wallet top-up (${reference})`,
      productSlug: 'wallet-topup',
      customPath: reference,
    })

    const { error } = await adminDb.from('wallet_transactions').insert({
      student_id: user.id,
      type: 'credit',
      amount_cents: Math.round(amountUsd * 100),
      description: `Wallet top-up via Alghahim Pay (USD ${amountUsd.toFixed(2)})`,
      reference_type: 'topup_pending',
      reference_id: link.id || reference,
    })
    if (error) throw error

    return NextResponse.json({ status: true, data: { payment_url: link.payment_url, reference: link.id || reference } })
  } catch (error) {
    console.error('[LinguaBridge] Wallet top-up initialization error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Payment initialization failed' }, { status: 500 })
  }
}
