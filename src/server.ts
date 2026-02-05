import handler from "@tanstack/react-start/server-entry";
import type { Env, MessageBatch, NotificationMessage } from "@/types/cloudflare";
import notificationsConsumer from './workers/notifications-consumer';
import { ChatRoom } from './workers/chat-room';

export type RequestContext = {
	env: Env;
	waitUntil: (promise: Promise<unknown>) => void;
	passThroughOnException: () => void;
};

declare module "@tanstack/react-start" {
	interface Register {
		server: {
			requestContext: RequestContext;
		};
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		
		// Handle WebSocket upgrades directly (before TanStack Start routing)
		// TanStack Start routing may not properly handle WebSocket upgrades
		if (url.pathname === '/api/chat/ws' && request.headers.get('Upgrade') === 'websocket') {
			try {
				const sessionId = url.searchParams.get('sessionId') || crypto.randomUUID();
				
				if (!env.CHAT_ROOM) {
					return new Response(
						JSON.stringify({ error: 'WebSocket not available - Durable Object not configured' }),
						{ status: 503, headers: { 'Content-Type': 'application/json' } }
					);
				}
				
				// Get or create Durable Object for this session
				const id = env.CHAT_ROOM.idFromName(sessionId);
				const chatRoom = env.CHAT_ROOM.get(id);
				
				// Create a new request URL for the Durable Object
				const doUrl = new URL(request.url);
				doUrl.pathname = '/ws';
				doUrl.search = `?sessionId=${sessionId}`;
				
				// Forward the request to the Durable Object
				return chatRoom.fetch(new Request(doUrl.toString(), {
					method: request.method,
					headers: request.headers,
				}));
			} catch (error) {
				console.error('Error handling WebSocket upgrade:', error);
				return new Response(
					JSON.stringify({ 
						error: 'Failed to establish WebSocket connection',
						details: error instanceof Error ? error.message : 'Unknown error'
					}),
					{ status: 500, headers: { 'Content-Type': 'application/json' } }
				);
			}
		}
		
		// For all other requests, use the TanStack Start handler
		const response = await handler.fetch(request, {
			context: {
				env,
				waitUntil: ctx.waitUntil.bind(ctx),
				passThroughOnException: ctx.passThroughOnException.bind(ctx),
			},
		});

		// Remove Cloudflare Insights script from HTML responses to prevent CORS and SRI errors
		const contentType = response.headers.get('content-type') || '';
		if (contentType.includes('text/html')) {
			// Handle both streaming and non-streaming responses
			if (response.body) {
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				const encoder = new TextEncoder();
				let buffer = '';
				
				const stream = new ReadableStream({
					async start(controller) {
						try {
							while (true) {
								const { done, value } = await reader.read();
								if (done) {
									// Process any remaining buffer
									if (buffer) {
										const cleaned = buffer
											.replace(/<script[^>]*cloudflareinsights\.com[^>]*>[\s\S]*?<\/script>/gi, '')
											.replace(/<script[^>]*beacon\.min\.js[^>]*>[\s\S]*?<\/script>/gi, '')
											.replace(/<script[^>]*cloudflareinsights\.com[^>]*\/>/gi, '')
											.replace(/<script[^>]*beacon\.min\.js[^>]*\/>/gi, '');
										controller.enqueue(encoder.encode(cleaned));
									}
									controller.close();
									break;
								}
								
								buffer += decoder.decode(value, { stream: true });
								
								// Keep last 2000 chars in buffer to catch scripts that span chunks
								if (buffer.length > 2000) {
									// Clean the part we're about to send
									const toProcess = buffer.slice(0, buffer.length - 2000);
									const cleaned = toProcess
										.replace(/<script[^>]*cloudflareinsights\.com[^>]*>[\s\S]*?<\/script>/gi, '')
										.replace(/<script[^>]*beacon\.min\.js[^>]*>[\s\S]*?<\/script>/gi, '')
										.replace(/<script[^>]*cloudflareinsights\.com[^>]*\/>/gi, '')
										.replace(/<script[^>]*beacon\.min\.js[^>]*\/>/gi, '');
									controller.enqueue(encoder.encode(cleaned));
									buffer = buffer.slice(-2000);
								}
							}
						} catch (error) {
							controller.error(error);
						}
					}
				});
				
				return new Response(stream, {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers,
				});
			} else {
				// Non-streaming response
				const html = await response.text();
				const cleanedHtml = html
					.replace(/<script[^>]*cloudflareinsights\.com[^>]*>[\s\S]*?<\/script>/gi, '')
					.replace(/<script[^>]*beacon\.min\.js[^>]*>[\s\S]*?<\/script>/gi, '')
					.replace(/<script[^>]*cloudflareinsights\.com[^>]*\/>/gi, '')
					.replace(/<script[^>]*beacon\.min\.js[^>]*\/>/gi, '');
				
				return new Response(cleanedHtml, {
					status: response.status,
					statusText: response.statusText,
					headers: response.headers,
				});
			}
		}

		return response;
	},
	async queue(batch: MessageBatch<NotificationMessage>, env: Env): Promise<void> {
		// Route queue messages to the appropriate consumer
		// For now, all messages go to notifications consumer
		// In the future, you can add routing logic here
		return notificationsConsumer.queue(batch, env);
	},
};

// Export Durable Objects
export { ChatRoom };
