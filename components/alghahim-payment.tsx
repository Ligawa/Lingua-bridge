'use client'

import { useState } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AlghahimPayment({ programId, amount, onSuccess }: { programId: string; amount: number; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePayment() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId, amount }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to create payment link')
      window.open(data.paymentUrl, '_blank', 'noopener,noreferrer')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create payment link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="font-semibold text-foreground">Pay securely</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">We will open a secure LinguaBridge payment link in a new tab. Return here after completing payment.</p>
      </div>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <Button onClick={handlePayment} disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ExternalLink className="mr-2 size-4" />}
        {loading ? 'Creating payment link...' : 'Continue to payment'}
      </Button>
    </div>
  )
}
