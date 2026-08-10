'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react'

interface WalletTopupFormProps { userId: string }
const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500]

export function WalletTopupForm({ userId }: WalletTopupFormProps) {
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'awaiting' | 'verifying' | 'success'>('idle')
  const amount = selectedAmount ?? (customAmount ? Number(customAmount) : 0)

  async function initialize() {
    if (!Number.isFinite(amount) || amount < 1 || amount > 10000) {
      setError('Enter an amount between USD 1 and USD 10,000')
      return
    }
    setLoading(true); setError('')
    try {
      const response = await fetch('/api/wallet/topup/initialize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount_usd: amount, user_id: userId }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create payment link')
      setReference(data.data.reference); setStatus('awaiting')
      window.open(data.data.payment_url, '_blank', 'noopener,noreferrer')
    } catch (err) { setError(err instanceof Error ? err.message : 'Payment initialization failed') } finally { setLoading(false) }
  }

  async function verify() {
    setLoading(true); setError(''); setStatus('verifying')
    try {
      const response = await fetch('/api/wallet/topup/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reference }) })
      const data = await response.json()
      if (!response.ok || data.status === 'error' || data.status === 'failed') throw new Error(data.message || 'Payment verification failed')
      if (data.status === 'pending') throw new Error('Payment is still processing. Complete payment, then try again.')
      setStatus('success'); setTimeout(() => { router.push('/dashboard/finance'); router.refresh() }, 1800)
    } catch (err) { setError(err instanceof Error ? err.message : 'Payment verification failed'); setStatus('awaiting') } finally { setLoading(false) }
  }

  if (status === 'success') return <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center"><CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-green-600" /><p className="font-semibold text-green-900">Top-up successful</p><p className="mt-1 text-sm text-green-800">Your wallet is being credited.</p></div>
  if (status === 'awaiting' || status === 'verifying') return <div className="space-y-4 text-center"><div className="rounded-lg border border-blue-200 bg-blue-50 p-5"><ExternalLink className="mx-auto mb-3 h-8 w-8 text-blue-600" /><p className="font-semibold text-blue-900">Complete your payment</p><p className="mt-1 text-sm text-blue-800">Finish payment in the Alghahim Pay tab, then confirm below.</p></div><Button onClick={verify} disabled={loading} className="w-full" size="lg">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking payment...</> : 'I completed payment'}</Button>{error && <p className="text-sm text-destructive">{error}</p>}</div>

  return <div className="space-y-6">
    <div><label className="mb-3 block text-sm font-medium">Quick Select</label><div className="grid grid-cols-2 gap-3 md:grid-cols-3">{PRESET_AMOUNTS.map((value) => <button key={value} onClick={() => { setSelectedAmount(value); setCustomAmount('') }} className={`rounded-lg border-2 p-3 transition-colors ${selectedAmount === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}><div className="font-semibold">${value}</div></button>)}</div></div>
    <div><label className="mb-2 block text-sm font-medium">Or enter custom amount (USD)</label><div className="flex gap-2"><span className="flex items-center rounded-lg border border-border bg-muted px-3 font-medium text-muted-foreground">$</span><Input type="number" min="1" max="10000" step="0.01" placeholder="Enter amount in USD" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value); setSelectedAmount(null) }} /></div></div>
    {amount > 0 && <div className="rounded-lg border border-border bg-muted/50 p-4"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="font-semibold">${amount.toFixed(2)} USD</span></div></div>}
    {error && <div className="flex gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
    <Button onClick={initialize} disabled={loading || amount < 1} className="w-full" size="lg">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating secure link...</> : `Proceed to Payment - $${amount.toFixed(2)}`}</Button>
    <div className="space-y-1 text-xs text-muted-foreground"><p>• Payment is processed securely by Alghahim Pay</p><p>• Complete payment in the new tab, then confirm here</p><p>• Minimum top-up: USD 1</p></div>
  </div>
}
