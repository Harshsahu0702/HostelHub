import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Send, Users } from "lucide-react";

import {
  getAllStudents,
  getPersonalMessages,
  sendPersonalMessage,
  getGroupMessages,
  sendGroupMessage,
  getRecentChats,
} from "../../services/api";

import socket, { joinUserRoom, joinHostelRoom } from "../../services/socket";

/* ---------- MAIN COMPONENT ---------- */

const AdminChatView = ({ adminProfile }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatMode, setChatMode] = useState("personal"); // "personal" | "group"

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedStudentRef = useRef(null);
  const chatModeRef = useRef("personal");

  /* ---------- HELPERS ---------- */

  const isNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    const threshold = 120;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
  };

  const scrollToBottom = (behavior = "auto") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ---------- JOIN SOCKET ROOM ---------- */

  useEffect(() => {
    if (adminProfile?._id) {
      joinUserRoom(adminProfile._id);
    }
    const hostelId = adminProfile?.hostelId?._id || adminProfile?.hostelId;
    if (hostelId) {
      joinHostelRoom(hostelId);
    }
  }, [adminProfile]);

  useEffect(() => {
    selectedStudentRef.current = selectedStudent;
    chatModeRef.current = chatMode;
  }, [selectedStudent, chatMode]);

  /* ---------- FETCH STUDENTS & SORT ---------- */

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const [studentsRes, recentRes] = await Promise.all([
          getAllStudents(),
          getRecentChats()
        ]);

        if (studentsRes.success) {
          let allStudents = studentsRes.data || [];
          const recent = recentRes.success ? recentRes.data : []; // [{ _id: studentId, lastMessageAt: ... }]

          // Map of studentId -> lastMessageAt
          const recentMap = {};
          recent.forEach(r => {
            recentMap[r._id] = new Date(r.lastMessageAt).getTime();
          });

          // Sort students: ones with recent messages first
          allStudents.sort((a, b) => {
            const timeA = recentMap[a._id] || 0;
            const timeB = recentMap[b._id] || 0;
            return timeB - timeA; // Descending
          });

          setStudents(allStudents);
          if (allStudents.length > 0) {
            setSelectedStudent(allStudents[0]);
          }
        } else {
          setError(studentsRes.message || "Failed to fetch students");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching students");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ---------- SOCKET LISTENER ---------- */

  useEffect(() => {
    const personalHandler = (message) => {
      if (chatModeRef.current !== "personal") return; // Ignore if in group view

      const currentStudent = selectedStudentRef.current;
      if (!currentStudent) return;

      const shouldScroll = isNearBottom();

      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;

        if (
          String(message.senderId) === String(currentStudent._id) ||
          String(message.receiverId) === String(currentStudent._id)
        ) {
          return [...prev, message];
        }
        return prev;
      });

      if (shouldScroll) {
        setTimeout(() => scrollToBottom("smooth"), 0);
      }
    };

    const groupHandler = (message) => {
      if (chatModeRef.current !== "group") return; // Ignore if in personal view

      const shouldScroll = isNearBottom();
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      if (shouldScroll) {
        setTimeout(() => scrollToBottom("smooth"), 0);
      }
    };

    socket.on("personalMessage", personalHandler);
    socket.on("groupMessage", groupHandler);

    return () => {
      socket.off("personalMessage", personalHandler);
      socket.off("groupMessage", groupHandler);
    };
  }, []);

  /* ---------- FETCH MESSAGES ON CHANGE ---------- */

  useEffect(() => {
    const fetchMessages = async () => {
      setMessages([]); // Clear UI while loading
      try {
        let res;
        if (chatMode === "personal") {
          if (!selectedStudent) return;
          res = await getPersonalMessages(selectedStudent._id);
        } else {
          // Group chat
          res = await getGroupMessages();
        }

        if (res?.success) {
          setMessages(res.data || []);
          setTimeout(() => scrollToBottom("auto"), 0);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [chatMode, selectedStudent]);

  /* ---------- SEND MESSAGE ---------- */

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (chatMode === "personal" && !selectedStudent) return;

    try {
      const text = newMessage;
      setNewMessage("");

      let res;
      if (chatMode === "personal") {
        res = await sendPersonalMessage(selectedStudent._id, text);
      } else {
        res = await sendGroupMessage(text);
      }

      const created = res?.data;

      if (created?._id) {
        setMessages((prev) =>
          prev.some((m) => m._id === created._id)
            ? prev
            : [...prev, created]
        );
        setTimeout(() => scrollToBottom("smooth"), 0);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  /* ---------- LOADING / ERROR ---------- */

  if (isLoading) {
    return (
      <div className="content-container">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--danger-color)" }}>
          <AlertCircle size={24} style={{ marginBottom: "1rem" }} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="chat-container">
      {/* ---------- SIDEBAR ---------- */}
      <div className="chat-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Toggle Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setChatMode("personal")}
            style={{
              flex: 1,
              padding: '1rem',
              background: chatMode === 'personal' ? 'var(--bg-secondary)' : 'transparent',
              border: 'none',
              borderBottom: chatMode === 'personal' ? '2px solid var(--primary-color)' : 'none',
              cursor: 'pointer',
              fontWeight: 600,
              color: chatMode === 'personal' ? 'var(--primary-color)' : 'var(--text-secondary)'
            }}
          >
            Personal
          </button>
          <button
            onClick={() => setChatMode("group")}
            style={{
              flex: 1,
              padding: '1rem',
              background: chatMode === 'group' ? 'var(--bg-secondary)' : 'transparent',
              border: 'none',
              borderBottom: chatMode === 'group' ? '2px solid var(--primary-color)' : 'none',
              cursor: 'pointer',
              fontWeight: 600,
              color: chatMode === 'group' ? 'var(--primary-color)' : 'var(--text-secondary)'
            }}
          >
            Hostel Group
          </button>
        </div>

        {chatMode === "personal" ? (
          <>
            <div className="chat-search">
              <input
                type="text"
                placeholder="Search student..."
                className="form-input"
              />
            </div>
            <div className="chat-list" style={{ flex: 1, overflowY: 'auto' }}>
              {students.map((student) => (
                <div
                  key={student._id}
                  className={`chat-item ${selectedStudent?._id === student._id ? "active" : ""
                    }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="avatar-placeholder">
                    {student.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h5 style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                      {student.fullName}
                    </h5>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      {student.roomAllocated || "No room"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{
              width: '3rem', height: '3rem', background: '#e0f2fe', color: '#0ea5e9',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
            }}>
              <Users size={24} />
            </div>
            <h3>Hostel Group</h3>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Chat with everyone in your hostel. Students and Admins can see these messages.
            </p>
          </div>
        )}
      </div>

      {/* ---------- CHAT MAIN ---------- */}
      <div className="chat-main">
        {chatMode === "personal" && !selectedStudent ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            Select a student to start chatting
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h3 style={{ fontWeight: 600 }}>
                {chatMode === "personal"
                  ? `${selectedStudent?.fullName} (${selectedStudent?.roomAllocated || "No room"})`
                  : "Hostel Group Chat"
                }
              </h3>
            </div>

            <div className="chat-messages" ref={messagesContainerRef}>
              {messages.length > 0 ? (
                messages.map((msg) => {
                  // For group chat, determine if it's "me"
                  // Admin ID check might need adminProfile._id
                  const isMe = String(msg.senderId) === String(adminProfile?._id);

                  return (
                    <div
                      key={msg._id}
                      className={`message ${isMe ? "sent" : "received"}`}
                    >
                      {/* Show sender name for group chat if received */}
                      {chatMode === "group" && !isMe && (
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, marginBottom: 2, color: 'var(--text-secondary)' }}>
                          {msg.senderName || "Unknown"}
                        </div>
                      )}
                      <p>{msg.text}</p>
                      <span className="msg-time">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                  No messages yet. Start a conversation!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <input
                className="form-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="btn-primary"
                style={{ width: "auto" }}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChatView;
