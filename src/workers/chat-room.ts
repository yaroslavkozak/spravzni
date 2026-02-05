/**
 * Chat Room Durable Object
 * 
 * Manages WebSocket connections for a single chat session.
 * Each chat session gets its own Durable Object instance.
 */

import type { Env, DurableObjectState } from '@/types/cloudflare';
import { createChatMessage } from '@/src/lib/chat-database';

export class ChatRoom {
  private state: DurableObjectState;
  private env: Env;
  private sessions: Map<string, WebSocket>;
  private sessionId: string;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
    this.sessions = new Map();
    // Get session ID from the Durable Object's ID
    this.sessionId = state.id.toString();
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Handle WebSocket upgrade - check for Upgrade header
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader === 'websocket') {
      return this.handleWebSocket(request);
    }

    // Handle HTTP requests
    if (request.method === 'GET') {
      return this.handleGet(request);
    }

    if (request.method === 'POST') {
      return this.handlePost(request);
    }

    return new Response('Not found', { status: 404 });
  }

  /**
   * Handle WebSocket upgrade
   */
  private async handleWebSocket(request: Request): Promise<Response> {
    // @ts-ignore - WebSocketPair is a Cloudflare Workers global
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair) as [WebSocket, WebSocket];

    // Accept the WebSocket connection
    this.handleSession(server);

    return new Response(null, {
      status: 101,
      // @ts-ignore - webSocket is a valid property in Cloudflare Workers Response
      webSocket: client,
    });
  }

  /**
   * Handle a new WebSocket session
   */
  private async handleSession(ws: WebSocket): Promise<void> {
    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, ws);

    // Send session info to client
    this.sendToClient(ws, {
      type: 'session',
      sessionId: this.sessionId,
      data: {
        connected: true,
        websocketSessionId: sessionId,
      },
    });

    // Handle incoming messages
    ws.addEventListener('message', async (event) => {
      try {
        const message = JSON.parse(event.data as string);
        await this.handleMessage(ws, message);
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
        this.sendToClient(ws, {
          type: 'error',
          sessionId: this.sessionId,
          data: {
            error: 'Invalid message format',
          },
        });
      }
    });

    // Handle connection close
    ws.addEventListener('close', () => {
      this.sessions.delete(sessionId);
    });

    // Handle errors
    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      this.sessions.delete(sessionId);
    });
  }

  /**
   * Handle incoming WebSocket message
   */
  private async handleMessage(ws: WebSocket, message: any): Promise<void> {
    switch (message.type) {
      case 'ping':
        this.sendToClient(ws, {
          type: 'pong',
          sessionId: this.sessionId,
          data: {},
        });
        break;

      case 'message':
        await this.handleChatMessage(ws, message);
        break;

      case 'join':
        // Client joining the session
        this.sendToClient(ws, {
          type: 'joined',
          sessionId: this.sessionId,
          data: {
            message: 'Joined chat session',
          },
        });
        break;

      default:
        this.sendToClient(ws, {
          type: 'error',
          sessionId: this.sessionId,
          data: {
            error: 'Unknown message type',
          },
        });
    }
  }

  /**
   * Handle a chat message from client
   */
  private async handleChatMessage(ws: WebSocket, message: any): Promise<void> {
    const { text } = message.data || {};

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      this.sendToClient(ws, {
        type: 'error',
        sessionId: this.sessionId,
        data: {
          error: 'Message text is required',
        },
      });
      return;
    }

    // Validate message length
    if (text.length > 1000) {
      this.sendToClient(ws, {
        type: 'error',
        sessionId: this.sessionId,
        data: {
          error: 'Message too long (max 1000 characters)',
        },
      });
      return;
    }

    try {
      // Save message to database
      const messageId = crypto.randomUUID();
      const chatMessage = await createChatMessage(this.env.DB, {
        id: messageId,
        session_id: this.sessionId,
        sender_type: 'user',
        message_text: text.trim(),
      });

      // Send notification to queue for manager alerts
      if (this.env.NOTIFICATIONS_QUEUE && chatMessage.sender_type === 'user') {
        try {
          // Get session info for notification
          const { getChatSession } = await import('@/src/lib/chat-database');
          const session = await getChatSession(this.env.DB, this.sessionId);

          await this.env.NOTIFICATIONS_QUEUE.send({
            type: 'chat-message',
            data: {
              sessionId: this.sessionId,
              messageText: chatMessage.message_text,
              senderType: chatMessage.sender_type,
              userIdentifier: session?.user_identifier || null,
            },
            metadata: {
              timestamp: new Date().toISOString(),
            },
          });
        } catch (error) {
          console.error('Error sending chat notification to queue:', error);
          // Don't fail the message send if notification fails
        }
      }

      // Broadcast to all connected clients in this session
      const broadcastMessage = {
        type: 'message',
        sessionId: this.sessionId,
        data: {
          id: chatMessage.id,
          text: chatMessage.message_text,
          senderType: chatMessage.sender_type,
          timestamp: chatMessage.created_at,
        },
      };

      this.broadcast(broadcastMessage);

      // Send confirmation to sender
      this.sendToClient(ws, {
        type: 'message-sent',
        sessionId: this.sessionId,
        data: {
          id: chatMessage.id,
          timestamp: chatMessage.created_at,
        },
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
      this.sendToClient(ws, {
        type: 'error',
        sessionId: this.sessionId,
        data: {
          error: 'Failed to send message',
        },
      });
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  private broadcast(message: any): void {
    const messageStr = JSON.stringify(message);
    for (const [sessionId, ws] of this.sessions.entries()) {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(messageStr);
        } else {
          // Remove closed connections
          this.sessions.delete(sessionId);
        }
      } catch (error) {
        console.error(`Error broadcasting to session ${sessionId}:`, error);
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * Send message to a specific client
   */
  private sendToClient(ws: WebSocket, message: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message to client:', error);
      }
    }
  }

  /**
   * Handle GET requests (get session info, message history, etc.)
   */
  private async handleGet(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.endsWith('/messages')) {
      // Get message history
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      try {
        const { getChatMessages } = await import('@/src/lib/chat-database');
        const messages = await getChatMessages(this.env.DB, this.sessionId, limit, offset);

        return new Response(
          JSON.stringify({
            success: true,
            messages,
            sessionId: this.sessionId,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to fetch messages',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Get session info
    try {
      const { getChatSession } = await import('@/src/lib/chat-database');
      const session = await getChatSession(this.env.DB, this.sessionId);

      return new Response(
        JSON.stringify({
          success: true,
          session,
          connectedClients: this.sessions.size,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Error fetching session:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to fetch session',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  /**
   * Handle POST requests (send message via HTTP fallback)
   */
  private async handlePost(request: Request): Promise<Response> {
    try {
      const body = await request.json();
      const { text, senderType } = body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Message text is required',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Determine sender type (default to 'user', but allow 'manager' from webhook)
      const messageSenderType = (senderType === 'manager' ? 'manager' : 'user') as 'user' | 'manager';

      // Save message to database
      const messageId = crypto.randomUUID();
      const chatMessage = await createChatMessage(this.env.DB, {
        id: messageId,
        session_id: this.sessionId,
        sender_type: messageSenderType,
        message_text: text.trim(),
      });

      // Send notification to queue for manager alerts
      if (this.env.NOTIFICATIONS_QUEUE && chatMessage.sender_type === 'user') {
        try {
          // Get session info for notification
          const { getChatSession } = await import('@/src/lib/chat-database');
          const session = await getChatSession(this.env.DB, this.sessionId);

          await this.env.NOTIFICATIONS_QUEUE.send({
            type: 'chat-message',
            data: {
              sessionId: this.sessionId,
              messageText: chatMessage.message_text,
              senderType: chatMessage.sender_type,
              userIdentifier: session?.user_identifier || null,
            },
            metadata: {
              timestamp: new Date().toISOString(),
            },
          });
        } catch (error) {
          console.error('Error sending chat notification to queue:', error);
          // Don't fail the message send if notification fails
        }
      }

      // Broadcast to all connected clients
      const broadcastMessage = {
        type: 'message',
        sessionId: this.sessionId,
        data: {
          id: chatMessage.id,
          text: chatMessage.message_text,
          senderType: chatMessage.sender_type,
          timestamp: chatMessage.created_at,
        },
      };

      this.broadcast(broadcastMessage);

      return new Response(
        JSON.stringify({
          success: true,
          message: chatMessage,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      console.error('Error handling POST request:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to process request',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
}
