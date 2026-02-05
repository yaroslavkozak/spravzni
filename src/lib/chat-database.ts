/**
 * Chat Database Helper Functions
 * Functions for working with chat_sessions and chat_messages tables in D1
 */

import type { D1Database } from '../../types/cloudflare';

// ============================================================================
// TYPES
// ============================================================================

export interface ChatSession {
  id: string;
  user_identifier: string | null;
  status: 'active' | 'waiting' | 'closed' | 'queued';
  manager_assigned: string | null;
  user_name: string | null;
  user_email: string | null;
  user_phone: string | null;
  queue_position: number | null;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: 'user' | 'manager';
  message_text: string;
  whatsapp_message_id: string | null;
  created_at: string;
}

export interface CreateChatSessionInput {
  id: string;
  user_identifier?: string | null;
  status?: 'active' | 'waiting' | 'closed' | 'queued';
  manager_assigned?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  user_phone?: string | null;
  queue_position?: number | null;
}

export interface UpdateChatSessionInput {
  status?: 'active' | 'waiting' | 'closed' | 'queued';
  manager_assigned?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  user_phone?: string | null;
  queue_position?: number | null;
}

export interface CreateChatMessageInput {
  id: string;
  session_id: string;
  sender_type: 'user' | 'manager';
  message_text: string;
  whatsapp_message_id?: string | null;
}

// ============================================================================
// SESSION FUNCTIONS
// ============================================================================

/**
 * Create a new chat session
 */
export async function createChatSession(
  db: D1Database,
  input: CreateChatSessionInput
): Promise<ChatSession> {
  const status = input.status || 'active';
  const result = await db
    .prepare(
      `INSERT INTO chat_sessions (id, user_identifier, status, manager_assigned, user_name, user_email, user_phone, queue_position, last_message_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP) RETURNING *`
    )
    .bind(
      input.id,
      input.user_identifier || null,
      status,
      input.manager_assigned || null,
      input.user_name || null,
      input.user_email || null,
      input.user_phone || null,
      input.queue_position || null
    )
    .first<ChatSession>();

  if (!result) {
    throw new Error('Failed to create chat session');
  }

  return result;
}

/**
 * Get a chat session by ID
 */
export async function getChatSession(
  db: D1Database,
  sessionId: string
): Promise<ChatSession | null> {
  const result = await db
    .prepare('SELECT * FROM chat_sessions WHERE id = ?')
    .bind(sessionId)
    .first<ChatSession>();

  return result || null;
}

/**
 * Get or create a chat session for a user identifier
 */
export async function getOrCreateChatSession(
  db: D1Database,
  userIdentifier: string
): Promise<ChatSession> {
  // Try to find existing active session
  const existing = await db
    .prepare(
      `SELECT * FROM chat_sessions 
       WHERE user_identifier = ? AND status = 'active' 
       ORDER BY last_message_at DESC 
       LIMIT 1`
    )
    .bind(userIdentifier)
    .first<ChatSession>();

  if (existing) {
    return existing;
  }

  // Create new session
  const sessionId = crypto.randomUUID();
  return createChatSession(db, {
    id: sessionId,
    user_identifier: userIdentifier,
    status: 'active',
  });
}

/**
 * Update a chat session
 */
export async function updateChatSession(
  db: D1Database,
  sessionId: string,
  input: UpdateChatSessionInput
): Promise<ChatSession | null> {
  const updates: string[] = [];
  const values: unknown[] = [];

  if (input.status !== undefined) {
    updates.push('status = ?');
    values.push(input.status);
  }
  if (input.manager_assigned !== undefined) {
    updates.push('manager_assigned = ?');
    values.push(input.manager_assigned);
  }
  if (input.user_name !== undefined) {
    updates.push('user_name = ?');
    values.push(input.user_name);
  }
  if (input.user_email !== undefined) {
    updates.push('user_email = ?');
    values.push(input.user_email);
  }
  if (input.user_phone !== undefined) {
    updates.push('user_phone = ?');
    values.push(input.user_phone);
  }
  if (input.queue_position !== undefined) {
    updates.push('queue_position = ?');
    values.push(input.queue_position);
  }

  if (input.user_name !== undefined) {
    updates.push('user_name = ?');
    values.push(input.user_name);
  }
  if (input.user_email !== undefined) {
    updates.push('user_email = ?');
    values.push(input.user_email);
  }
  if (input.user_phone !== undefined) {
    updates.push('user_phone = ?');
    values.push(input.user_phone);
  }
  if (input.queue_position !== undefined) {
    updates.push('queue_position = ?');
    values.push(input.queue_position);
  }

  if (updates.length === 0) {
    return getChatSession(db, sessionId);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(sessionId);

  const result = await db
    .prepare(
      `UPDATE chat_sessions SET ${updates.join(', ')} WHERE id = ? RETURNING *`
    )
    .bind(...values)
    .first<ChatSession>();

  return result || null;
}

/**
 * Update session's last message timestamp
 */
export async function updateSessionLastMessage(
  db: D1Database,
  sessionId: string
): Promise<void> {
  await db
    .prepare(
      `UPDATE chat_sessions 
       SET last_message_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`
    )
    .bind(sessionId)
    .run();
}

// ============================================================================
// MESSAGE FUNCTIONS
// ============================================================================

/**
 * Create a new chat message
 */
export async function createChatMessage(
  db: D1Database,
  input: CreateChatMessageInput
): Promise<ChatMessage> {
  const result = await db
    .prepare(
      `INSERT INTO chat_messages (id, session_id, sender_type, message_text, whatsapp_message_id)
       VALUES (?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(
      input.id,
      input.session_id,
      input.sender_type,
      input.message_text,
      input.whatsapp_message_id || null
    )
    .first<ChatMessage>();

  if (!result) {
    throw new Error('Failed to create chat message');
  }

  // Update session's last message timestamp
  await updateSessionLastMessage(db, input.session_id);

  return result;
}

/**
 * Get messages for a session
 */
export async function getChatMessages(
  db: D1Database,
  sessionId: string,
  limit: number = 50,
  offset: number = 0
): Promise<ChatMessage[]> {
  const result = await db
    .prepare(
      `SELECT * FROM chat_messages 
       WHERE session_id = ? 
       ORDER BY created_at ASC 
       LIMIT ? OFFSET ?`
    )
    .bind(sessionId, limit, offset)
    .all<ChatMessage>();

  return result.results;
}

/**
 * Get recent messages for a session (newest first)
 */
export async function getRecentChatMessages(
  db: D1Database,
  sessionId: string,
  limit: number = 50
): Promise<ChatMessage[]> {
  const result = await db
    .prepare(
      `SELECT * FROM chat_messages 
       WHERE session_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`
    )
    .bind(sessionId, limit)
    .all<ChatMessage>();

  // Reverse to get chronological order
  return result.results.reverse();
}

/**
 * Get message count for a session
 */
export async function getChatMessageCount(
  db: D1Database,
  sessionId: string
): Promise<number> {
  const result = await db
    .prepare('SELECT COUNT(*) as count FROM chat_messages WHERE session_id = ?')
    .bind(sessionId)
    .first<{ count: number }>();

  return result?.count || 0;
}

// ============================================================================
// QUEUE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Get count of active chat sessions
 */
export async function getActiveChatCount(
  db: D1Database
): Promise<number> {
  const result = await db
    .prepare('SELECT COUNT(*) as count FROM chat_sessions WHERE status = ?')
    .bind('active')
    .first<{ count: number }>();

  return result?.count || 0;
}

/**
 * Get next user in queue
 */
export async function getNextQueuedUser(
  db: D1Database
): Promise<ChatSession | null> {
  const result = await db
    .prepare(
      `SELECT * FROM chat_sessions 
       WHERE status = 'queued' 
       ORDER BY queue_position ASC, created_at ASC 
       LIMIT 1`
    )
    .first<ChatSession>();

  return result || null;
}

/**
 * Get queue position for a new user
 */
export async function getNextQueuePosition(
  db: D1Database
): Promise<number> {
  const result = await db
    .prepare(
      `SELECT MAX(queue_position) as max_position 
       FROM chat_sessions 
       WHERE status = 'queued'`
    )
    .first<{ max_position: number | null }>();

  return (result?.max_position ?? -1) + 1;
}

/**
 * Update queue positions after a user is moved to active
 */
export async function updateQueuePositions(
  db: D1Database
): Promise<void> {
  // Get all queued sessions ordered by position
  const queued = await db
    .prepare(
      `SELECT id FROM chat_sessions 
       WHERE status = 'queued' 
       ORDER BY queue_position ASC, created_at ASC`
    )
    .all<{ id: string }>();

  // Update positions sequentially
  for (let i = 0; i < queued.results.length; i++) {
    await db
      .prepare('UPDATE chat_sessions SET queue_position = ? WHERE id = ?')
      .bind(i, queued.results[i].id)
      .run();
  }
}

/**
 * Move next queued user to active
 */
export async function activateNextQueuedUser(
  db: D1Database
): Promise<ChatSession | null> {
  const nextUser = await getNextQueuedUser(db);
  
  if (!nextUser) {
    return null;
  }

  // Move to active
  const updated = await updateChatSession(db, nextUser.id, {
    status: 'active',
    queue_position: null,
  });

  // Update remaining queue positions
  await updateQueuePositions(db);

  return updated;
}
