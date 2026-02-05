// Cloudflare Workers compatible LiqPay utilities

export interface LiqPayPaymentData {
  version: string;
  public_key: string;
  action: string;
  amount: number;
  currency: string;
  description: string;
  order_id: string;
  result_url?: string;
  server_url?: string;
  language?: 'uk' | 'ru' | 'en';
}

/**
 * Generate SHA-1 hash using Web Crypto API (Cloudflare Workers compatible)
 */
async function sha1Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  
  // Convert ArrayBuffer to Base64
  const bytes = new Uint8Array(hashBuffer);
  const binary = String.fromCharCode(...bytes);
  return btoa(binary);
}

/**
 * Generate LiqPay payment signature
 */
export async function generateLiqPaySignature(
  data: LiqPayPaymentData,
  privateKey: string
): Promise<{ data: string; signature: string }> {
  // Convert to JSON and Base64 encode
  const dataString = JSON.stringify(data);
  const dataBase64 = btoa(unescape(encodeURIComponent(dataString)));
  
  // Generate signature: SHA1(private_key + data + private_key)
  const signatureString = privateKey + dataBase64 + privateKey;
  const signatureHash = await sha1Hash(signatureString);
  
  return { data: dataBase64, signature: signatureHash };
}

/**
 * Verify LiqPay callback signature
 */
export async function verifyLiqPayCallback(
  data: string,
  signature: string,
  privateKey: string
): Promise<boolean> {
  const signatureString = privateKey + data + privateKey;
  const computedSignature = await sha1Hash(signatureString);
  
  return computedSignature === signature;
}

/**
 * Decode LiqPay Base64-encoded data
 */
export function decodeLiqPayData(data: string): any {
  const decodedString = decodeURIComponent(escape(atob(data)));
  return JSON.parse(decodedString);
}
