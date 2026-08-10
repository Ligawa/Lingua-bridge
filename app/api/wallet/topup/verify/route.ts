import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getPaymentDetails, getPaymentLinkDetails } from '@/lib/alghahim-pay'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { reference } = await request.json()
    if (!reference) return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 })

    const adminDb = createAdminClient()
    const { data: pending } = await adminDb.from('wallet_transactions')
      .select('*').eq('student_id', user.id).eq('reference_id', reference).eq('reference_type', 'topup_pending').maybeSingle()
    if (!pending) return NextResponse.json({ status: 'failed', message: 'Top-up not found' }, { status: 404 })

    const { data: alreadyCompleted } = await adminDb.from('wallet_transactions')
      .select('id').eq('student_id', user.id).eq('reference_id', reference).eq('reference_type', 'topup_completed').maybeSingle()
    if (alreadyCompleted) return NextResponse.json({ status: 'success', message: 'Wallet top-up already credited' })

    let status = ''
    try {
      const payment = await getPaymentDetails(reference)
      status = payment.status
    } catch {
      const link = await getPaymentLinkDetails(reference)
      status = link.is_active === false ? 'completed' : 'pending'
    }
    if (!['completed', 'paid', 'success', 'succeeded'].includes(status.toLowerCase())) {
      return NextResponse.json({ status: 'pending', message: 'Payment is still processing' })
    }

    const { data: wallet } = await adminDb.from('student_wallets').select('*').eq('student_id', user.id).maybeSingle()
    const currentWallet = wallet ?? (await adminDb.from('student_wallets').insert({ student_id: user.id, balance_cents: 0, total_credited_cents: 0, total_spent_cents: 0 }).select().single()).data
    if (!currentWallet) return NextResponse.json({ status: 'error', message: 'Failed to create wallet' }, { status: 500 })

    const amount = pending.amount_cents
    const { error: walletError } = await adminDb.from('student_wallets').update({
      balance_cents: currentWallet.balance_cents + amount,
      total_credited_cents: currentWallet.total_credited_cents + amount,
      updated_at: new Date().toISOString(),
    }).eq('student_id', user.id)
    if (walletError) throw walletError

    await adminDb.from('wallet_transactions').update({ reference_type: 'topup_completed', description: `${pending.description} — completed` }).eq('id', pending.id)
    return NextResponse.json({ status: 'success', data: { amountAdded: amount, newBalance: currentWallet.balance_cents + amount, reference } })
  } catch (error) {
    console.error('[LinguaBridge] Wallet top-up verification error:', error)
    return NextResponse.json({ status: 'error', message: 'Payment verification failed' }, { status: 500 })
  }
}
