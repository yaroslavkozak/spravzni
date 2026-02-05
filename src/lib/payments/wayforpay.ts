// WayForPay payment gateway utilities

export interface WayForPayInvoiceRequest {
  transactionType: 'CREATE_INVOICE';
  apiVersion?: number;
  merchantAccount: string;
  merchantDomainName: string;
  orderReference: string;
  orderDate: number;
  amount: number;
  currency: string;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  serviceUrl?: string;
  returnUrl?: string;
  language?: 'UA' | 'RU' | 'EN';
  merchantAuthType?: 'SimpleSignature';
  merchantTransactionType?: 'AUTO' | 'AUTH' | 'SALE';
  clientEmail?: string;
  clientPhone?: string;
  clientFirstName?: string;
  clientLastName?: string;
  orderTimeout?: number;
  [key: string]: any; // Allow additional fields
}

export interface WayForPayInvoiceResponse {
  reason: string;
  reasonCode: number | string;
  invoiceUrl?: string;
  qrCode?: string;
  orderReference?: string;
  [key: string]: any;
}

export interface WayForPayCallback {
  merchantAccount: string;
  orderReference: string;
  amount: number;
  currency: string;
  authCode: string;
  cardPan: string;
  transactionStatus: 'Approved' | 'Declined' | 'InProcessing' | 'Refunded' | 'RefundInProcessing' | 'Expired';
  reasonCode: number;
  reason: string;
  [key: string]: any;
}

/**
 * Simple MD5 implementation for Cloudflare Workers
 * Based on standard MD5 algorithm
 */
function md5Hash(message: string): string {
  function md5cycle(x: number[], k: number[]): void {
    let a = x[0], b = x[1], c = x[2], d = x[3];

    function cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
      return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
      return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
      return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function add32(a: number, b: number): number {
      return (a + b) & 0xFFFFFFFF;
    }

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function add32(a: number, b: number): number {
    return (a + b) & 0xFFFFFFFF;
  }

  function rhex(n: number): string {
    let s = '';
    for (let j = 0; j <= 3; j++) {
      s += ((n >> (j * 8 + 4)) & 0x0F).toString(16) + ((n >> (j * 8)) & 0x0F).toString(16);
    }
    return s;
  }

  const msg = unescape(encodeURIComponent(message));
  const msgLen = msg.length;
  const n = ((msgLen + 8) >> 6) + 1;
  const x = new Array(n * 16);
  
  for (let i = 0; i < n * 16; i++) {
    x[i] = 0;
  }
  
  let i = 0;
  for (i = 0; i < msgLen; i++) {
    x[i >> 2] |= msg.charCodeAt(i) << ((i % 4) * 8);
  }
  
  x[i >> 2] |= 0x80 << ((i % 4) * 8);
  x[n * 16 - 2] = msgLen * 8;

  const h = [1732584193, -271733879, -1732584194, 271733878];
  const k = new Array(16);
  
  for (i = 0; i < n; i++) {
    for (let j = 0; j < 16; j++) {
      k[j] = x[i * 16 + j];
    }
    md5cycle(h, k);
  }

  return rhex(h[0]) + rhex(h[1]) + rhex(h[2]) + rhex(h[3]);
}

/**
 * Generate HMAC-MD5 hash
 * HMAC-MD5(key, message) = MD5((key XOR opad) || MD5((key XOR ipad) || message))
 * 
 * This implementation ensures proper UTF-8 handling for both key and message
 */
function hmacMd5Hash(key: string, message: string): string {
  const blockSize = 64;
  const ipad = Array(blockSize).fill(0x36);
  const opad = Array(blockSize).fill(0x5C);

  // Convert key to UTF-8 bytes
  let keyBytes: number[];
  const keyEncoded = new TextEncoder().encode(key);
  if (keyEncoded.length > blockSize) {
    // If key is longer than block size, hash it first
    const keyHash = md5Hash(key);
    keyBytes = [];
    for (let i = 0; i < keyHash.length; i += 2) {
      keyBytes.push(parseInt(keyHash.substring(i, i + 2), 16));
    }
  } else {
    keyBytes = Array.from(keyEncoded);
  }

  // Pad key to block size with zeros
  while (keyBytes.length < blockSize) {
    keyBytes.push(0);
  }

  // Create inner and outer keys by XORing with ipad/opad
  const innerKey = keyBytes.map((b, i) => b ^ ipad[i]);
  const outerKey = keyBytes.map((b, i) => b ^ opad[i]);

  // Convert inner key bytes to string (raw bytes, not UTF-8)
  const innerKeyStr = innerKey.map(b => String.fromCharCode(b)).join('');
  
  // The message is already a UTF-8 string, md5Hash will handle encoding
  // Concatenate inner key (raw bytes as string) with message (UTF-8 string)
  const innerMessage = innerKeyStr + message;
  const innerHash = md5Hash(innerMessage);

  // Convert inner hash (hex string) to bytes
  const innerHashBytes: number[] = [];
  for (let i = 0; i < innerHash.length; i += 2) {
    innerHashBytes.push(parseInt(innerHash.substring(i, i + 2), 16));
  }

  // Convert outer key bytes to string (raw bytes)
  const outerKeyStr = outerKey.map(b => String.fromCharCode(b)).join('');
  
  // Convert inner hash bytes to string (raw bytes)
  const innerHashStr = innerHashBytes.map(b => String.fromCharCode(b)).join('');
  
  // Concatenate outer key with inner hash and hash again
  const outerMessage = outerKeyStr + innerHashStr;
  return md5Hash(outerMessage);
}

/**
 * Generate WayForPay CREATE_INVOICE signature
 * According to WayForPay CREATE_INVOICE documentation (https://wiki.wayforpay.com/view/608996852):
 * Signature includes: merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;
 * productName[0];productName[1];...;productCount[0];productCount[1];...;productPrice[0];productPrice[1];...
 * 
 * NOTE: serviceUrl, returnUrl, language, transactionType, apiVersion, and client fields are NOT included in signature!
 */
export function generateWayForPayInvoiceSignature(
  fields: Record<string, any>,
  secretKey: string
): string {
  // Trim secret key to remove any whitespace
  const trimmedSecretKey = secretKey.trim();
  
  // Build signature string in exact order specified by WayForPay Purchase documentation
  const values: string[] = [];
  
  // 1. Required fields in exact order (as per CREATE_INVOICE documentation)
  values.push(String(fields.merchantAccount || ''));
  values.push(String(fields.merchantDomainName || ''));
  values.push(String(fields.orderReference || ''));
  values.push(String(fields.orderDate || ''));
  // Convert amount to string as-is (matches JSON serialization - 300.00 becomes "300")
  values.push(String(fields.amount || ''));
  values.push(String(fields.currency || ''));
  
  // 2. Product arrays - expand each element separately
  if (Array.isArray(fields.productName)) {
    for (const name of fields.productName) {
      values.push(String(name));
    }
  }
  
  if (Array.isArray(fields.productCount)) {
    for (const count of fields.productCount) {
      values.push(String(count));
    }
  }
  
  if (Array.isArray(fields.productPrice)) {
    for (const price of fields.productPrice) {
      // Convert to string as-is (matches JSON serialization)
      values.push(String(price));
    }
  }
  
  const message = values.join(';');
  
  // Log signature details for debugging
  console.log('WayForPay CREATE_INVOICE signature generation:', {
    includedFields: [
      'merchantAccount',
      'merchantDomainName',
      'orderReference',
      'orderDate',
      'amount',
      'currency',
      ...(Array.isArray(fields.productName) ? [`productName[${fields.productName.length}]`] : []),
      ...(Array.isArray(fields.productCount) ? [`productCount[${fields.productCount.length}]`] : []),
      ...(Array.isArray(fields.productPrice) ? [`productPrice[${fields.productPrice.length}]`] : []),
    ],
    fullMessage: message,
    messageLength: message.length,
    secretKeyLength: trimmedSecretKey.length,
    secretKeyHasWhitespace: secretKey !== trimmedSecretKey,
    secretKeyPreview: trimmedSecretKey.length > 0 ? `${trimmedSecretKey.substring(0, 4)}...${trimmedSecretKey.substring(trimmedSecretKey.length - 4)}` : 'empty',
    merchantAccount: fields.merchantAccount,
    merchantDomainName: fields.merchantDomainName,
    fieldValues: {
      merchantAccount: fields.merchantAccount,
      merchantDomainName: fields.merchantDomainName,
      orderReference: fields.orderReference,
      orderDate: fields.orderDate,
      amount: fields.amount,
      currency: fields.currency,
      productName: fields.productName,
      productCount: fields.productCount,
      productPrice: fields.productPrice,
    },
  });
  
  const signature = hmacMd5Hash(trimmedSecretKey, message);
  
  console.log('WayForPay CREATE_INVOICE signature result:', {
    signature,
    signatureLength: signature.length,
  });
  
  return signature;
}

/**
 * Verify WayForPay callback signature
 * According to Purchase documentation, callback signature includes:
 * merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode
 */
export function verifyWayForPayCallback(
  callback: WayForPayCallback,
  secretKey: string
): boolean {
  // Extract signature from callback (if present)
  // WayForPay sends signature in the callback
  const signature = (callback as any).merchantSignature;
  
  if (!signature) {
    return false;
  }
  
  // Generate expected signature according to Purchase documentation
  // Signature string: merchantAccount;orderReference;amount;currency;authCode;cardPan;transactionStatus;reasonCode
  const trimmedSecretKey = secretKey.trim();
  const values = [
    String(callback.merchantAccount || ''),
    String(callback.orderReference || ''),
    String(callback.amount || ''),
    String(callback.currency || ''),
    String(callback.authCode || ''),
    String(callback.cardPan || ''),
    String(callback.transactionStatus || ''),
    String(callback.reasonCode || ''),
  ];
  
  const message = values.join(';');
  const expectedSignature = hmacMd5Hash(trimmedSecretKey, message);
  
  return expectedSignature === signature;
}

/**
 * Create a WayForPay invoice using CREATE_INVOICE method
 * Documentation: https://wiki.wayforpay.com/view/608996852
 */
export async function createWayForPayInvoice(
  invoiceData: WayForPayInvoiceRequest,
  merchantSecretKey: string
): Promise<WayForPayInvoiceResponse> {
  // Trim secret key to remove any whitespace
  const trimmedSecretKey = merchantSecretKey.trim();
  
  // Generate signature according to CREATE_INVOICE documentation
  const signature = generateWayForPayInvoiceSignature(invoiceData, trimmedSecretKey);
  
  // Add signature to request
  const requestData = {
    ...invoiceData,
    merchantSignature: signature,
  };
  
  // Log request for debugging (without sensitive data)
  console.log('WayForPay CREATE_INVOICE API request:', {
    transactionType: requestData.transactionType,
    apiVersion: requestData.apiVersion,
    merchantAccount: requestData.merchantAccount,
    merchantDomainName: requestData.merchantDomainName,
    orderReference: requestData.orderReference,
    amount: requestData.amount,
    currency: requestData.currency,
    hasSignature: !!requestData.merchantSignature,
    signatureLength: requestData.merchantSignature?.length,
  });
  
  // Use CREATE_INVOICE endpoint per documentation
  const response = await fetch('https://api.wayforpay.com/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  
  const responseText = await response.text();
  
  if (!response.ok) {
    let errorMessage = 'Unknown error';
    let errorDetails: any = {};
    try {
      const error = JSON.parse(responseText);
      errorMessage = error.reason || error.message || responseText;
      errorDetails = error;
    } catch {
      errorMessage = responseText || response.statusText;
    }
    
    console.error('WayForPay CREATE_INVOICE API error response:', {
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      errorDetails,
      responseText,
    });
    
    throw new Error(`WayForPay CREATE_INVOICE API error: ${errorMessage} (${response.status})`);
  }
  
  let responseData: WayForPayInvoiceResponse;
  try {
    responseData = JSON.parse(responseText);
  } catch (e) {
    console.error('Failed to parse WayForPay CREATE_INVOICE response:', {
      responseText,
      error: e,
    });
    throw new Error(`WayForPay CREATE_INVOICE API returned invalid JSON: ${responseText}`);
  }
  
  // Log response for debugging
  console.log('WayForPay CREATE_INVOICE API response:', {
    reasonCode: responseData.reasonCode,
    reason: responseData.reason,
    hasInvoiceUrl: !!responseData.invoiceUrl,
    orderReference: responseData.orderReference,
  });
  
  return responseData;
}

/**
 * Convert amount to smallest currency unit (kopecks for UAH, cents for USD/EUR)
 */
export function convertToSmallestUnit(amount: number, currency: string): number {
  const currenciesWithCents = ['UAH', 'USD', 'EUR', 'GBP', 'PLN'];
  return currenciesWithCents.includes(currency.toUpperCase()) 
    ? Math.round(amount * 100) 
    : Math.round(amount);
}

/**
 * Convert from smallest currency unit back to main unit
 */
export function convertFromSmallestUnit(amount: number, currency: string): number {
  const currenciesWithCents = ['UAH', 'USD', 'EUR', 'GBP', 'PLN'];
  return currenciesWithCents.includes(currency.toUpperCase()) 
    ? amount / 100 
    : amount;
}
