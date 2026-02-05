// Monobank payment gateway utilities

export interface MonobankInvoiceRequest {
  amount: number;              // Amount in kopecks
  ccy?: number;                // Currency code (980 = UAH, 840 = USD, 978 = EUR)
  merchantPaymInfo?: {
    reference?: string;
    destination?: string;
    basketOrder?: Array<{
      name: string;
      qty: number;
      sum: number;
    }>;
  };
  redirectUrl?: string;
  successUrl?: string;
  failUrl?: string;
  webHookUrl: string;
  validity?: number;           // Validity in seconds
  paymentType?: 'debit' | 'hold';
}

export interface MonobankInvoiceResponse {
  invoiceId: string;
  pageUrl: string;
}

export interface MonobankSubscriptionRequest {
  amount: number;              // Amount in kopecks
  ccy?: number;                // Currency code (980 = UAH, 840 = USD, 978 = EUR)
  redirectUrl?: string;
  webHookUrl?: string;         // Webhook URL for subscription notifications
  interval: string;            // Format: "1d", "2w", "1m", "1y" - required, top-level field
  validity?: number;           // Validity in seconds (default: 24 hours)
}

export interface MonobankSubscriptionResponse {
  subscriptionId?: string;
  pageUrl?: string;
  url?: string;  // Some APIs return 'url' instead of 'pageUrl'
  [key: string]: any;  // Allow for flexible response structure
}

/**
 * Create a Monobank invoice
 */
export async function createMonobankInvoice(
  invoiceData: MonobankInvoiceRequest,
  apiToken: string
): Promise<MonobankInvoiceResponse> {
  const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
    method: 'POST',
    headers: {
      'X-Token': apiToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoiceData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Unknown error';
    try {
      const error = JSON.parse(errorText);
      errorMessage = error.errText || error.message || errorText;
    } catch {
      errorMessage = errorText || response.statusText;
    }
    throw new Error(`Monobank API error: ${errorMessage} (${response.status})`);
  }
  
  return response.json();
}

/**
 * Convert amount from main currency units to kopecks
 * For UAH, USD, EUR: multiply by 100
 * For currencies without cents (like JPY): return as-is
 */
export function convertToKopecks(amount: number, currency: string): number {
  const currenciesWithCents = ['UAH', 'USD', 'EUR', 'GBP', 'PLN'];
  return currenciesWithCents.includes(currency.toUpperCase()) 
    ? Math.round(amount * 100) 
    : Math.round(amount);
}

/**
 * Convert currency code to Monobank currency number
 */
export function getCurrencyCode(currency: string): number {
  const currencyMap: Record<string, number> = {
    'UAH': 980,
    'USD': 840,
    'EUR': 978,
    'GBP': 826,
    'PLN': 985,
  };
  return currencyMap[currency.toUpperCase()] || 980;
}

/**
 * Create a Monobank subscription (recurring payment)
 * Documentation: https://monobank.ua/api-docs/acquiring/methods/subscription/post--api--merchant--subscription--create
 */
export async function createMonobankSubscription(
  subscriptionData: MonobankSubscriptionRequest,
  apiToken: string
): Promise<MonobankSubscriptionResponse> {
  const response = await fetch('https://api.monobank.ua/api/merchant/subscription/create', {
    method: 'POST',
    headers: {
      'X-Token': apiToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscriptionData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Unknown error';
    try {
      const error = JSON.parse(errorText);
      errorMessage = error.errText || error.message || errorText;
    } catch {
      errorMessage = errorText || response.statusText;
    }
    
    // Provide helpful error message for h2h not allowed error
    if (errorMessage.includes('h2h not allowed') || errorMessage.includes('h2h')) {
      throw new Error(`Monobank Subscription API error: Host-to-host (h2h) payments are not enabled for your merchant account. Please contact Monobank support to enable h2h payments for subscriptions. Original error: ${errorMessage} (${response.status})`);
    }
    
    throw new Error(`Monobank Subscription API error: ${errorMessage} (${response.status})`);
  }
  
  return response.json();
}
