import { useEffect, useRef, useState, useCallback } from "react";

// ✅ Use same base URL as api.js, just swap http → ws
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const WS_BASE = API_BASE.replace("https://", "wss://").replace("http://", "ws://");

export const useWebSocket = (teamId) => {
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    const ws = useRef(null);
    const reconnectTimeout = useRef(null);
    const typingTimeout = useRef(null);
    const shouldReconnect = useRef(false);
    const retryCount = useRef(0);
    const MAX_RETRIES = 5;

    const connect = useCallback(() => {
        if (!teamId) return;

        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found in localStorage.");
            return;
        }

        if (
            ws.current &&
            (ws.current.readyState === WebSocket.OPEN ||
                ws.current.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        // ✅ Uses env variable — works for both local and deployed
        const wsUrl = `${WS_BASE}/ws/chat/${teamId}?token=${token}`;
        console.log("Connecting to:", wsUrl);

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WebSocket Connected ✅");
            setIsConnected(true);
            retryCount.current = 0;
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case "message":
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: data.message_id,
                            userId: data.user_id,
                            username: data.username,
                            content: data.content,
                            timestamp: data.timestamp,
                        },
                    ]);
                    break;

                case "online_users":
                    setOnlineUsers(data.users);
                    break;

                case "user_joined":
                    setOnlineUsers((prev) => {
                        if (!prev.find((u) => u.user_id === data.user_id)) {
                            return [...prev, { user_id: data.user_id, username: data.username }];
                        }
                        return prev;
                    });
                    break;

                case "user_left":
                    setOnlineUsers((prev) =>
                        prev.filter((u) => u.user_id !== data.user_id)
                    );
                    break;

                case "typing":
                    if (data.is_typing) {
                        setTypingUsers((prev) => {
                            if (!prev.find((u) => u.user_id === data.user_id)) {
                                return [...prev, { user_id: data.user_id, username: data.username }];
                            }
                            return prev;
                        });
                    } else {
                        setTypingUsers((prev) =>
                            prev.filter((u) => u.user_id !== data.user_id)
                        );
                    }
                    break;

                default:
                    break;
            }
        };

        ws.current.onclose = () => {
            console.log("WebSocket Disconnected");
            setIsConnected(false);

            if (shouldReconnect.current && retryCount.current < MAX_RETRIES) {
                const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
                retryCount.current += 1;
                console.log(`Reconnecting in ${delay}ms (attempt ${retryCount.current}/${MAX_RETRIES})...`);
                reconnectTimeout.current = setTimeout(() => { connect(); }, delay);
            } else if (retryCount.current >= MAX_RETRIES) {
                console.error("Max reconnect attempts reached.");
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };
    }, [teamId]);

    useEffect(() => {
        if (!teamId) return;

        setMessages([]);
        setOnlineUsers([]);
        setTypingUsers([]);
        retryCount.current = 0;
        shouldReconnect.current = true;

        connect();

        return () => {
            shouldReconnect.current = false;
            clearTimeout(reconnectTimeout.current);
            if (ws.current) ws.current.close();
        };
    }, [teamId]);

    const sendMessage = useCallback((content) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "message", content }));
        }
    }, []);

    const sendTypingIndicator = useCallback((isTyping) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "typing", is_typing: isTyping }));
        }
    }, []);

    const handleTyping = useCallback(() => {
        sendTypingIndicator(true);
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => { sendTypingIndicator(false); }, 1000);
    }, [sendTypingIndicator]);

    return { messages, onlineUsers, typingUsers, isConnected, sendMessage, handleTyping };
};