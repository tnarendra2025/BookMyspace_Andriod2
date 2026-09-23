export interface PaymentConfigResponse {
  success: boolean;
  keyId: string;
  currency: string;
  isLive: boolean;
  methods: string[];
}

export interface PaymentOrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isSandbox: boolean;
  receipt: string;
  customer?: {
    name: string;
    email?: string;
    phone?: string;
  };
  error?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  paymentId: string;
  orderId: string;
  status: string;
  bookingRef: string;
  utrOrRrn: string;
  message?: string;
  error?: string;
}

export async function fetchPaymentGatewayConfig(): Promise<PaymentConfigResponse> {
  try {
    const res = await fetch('/api/payments/config');
    return await res.json();
  } catch (err) {
    return {
      success: true,
      keyId: '',
      currency: 'INR',
      isLive: false,
      methods: ['upi', 'card', 'netbanking', 'cash_at_venue'],
    };
  }
}

export async function createRealPaymentOrder(payload: {
  amount: number;
  bookingRef: string;
  venueName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  bookingId?: string;
}): Promise<PaymentOrderResponse> {
  try {
    const res = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      orderId: '',
      amount: payload.amount,
      currency: 'INR',
      keyId: '',
      isSandbox: true,
      receipt: payload.bookingRef,
      error: err?.message || 'Failed to initialize payment order on server',
    };
  }
}

export async function verifyPaymentWithServer(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  bookingId?: string;
  bookingRef?: string;
  amount?: number;
  paymentMethod?: string;
}): Promise<PaymentVerificationResponse> {
  try {
    const res = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      paymentId: payload.razorpay_payment_id,
      orderId: payload.razorpay_order_id,
      status: 'FAILED',
      bookingRef: payload.bookingRef || '',
      utrOrRrn: '',
      error: err?.message || 'Verification network failure',
    };
  }
}

export async function fetchRealTransactions(): Promise<any[]> {
  try {
    const res = await fetch('/api/payments/transactions');
    if (res.ok) {
      const data = await res.json();
      return data.transactions || [];
    }
  } catch (e) {
    console.error('Error fetching transactions:', e);
  }
  return [];
}
