// Cloudflare Workers Type Definitions
// These types provide TypeScript support for D1 and R2 bindings

export interface Env {
  // D1 Database binding
  DB: D1Database;
  
  // R2 Bucket binding
  BUCKET: R2Bucket;
  
  // Resend configuration (optional, for email functionality)
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  
  // Telegram Bot Token (optional, for Telegram notifications)
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_GROUP_CHAT_ID?: string; // Telegram group chat ID for general notifications (e.g., "-5078474468")
  TELEGRAM_CHAT_GROUP_ID?: string; // Telegram group chat ID specifically for chat requests (e.g., "-1234567890")
  
  // Payment Gateway Configuration
  LIQPAY_PUBLIC_KEY?: string;
  LIQPAY_PRIVATE_KEY?: string;
  MONOBANK_API_TOKEN?: string;
  WAYFORPAY_MERCHANT_ACCOUNT?: string;  // WayForPay merchant login
  WAYFORPAY_SECRET_KEY?: string;        // WayForPay merchant secret key
  BASE_URL?: string;  // Base URL for callbacks (e.g., https://yourdomain.com)
  
  // Instagram API Configuration
  INSTAGRAM_ACCESS_TOKEN?: string;  // Instagram Graph API access token
  INSTAGRAM_USER_ID?: string;        // Instagram Business/Creator account user ID
  
  // Cloudflare Queues
  NOTIFICATIONS_QUEUE: Queue<NotificationMessage>;
  
  // Durable Objects
  CHAT_ROOM: DurableObjectNamespace<ChatRoom>;
}

// ExecutionContext is provided by Cloudflare Workers runtime
// This is a type declaration to make TypeScript aware of it
declare global {
  interface ExecutionContext {
    waitUntil(promise: Promise<unknown>): void;
    passThroughOnException(): void;
  }
}

// D1 Database types
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    size_after: number;
    rows_read: number;
    rows_written: number;
    last_row_id: number;
    changed_db: boolean;
    changes: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// R2 Bucket types
export interface R2Bucket {
  head(key: string): Promise<R2Object | null>;
  get(key: string, options?: R2GetOptions): Promise<R2ObjectBody | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob | null, options?: R2PutOptions): Promise<R2Object>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: R2ListOptions): Promise<R2Objects>;
  createMultipartUpload(key: string, options?: R2MultipartOptions): Promise<R2MultipartUpload>;
  resumeMultipartUpload(key: string, uploadId: string): R2MultipartUpload;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  checksums: R2Checksums;
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T = unknown>(): Promise<T>;
  blob(): Promise<Blob>;
}

export interface R2GetOptions {
  onlyIf?: R2Conditional;
  range?: R2Range;
}

export interface R2PutOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
  onlyIf?: R2Conditional;
}

export interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
  include?: ('httpMetadata' | 'customMetadata')[];
}

export interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimitedPrefixes: string[];
}

export interface R2HTTPMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

export interface R2Conditional {
  etagMatches?: string;
  etagDoesNotMatch?: string;
  uploadedBefore?: Date;
  uploadedAfter?: Date;
}

export interface R2Range {
  offset?: number;
  length?: number;
  suffix?: number;
}

export interface R2Checksums {
  md5?: ArrayBuffer;
  sha1?: ArrayBuffer;
  sha256?: ArrayBuffer;
  sha384?: ArrayBuffer;
  sha512?: ArrayBuffer;
}

export interface R2MultipartOptions {
  httpMetadata?: R2HTTPMetadata;
  customMetadata?: Record<string, string>;
}

export interface R2MultipartUpload {
  key: string;
  uploadId: string;
  uploadPart(partNumber: number, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob | null): Promise<R2UploadedPart>;
  abort(): Promise<void>;
  complete(uploadedParts: R2UploadedPart[]): Promise<R2Object>;
}

export interface R2UploadedPart {
  partNumber: number;
  etag: string;
}

// Queue types
export interface Queue<T = unknown> {
  send(message: T, options?: QueueSendOptions): Promise<void>;
  sendBatch(messages: T[], options?: QueueSendOptions): Promise<void>;
}

export interface QueueSendOptions {
  contentType?: string;
  delaySeconds?: number;
}

export interface MessageBatch<T = unknown> {
  readonly messages: readonly QueueMessage<T>[];
  ackAll(): void;
  retryAll(): void;
}

export interface QueueMessage<T = unknown> {
  readonly id: string;
  readonly timestamp: Date;
  readonly body: T;
  ack(): void;
  retry(): void;
}

// Notification message types
export interface NotificationMessage {
  type: 'contact-form' | 'chat-message';
  data: ContactFormData | ChatMessageNotificationData;
  metadata: {
    timestamp: string;
    retryCount?: number;
  };
}

export interface ChatMessageNotificationData {
  sessionId: string;
  messageText: string;
  senderType: 'user' | 'manager';
  userIdentifier?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  userPhone?: string | null;
  queuePosition?: number | null;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  contactPreference: 'phone' | 'whatsapp' | 'email' | null;
  selectedInterests: string[];
  comment?: string;
  wantsPriceList: boolean;
}

// Durable Object types
export interface DurableObjectNamespace<T = unknown> {
  idFromName(name: string): DurableObjectId;
  idFromString(id: string): DurableObjectId;
  newUniqueId(options?: { jurisdiction?: string }): DurableObjectId;
  get(id: DurableObjectId): DurableObjectStub<T>;
}

export interface DurableObjectId {
  toString(): string;
  equals(other: DurableObjectId): boolean;
  name?: string;
}

export interface DurableObjectStub<T = unknown> {
  id: DurableObjectId;
  name?: string;
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}

export interface DurableObjectState {
  id: DurableObjectId;
  storage: DurableObjectStorage;
  blockConcurrencyWhile<T>(fn: () => Promise<T>): Promise<T>;
  waitUntil(promise: Promise<unknown>): void;
}

export interface DurableObjectStorage {
  get<T = unknown>(key: string, options?: { allowConcurrency?: boolean }): Promise<T | undefined>;
  get<T = unknown>(keys: string[], options?: { allowConcurrency?: boolean }): Promise<Map<string, T>>;
  put<T = unknown>(key: string, value: T, options?: { allowConcurrency?: boolean }): Promise<void>;
  put<T = unknown>(entries: Record<string, T>, options?: { allowConcurrency?: boolean }): Promise<void>;
  delete(key: string, options?: { allowConcurrency?: boolean }): Promise<boolean>;
  delete(keys: string[], options?: { allowConcurrency?: boolean }): Promise<number>;
  list<T = unknown>(options?: DurableObjectListOptions): Promise<Map<string, T>>;
  deleteAll(options?: { allowConcurrency?: boolean }): Promise<void>;
  getAlarm(options?: { allowConcurrency?: boolean }): Promise<number | null>;
  setAlarm(scheduledTime: number | Date, options?: { allowConcurrency?: boolean }): Promise<void>;
  deleteAlarm(options?: { allowConcurrency?: boolean }): Promise<void>;
  sync(): Promise<void>;
  transaction<T>(closure: (txn: DurableObjectTransaction) => Promise<T>): Promise<T>;
}

export interface DurableObjectListOptions {
  start?: string;
  end?: string;
  prefix?: string;
  reverse?: boolean;
  limit?: number;
  allowConcurrency?: boolean;
}

export interface DurableObjectTransaction {
  get<T = unknown>(key: string): Promise<T | undefined>;
  get<T = unknown>(keys: string[]): Promise<Map<string, T>>;
  put<T = unknown>(key: string, value: T): void;
  put<T = unknown>(entries: Record<string, T>): void;
  delete(key: string): void;
  delete(keys: string[]): void;
  list<T = unknown>(options?: DurableObjectListOptions): Map<string, T>;
  rollback(): void;
  commit(): Promise<void>;
}

// ChatRoom Durable Object class (will be imported from chat-room.ts)
export class ChatRoom {
  constructor(state: DurableObjectState, env: Env);
  fetch(request: Request): Promise<Response>;
}

// Cloudflare Workers WebSocket types
declare global {
  class WebSocketPair {
    constructor();
    0: WebSocket;
    1: WebSocket;
  }

  interface ResponseInit {
    webSocket?: WebSocket;
  }
}

