import { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { Send, Circle } from "lucide-react";
import api from "../services/api";

export default function Chat({ teamId }) {
  const [inputMessage, setInputMessage] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [initialMessages, setInitialMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    handleTyping,
  } = useWebSocket(teamId);

  // Load message history (REST)
  useEffect(() => {
    const loadHistory = async () => {
      if (!teamId) return;
      setInitialMessages([]); // reset on team change
      setLoadingHistory(true);

      try {
        const response = await api.get(`/teams/${teamId}/messages`);
        setInitialMessages(response.data || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [teamId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, initialMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;
    sendMessage(inputMessage.trim());
    setInputMessage("");
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    handleTyping();
  };

  // Merge history + live messages, deduplicate by id
  const seen = new Set();
  const allMessages = [...initialMessages, ...messages].filter((m) => {
    const key = m.id ?? m.timestamp; // fallback to timestamp if no id
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Team Chat</h3>
          <div className="flex items-center gap-2 mt-1">
            <Circle
              size={8}
              className={`${isConnected
                ? "fill-emerald-500 text-emerald-500"
                : "fill-gray-400 text-gray-400"
                }`}
            />
            <span className="text-xs text-gray-500">
              {isConnected ? `${onlineUsers.length} online` : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Online Users */}
        <div className="flex -space-x-2">
          {onlineUsers.slice(0, 5).map((user) => (
            <div
              key={user.user_id}
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
              title={user.username}
            >
              {user.username?.charAt(0).toUpperCase()}
            </div>
          ))}
          {onlineUsers.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold border-2 border-white">
              +{onlineUsers.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loadingHistory && (
          <div className="text-center text-sm text-gray-400">
            Loading messages...
          </div>
        )}

        {allMessages.map((msg, index) => {
          const isOwn = msg.user_id === currentUser?.id || msg.userId === currentUser?.id;

          return (
            <div
              key={`msg-${msg.id ?? index}-${msg.timestamp ?? index}`}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}
              >
                {!isOwn && (
                  <span className="text-xs font-semibold text-gray-600 px-3">
                    {msg.username}
                  </span>
                )}

                <div
                  className={`px-4 py-2.5 rounded-2xl ${isOwn
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>

                <span className="text-[10px] text-gray-400 px-3">
                  {msg.timestamp &&
                    new Date(msg.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
            <span className="text-xs text-gray-500">
              {typingUsers.map((u) => u.username).join(", ")}{" "}
              {typingUsers.length === 1 ? "is" : "are"} typing...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSend}
        className="px-6 py-4 border-t border-gray-200"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || !isConnected}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-all disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}