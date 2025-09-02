import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let connectedContexts = new Map(); // Map of context -> callback

export const connectWebSocket = (userId, context = 'eduSphere', onMessageReceived) => {
  connectedContexts.set(context, onMessageReceived);

  if (stompClient && stompClient.connected) {
    subscribeToContext(userId, context, onMessageReceived);
    return Promise.resolve();
  }

  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found");
      return;
    }

    const socketUrl = `http://13.61.114.153:8081/ws?token=${token}`;
    
    // ✅ Force WebSocket transport
    const socket = new SockJS(socketUrl, null, {
      transports: ['websocket']
    });

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log('✅ WebSocket connected:', frame);
        connectedContexts.forEach((callback, ctx) => {
          subscribeToContext(userId, ctx, callback);
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame);
      }
    });

    stompClient.activate();

  } catch (error) {
    console.error("WebSocket connection failed:", error);
  }
};

const subscribeToContext = (userId, context, onMessageReceived) => {
  if (!stompClient || !stompClient.connected) {
    console.error("Cannot subscribe: WebSocket not connected");
    return;
  }

  const topic = `/topic/messages/${context}/${userId}`;
  
  try {
    const subscription = stompClient.subscribe(topic, (msg) => {
      try {
        const body = JSON.parse(msg.body);
        onMessageReceived(body);
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    });
    
    return subscription;
    
  } catch (error) {
    console.error(`Failed to subscribe to ${context} topic:`, error);
  }
};

export const sendMessage = (message, context = 'eduSphere') => {
  if (!stompClient || !stompClient.connected) {
    console.error("Cannot send message: WebSocket not connected");
    return false;
  }

  try {
    const destination = context === 'eduSphere' 
      ? "/app/chat.sendMessage" 
      : "/app/community.sendMessage";
    
    const messageWithContext = { ...message, context };
    
    stompClient.publish({
      destination: destination,
      body: JSON.stringify(messageWithContext),
    });
    
    return true;
    
  } catch (error) {
    console.error(`Failed to send ${context} message:`, error);
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    connectedContexts.clear();
  }
};

export const isConnected = () => {
  return stompClient && stompClient.connected;
};

export const getConnectionState = () => {
  if (!stompClient) return "DISCONNECTED";
  if (stompClient.connected) return "CONNECTED";
  return "DISCONNECTED";
};