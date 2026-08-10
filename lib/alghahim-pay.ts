const ALGHAHIM_API_URL = 'https://pay.iicar.org/api/v1'

interface PaymentLinkResponse {
  id: string
  payment_url: string
  custom_path?: string
  amount_usd?: string | number
  amount_type?: string
  description?: string
  product_slug?: string
  is_active?: boolean
}

interface ApiEnvelope<T> {
  success?: boolean
  data?: T
  message?: string
  error?: string
}

function getApiKey() {
  const key = process.env.ALGHAHIM_PAY_API_KEY
  if (!key) throw new Error('Alghahim Pay is not configured')
  return key
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${ALGHAHIM_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })

  const body = (await response.json()) as ApiEnvelope<T> & T
  if (!response.ok) {
    throw new Error(body.message || body.error || `Alghahim Pay request failed (${response.status})`)
  }

  return (body.data ?? body) as T
}

export function createPaymentLink(input: {
  amountUsd: number
  description: string
  productSlug: string
  customPath: string
}) {
  return request<PaymentLinkResponse>('/payment-links', {
    method: 'POST',
    body: JSON.stringify({
      amount_usd: input.amountUsd,
      amount_type: 'fixed',
      description: input.description,
      product_slug: input.productSlug,
      custom_path: input.customPath,
      is_active: true,
    }),
  })
}

export function getPaymentDetails(paymentId: string) {
  return request<{ id: string; status: string; reference?: string; completed_at?: string }>(`/payments/${encodeURIComponent(paymentId)}`)
}

export function getPaymentLinkDetails(linkId: string) {
  return request<PaymentLinkResponse>(`/payment-links/${encodeURIComponent(linkId)}`)
}

export function getPaymentLinkUrl(link: PaymentLinkResponse) {
  return link.payment_url
}

export type { PaymentLinkResponse }
