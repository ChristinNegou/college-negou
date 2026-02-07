const CINETPAY_BASE_URL = "https://api-checkout.cinetpay.com/v2";

type InitPaymentParams = {
  amount: number;
  currency: string;
  transactionId: string;
  description: string;
  returnUrl: string;
  notifyUrl: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  channels?: string;
};

type InitPaymentResponse = {
  code: string;
  message: string;
  description: string;
  data: {
    payment_token: string;
    payment_url: string;
  };
};

type VerifyPaymentResponse = {
  code: string;
  message: string;
  data: {
    amount: string;
    currency: string;
    status: string;
    payment_method: string;
    description: string;
    metadata: string;
    operator_id: string;
    payment_date: string;
  };
};

export async function initiatePayment(params: InitPaymentParams): Promise<InitPaymentResponse> {
  const response = await fetch(`${CINETPAY_BASE_URL}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: params.transactionId,
      amount: params.amount,
      currency: params.currency || "XAF",
      description: params.description,
      return_url: params.returnUrl,
      notify_url: params.notifyUrl,
      customer_name: params.customerName || "",
      customer_email: params.customerEmail || "",
      customer_phone_number: params.customerPhone || "",
      channels: params.channels || "ALL",
    }),
  });

  return response.json();
}

export async function verifyPayment(transactionId: string): Promise<VerifyPaymentResponse> {
  const response = await fetch(`${CINETPAY_BASE_URL}/payment/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id: transactionId,
    }),
  });

  return response.json();
}
