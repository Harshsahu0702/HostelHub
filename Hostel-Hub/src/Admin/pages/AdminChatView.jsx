import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Send } from "lucide-react";

import {
  getAllStudents,
  getPersonalMessages,
  sendPersonalMessage,
} from "../../services/api";

import socket, { joinUserRoom } from "../../services/socket";

/* ---------- MAIN COMPONENT ---------- */

const AdminChatView = ({ adminProfile }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedStudentRef = useRef(null);

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
  }, [adminProfile]);

  /* ---------- FETCH STUDENTS ---------- */

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents();
        if (res.success) {
          setStudents(res.data || []);
          if (res.data && res.data.length > 0) {
            setSelectedStudent(res.data[0]);
          }
        } else {
          setError(res.message || "Failed to fetch students");
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
    const handler = (message) => {
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

    socket.on("personalMessage", handler);
    return () => socket.off("personalMessage", handler);
  }, []);

  /* ---------- FETCH MESSAGES ON STUDENT CHANGE ---------- */

  useEffect(() => {
    if (!selectedStudent) return;

    selectedStudentRef.current = selectedStudent;

    const fetchMessages = async () => {
      try {
        const res = await getPersonalMessages(selectedStudent._id);
        if (res.success) {
          setMessages(res.data || []);
          setTimeout(() => scrollToBottom("auto"), 0);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [selectedStudent]);

  /* ---------- SEND MESSAGE ---------- */

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;

    try {
      const text = newMessage;
      setNewMessage("");

      const res = await sendPersonalMessage(selectedStudent._id, text);
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
      {/* ---------- STUDENT LIST ---------- */}
      <div className="chat-sidebar">
        <div className="chat-search">
          <input
            type="text"
            placeholder="Search student..."
            className="form-input"
          />
        </div>

        <div className="chat-list">
          {students.map((student) => (
            <div
              key={student._id}
              className={`chat-item ${
                selectedStudent?._id === student._id ? "active" : ""
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
      </div>

      {/* ---------- CHAT MAIN ---------- */}
      <div className="chat-main">
        {selectedStudent ? (
          <>
            <div className="chat-header">
              <h3 style={{ fontWeight: 600 }}>
                {selectedStudent.fullName} (
                {selectedStudent.roomAllocated || "No room"})
              </h3>
            </div>

            <div className="chat-messages" ref={messagesContainerRef}>
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${
                      msg.senderType === "admin" ? "sent" : "received"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="msg-time">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--text-secondary)",
                  }}
                >
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
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            Select a student to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatView;
