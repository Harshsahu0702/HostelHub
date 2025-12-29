import React, { useState } from "react";
import axios from "axios";
import { QrCode, RefreshCcw, UserCheck } from "lucide-react";
import QRScanner from "../components/QRScanner";

const API_BASE = "http://localhost:5000/api/attendance";

const AttendanceView = ({ adminProfile }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const adminToken = localStorage.getItem("token");

  /* ===============================
     Toggle Attendance Status
  =============================== */
  const handleToggleAttendance = async () => {
    if (!result?.student?.id) return;

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${API_BASE}/toggle`,
        { studentId: result.student.id },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to change attendance status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-view">
      <h2 style={{ marginBottom: "20px" }}>📋 Attendance Management</h2>
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <UserCheck />
          <h3>Today's Attendance Summary</h3>
          <button onClick={fetchTodaySummary} className="btn-icon">
            <RefreshCcw size={16} />
          </button>
        </div>

        {summary ? (
          <div style={{ marginTop: "10px" }}>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(summary.date).toDateString()}
            </p>
            <p>
              <strong>Total Marked:</strong> {summary.totalMarked}
            </p>
            <p style={{ color: "green" }}>
              <strong>Present:</strong> {summary.present}
            </p>
            <p style={{ color: "red" }}>
              <strong>Absent:</strong> {summary.absent}
            </p>
          </div>
        ) : (
          <p style={{ marginTop: "10px" }}>No data loaded</p>
        )}
      </div>
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <QrCode />
          <h3>Scan Student QR</h3>
        </div>

        <div style={{ marginTop: "15px" }}>
          <button
            onClick={() => setShowQRScanner(true)}
            disabled={loading}
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "12px",
            }}
          >
            <QrCode size={20} />
            {loading ? "Processing..." : "Scan Student QR Code"}
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
          )}
        </div>

        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#f4f6ff",
              borderRadius: "6px",
            }}
          >
            <p><strong>Name:</strong> {result.student.name}</p>
            <p><strong>Roll:</strong> {result.student.rollNumber}</p>
            <p>
              <strong>Current Status:</strong>{" "}
              <span
                style={{
                  color:
                    result.status === "Present" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {result.status}
              </span>
            </p>

            <button
              onClick={handleToggleAttendance}
              disabled={loading}
              className="btn-outline"
              style={{ marginTop: "10px" }}
            >
              Change Status
            </button>
          </div>
        )}
      </div>

      {showQRScanner && (
        <QRScanner
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={handleQRScanSuccess}
        />
      )}
    </div>
  );
};

export default AttendanceView;
