import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export const connectWebSocket = (userId, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("WebSocket connected");

      stompClient.subscribe(`/topic/messages/${userId}`, (msg) => {
        const body = JSON.parse(msg.body);
        console.log("Received Public Topic Message:", body);
        onMessageReceived(body);
      });
    },
  });

  stompClient.activate();
};

export const sendMessage = (message) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message),
    });
  } else {
    console.warn("WebSocket not connected");
  }
};
