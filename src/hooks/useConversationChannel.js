import { useEffect, useRef } from "react";
import Pusher from "pusher-js";

/**
 * Subscribes to a conversation's private channel ("private-conversation.{id}",
 * matching App\Events\ReceiveMessage::broadcastOn on the backend) and calls
 * `onMessage` when a new message lands on it. The broadcast event name is
 * scoped to the viewer's own user id (receive-message.{viewerId}), so this
 * only fires for messages actually addressed to them.
 *
 * No-ops until VITE_PUSHER_KEY is set — until then this is a silent, free
 * pass-through, so callers should still poll as a working baseline.
 */
export function useConversationChannel(conversationId, viewerId, token, onMessage) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const key = import.meta.env.VITE_PUSHER_KEY;
    if (!key || !conversationId || !viewerId || !token) return undefined;

    const authOrigin = new URL(import.meta.env.VITE_BASE_API_V2_URL).origin;

    const pusher = new Pusher(key, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      encrypted: true,
      authEndpoint: `${authOrigin}/broadcasting/auth`,
      auth: {
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const channel = pusher.subscribe(`private-conversation.${conversationId}`);
    channel.bind(`receive-message.${viewerId}`, (payload) => {
      onMessageRef.current?.(payload?.data);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`private-conversation.${conversationId}`);
      pusher.disconnect();
    };
  }, [conversationId, viewerId, token]);
}
