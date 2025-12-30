import React, { useEffect, useState, useRef } from "react";
import { Send, Users } from "lucide-react";
import { useStudent } from "../../contexts/StudentContext";
import {
  getAdminsForChat,
  getPersonalMessages,
  sendPersonalMessage,
  getGroupMessages,
  sendGroupMessage,
} from "../../services/api";
import socket, {
  joinUserRoom,
  joinHostelRoom,
} from "../../services/socket";

const Chat = () => {
  const { student } = useStudent() || {};

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [chatMode, setChatMode] = useState("personal"); // "personal" | "group"

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedAdminRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatModeRef = useRef("personal");

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
    if (student.hostelId) {
      joinHostelRoom(student.hostelId);
    }
  }, [student]);

  useEffect(() => {
    selectedAdminRef.current = selectedAdmin;
    chatModeRef.current = chatMode;
  }, [selectedAdmin, chatMode]);

  useEffect(() => {
    const handlePersonalMessage = (message) => {
      if (chatModeRef.current !== 'personal') return;

      const currentAdmin = selectedAdminRef.current;
      if (!currentAdmin) return;

      if (
        String(message.senderId) === String(currentAdmin._id) ||
        String(message.receiverId) === String(currentAdmin._id)
      ) {
        const shouldScroll = isNearBottom();
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
        if (shouldScroll) setTimeout(() => scrollToBottom("smooth"), 0);
      }
    };

    const handleGroupMessage = (message) => {
      if (chatModeRef.current !== 'group') return;

      const shouldScroll = isNearBottom();
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      if (shouldScroll) setTimeout(() => scrollToBottom("smooth"), 0);
    };

    socket.on("personalMessage", handlePersonalMessage);
    socket.on("groupMessage", handleGroupMessage);

    return () => {
      socket.off("personalMessage", handlePersonalMessage);
      socket.off("groupMessage", handleGroupMessage);
    };
  }, []);

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
    const loadMessages = async () => {
      setLoading(true);
      try {
        let res;
        if (chatMode === 'personal') {
          if (!selectedAdmin) {
            setLoading(false);
            return;
          }
          res = await getPersonalMessages(selectedAdmin._id);
        } else {
          // Group Chat
          res = await getGroupMessages();
        }

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
  }, [chatMode, selectedAdmin]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (chatMode === "personal" && !selectedAdmin) return;

    try {
      const text = input;
      setInput("");

      let res;
      if (chatMode === "personal") {
        res = await sendPersonalMessage(selectedAdmin._id, text);
      } else {
        res = await sendGroupMessage(text);
      }

      const created = res?.data;
      if (created?._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === created._id)) return prev;
          return [...prev, created];
        });
        setTimeout(() => scrollToBottom("smooth"), 0);
      }
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
      {/* ================= LEFT: SIDEBAR ================= */}
      <div
        style={{
          width: 260,
          borderRight: "1px solid var(--border)",
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button
            onClick={() => setChatMode("personal")}
            style={{
              flex: 1,
              padding: '12px',
              background: chatMode === 'personal' ? '#f1f5f9' : 'transparent',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              color: chatMode === 'personal' ? 'var(--primary)' : '#64748b'
            }}
          >
            Admins
          </button>
          <button
            onClick={() => setChatMode("group")}
            style={{
              flex: 1,
              padding: '12px',
              background: chatMode === 'group' ? '#f1f5f9' : 'transparent',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              color: chatMode === 'group' ? 'var(--primary)' : '#64748b'
            }}
          >
            Group
          </button>
        </div>

        {chatMode === "personal" ? (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div style={{ padding: "12px 16px", fontWeight: 700, borderBottom: "1px solid var(--border)" }}>
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
        ) : (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', flex: 1 }}>
            <div style={{
              width: '3rem', height: '3rem', background: '#e0f2fe', color: '#0ea5e9',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
            }}>
              <Users size={24} />
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>Hostel Group</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              Official group chat for your hostel.
            </p>
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
          {chatMode === "personal" ? (
            selectedAdmin ? `Chat with ${selectedAdmin.name}` : "Select an Admin"
          ) : (
            "Hostel Group Chat"
          )}
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
            const isMe = String(m.senderId) === String(student?._id);

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
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}
                >
                  {/* Show sender name for group chat if received */}
                  {chatMode === "group" && !isMe && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: 2, color: '#64748b' }}>
                      {m.senderName || "Unknown"}
                    </div>
                  )}
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
        {(chatMode === 'group' || selectedAdmin) ? (
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
        ) : (
          <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
            Select an admin to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
