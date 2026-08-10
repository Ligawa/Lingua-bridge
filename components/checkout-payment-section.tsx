'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlghahimPayment } from '@/components/alghahim-payment'
import { WalletPaymentOption } from '@/components/wallet-payment-option'

interface CheckoutPaymentSectionProps {
  programId: string
  programTitle: string
  amount: number
}

export function CheckoutPaymentSection({
  programId,
  programTitle,
  amount,
}: CheckoutPaymentSectionProps) {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<'payment-link' | 'wallet' | null>(null)

  const handleSuccess = () => {
    router.push(`/dashboard/programs/${programId}`)
    router.refresh()
  }

  if (paymentMethod === 'wallet') {
    return (
      <WalletPaymentOption
        programId={programId}
        programTitle={programTitle}
        amount={amount}
        onSuccess={handleSuccess}
        onBack={() => setPaymentMethod(null)}
      />
    )
  }

  if (paymentMethod === 'payment-link') {
    return <AlghahimPayment programId={programId} amount={amount} onSuccess={handleSuccess} />
  }

  // Show payment method selection
  return (
    <div className="space-y-4">
      <button
        onClick={() => setPaymentMethod('wallet')}
        className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
      >
        <div className="font-semibold text-foreground">Pay with Wallet</div>
        <div className="text-sm text-muted-foreground">Use your account balance</div>
      </button>
      <button
        onClick={() => setPaymentMethod('payment-link')}
        className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
      >
        <div className="font-semibold text-foreground">Pay with secure link</div>
        <div className="text-sm text-muted-foreground">Complete payment securely through LinguaBridge</div>
      </button>
    </div>
  )
}
