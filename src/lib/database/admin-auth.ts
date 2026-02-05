/**
 * Database Helper Functions for Admin Authentication
 * Functions for working with admin_users and admin_sessions tables in D1
 */

import type { D1Database } from '../../../types/cloudflare';

export interface AdminUser {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: string;
  admin_user_id: number;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface CreateAdminUserInput {
  email: string;
  password: string;
  name?: string | null;
  role?: 'admin' | 'super_admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Hash password using PBKDF2 (Web Crypto API)
 * This is compatible with Cloudflare Workers
 */
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  // Generate salt if not provided
  const saltBytes = salt 
    ? Uint8Array.from(atob(salt), c => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));
  
  const saltBase64 = salt || btoa(String.fromCharCode(...saltBytes));

  // Import password as key material
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // Derive key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000, // High iteration count for security
      hash: 'SHA-256',
    },
    passwordKey,
    256 // 32 bytes = 256 bits
  );

  // Convert to base64
  const hashArray = new Uint8Array(derivedBits);
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return { hash: hashBase64, salt: saltBase64 };
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const { hash: computedHash } = await hashPassword(password, salt);
  return computedHash === hash;
}

/**
 * Create a new admin user
 */
export async function createAdminUser(
  db: D1Database,
  user: CreateAdminUserInput
): Promise<AdminUser> {
  // Check if user already exists
  const existing = await getAdminUserByEmail(db, user.email);
  if (existing) {
    throw new Error('Admin user with this email already exists');
  }

  // Hash password
  const { hash, salt } = await hashPassword(user.password);
  // Store hash and salt together (format: hash:salt)
  const passwordHash = `${hash}:${salt}`;

  const result = await db
    .prepare(
      `INSERT INTO admin_users (email, password_hash, name, role, is_active)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(
      user.email.toLowerCase().trim(),
      passwordHash,
      user.name || null,
      user.role || 'admin',
      1 // is_active
    )
    .run();

  if (!result.success) {
    throw new Error('Failed to create admin user');
  }

  const created = await getAdminUserById(db, result.meta.last_row_id);
  if (!created) {
    throw new Error('Failed to retrieve created admin user');
  }

  return created;
}

/**
 * Get admin user by ID
 */
export async function getAdminUserById(
  db: D1Database,
  id: number
): Promise<AdminUser | null> {
  const result = await db
    .prepare('SELECT * FROM admin_users WHERE id = ?')
    .bind(id)
    .first<AdminUser>();

  return result || null;
}

/**
 * Get admin user by email
 */
export async function getAdminUserByEmail(
  db: D1Database,
  email: string
): Promise<AdminUser | null> {
  const result = await db
    .prepare('SELECT * FROM admin_users WHERE email = ?')
    .bind(email.toLowerCase().trim())
    .first<AdminUser>();

  return result || null;
}

/**
 * Verify admin login credentials
 */
export async function verifyAdminLogin(
  db: D1Database,
  credentials: LoginCredentials
): Promise<AdminUser | null> {
  const user = await getAdminUserByEmail(db, credentials.email);
  
  if (!user || !user.is_active) {
    return null;
  }

  // Extract hash and salt from password_hash (format: hash:salt)
  const [hash, salt] = user.password_hash.split(':');
  if (!hash || !salt) {
    // Legacy format or invalid hash
    return null;
  }

  const isValid = await verifyPassword(credentials.password, hash, salt);
  if (!isValid) {
    return null;
  }

  // Update last_login_at
  await db
    .prepare('UPDATE admin_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(user.id)
    .run();

  return user;
}

/**
 * Create admin session
 */
export async function createAdminSession(
  db: D1Database,
  adminUserId: number,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<AdminSession> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

  const result = await db
    .prepare(
      `INSERT INTO admin_sessions (id, admin_user_id, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(
      sessionId,
      adminUserId,
      expiresAt.toISOString(),
      ipAddress || null,
      userAgent || null
    )
    .run();

  if (!result.success) {
    throw new Error('Failed to create admin session');
  }

  const session = await getAdminSessionById(db, sessionId);
  if (!session) {
    throw new Error('Failed to retrieve created session');
  }

  return session;
}

/**
 * Get admin session by ID
 */
export async function getAdminSessionById(
  db: D1Database,
  sessionId: string
): Promise<AdminSession | null> {
  const result = await db
    .prepare('SELECT * FROM admin_sessions WHERE id = ? AND expires_at > CURRENT_TIMESTAMP')
    .bind(sessionId)
    .first<AdminSession>();

  return result || null;
}

/**
 * Delete admin session (logout)
 */
export async function deleteAdminSession(
  db: D1Database,
  sessionId: string
): Promise<boolean> {
  const result = await db
    .prepare('DELETE FROM admin_sessions WHERE id = ?')
    .bind(sessionId)
    .run();

  return result.success;
}

/**
 * Delete all expired sessions
 */
export async function cleanupExpiredSessions(db: D1Database): Promise<number> {
  const result = await db
    .prepare('DELETE FROM admin_sessions WHERE expires_at <= CURRENT_TIMESTAMP')
    .run();

  return result.meta.changes || 0;
}

/**
 * Get admin user from session
 */
export async function getAdminUserFromSession(
  db: D1Database,
  sessionId: string
): Promise<AdminUser | null> {
  const session = await getAdminSessionById(db, sessionId);
  if (!session) {
    return null;
  }

  return getAdminUserById(db, session.admin_user_id);
}
