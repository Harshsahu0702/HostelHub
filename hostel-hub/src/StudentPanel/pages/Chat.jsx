import React, { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import { useStudent } from "../../contexts/StudentContext";
import {
  getAdminsForChat,
  getPersonalMessages,
  sendPersonalMessage,
} from "../../services/api";
import socket, {
  joinUserRoom,
} from "../../services/socket";

const Chat = () => {
  const { student } = useStudent() || {};

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedAdminRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const isNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    const threshold = 120;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  };

  const scrollToBottom = (behavior = "auto") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (!student?._id) return;

    joinUserRoom(student._id);

    const handleIncomingMessage = (message) => {
      const currentAdmin = selectedAdminRef.current;
      if (!currentAdmin) return;

      // show only messages related to currently selected admin
      if (
        String(message.senderId) === String(currentAdmin._id) ||
        String(message.receiverId) === String(currentAdmin._id)
      ) {
        const shouldScroll = isNearBottom();
        setMessages((prev) => {
          // prevent duplicate messages
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });

        if (shouldScroll) {
          setTimeout(() => scrollToBottom("smooth"), 0);
        }
      }
    };

    socket.on("personalMessage", handleIncomingMessage);

    return () => {
      socket.off("personalMessage", handleIncomingMessage);
    };
  }, [student]);

  /* ================= LOAD ADMINS ================= */
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const res = await getAdminsForChat();
        const list = res.data || [];
        setAdmins(list);
        if (list.length > 0) {
          setSelectedAdmin(list[0]);
          selectedAdminRef.current = list[0];
        }
      } catch (err) {
        console.error("Failed to load admins", err);
      }
    };

    loadAdmins();
  }, []);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    if (!selectedAdmin) return;

    selectedAdminRef.current = selectedAdmin;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await getPersonalMessages(selectedAdmin._id);
        setMessages(res.data || []);
        setTimeout(() => scrollToBottom("auto"), 0);
      } catch (err) {
        console.error("Failed to load messages", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [selectedAdmin]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedAdmin) return;

    try {
      const text = input;
      setInput("");

      const res = await sendPersonalMessage(selectedAdmin._id, text);

      const created = res?.data;
      if (created?._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === created._id)) return prev;
          return [...prev, created];
        });
        setTimeout(() => scrollToBottom("smooth"), 0);
      }
      // socket will update UI
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div
      className="card"
      style={{
        height: "calc(100vh - 180px)",
        display: "flex",
        padding: 0,
      }}
    >
      {/* ================= LEFT: ADMIN LIST ================= */}
      <div
        style={{
          width: 260,
          borderRight: "1px solid var(--border)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            fontWeight: 700,
            borderBottom: "1px solid var(--border)",
          }}
        >
          Admins
        </div>

        {admins.map((admin) => (
          <div
            key={admin._id}
            onClick={() => setSelectedAdmin(admin)}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              background:
                selectedAdmin?._id === admin._id
                  ? "rgba(79,70,229,0.1)"
                  : "transparent",
              borderLeft:
                selectedAdmin?._id === admin._id
                  ? "4px solid var(--primary)"
                  : "4px solid transparent",
            }}
          >
            <div style={{ fontWeight: 600 }}>{admin.name}</div>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>
              {admin.role || "Admin"}
            </div>
          </div>
        ))}

        {admins.length === 0 && (
          <div style={{ padding: 16, color: "#777" }}>
            No admins found
          </div>
        )}
      </div>

      {/* ================= RIGHT: CHAT ================= */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid var(--border)",
            fontWeight: 700,
          }}
        >
          {selectedAdmin
            ? `Chat with ${selectedAdmin.name}`
            : "Select an Admin"}
        </div>

        {/* MESSAGES */}
        <div
          ref={messagesContainerRef}
          style={{
            flex: 1,
            padding: "20px",
            background: "#f8fafc",
            overflowY: "auto",
          }}
        >
          {loading && <div>Loading chat...</div>}

          {messages.map((m) => {
            const isMe =
              m.senderType === "student" &&
              String(m.senderId) === String(student?._id);

            return (
              <div
                key={m._id}
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    background: isMe ? "var(--primary)" : "#fff",
                    color: isMe ? "#fff" : "#000",
                    borderRadius: 12,
                    maxWidth: "70%",
                  }}
                >
                  <div>{m.text}</div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      marginTop: 4,
                      opacity: 0.7,
                      textAlign: "right",
                    }}
                  >
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}

          {messages.length === 0 && !loading && (
            <div style={{ textAlign: "center", color: "#777" }}>
              No messages yet
            </div>
          )}

          <div ref={messagesEndRef} style={{ height: 1 }} />
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSend}
          style={{
            padding: "16px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 10,
          }}
        >
          <input
            className="form-control"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
