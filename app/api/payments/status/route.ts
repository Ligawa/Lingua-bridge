import { NextResponse, NextRequest } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getPaymentDetails } from '@/lib/alghahim-pay'

export async function GET(request: NextRequest) {
  try {
    const paymentId = new URL(request.url).searchParams.get('paymentId')
    if (!paymentId) return NextResponse.json({ error: 'paymentId required' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminDb = createAdminClient()
    const { data: payment, error } = await adminDb.from('payments')
      .select('id, status, paid_at, alghahim_payment_id, alghahim_reference')
      .eq('id', paymentId)
      .eq('student_id', user.id)
      .single()

    if (error || !payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })

    let status = payment.status
    let reference = payment.alghahim_reference
    if (payment.alghahim_payment_id && payment.status === 'pending') {
      const remote = await getPaymentDetails(payment.alghahim_payment_id)
      const remoteStatus = remote.status.toLowerCase()
      if (remoteStatus === 'completed' || remoteStatus === 'paid' || remoteStatus === 'success') {
        status = 'paid'
        reference = remote.reference ?? reference
        await adminDb.from('payments').update({ status: 'paid', paid_at: remote.completed_at ?? new Date().toISOString(), alghahim_reference: reference }).eq('id', payment.id)
      } else if (remoteStatus === 'failed' || remoteStatus === 'cancelled') {
        status = 'failed'
        await adminDb.from('payments').update({ status: 'failed', alghahim_reference: reference }).eq('id', payment.id)
      }
    }

    return NextResponse.json({ status, paid_at: status === 'paid' ? payment.paid_at : null, reference })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment status unavailable'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
