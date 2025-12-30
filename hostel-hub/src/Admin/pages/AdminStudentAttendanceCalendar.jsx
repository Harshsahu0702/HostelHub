import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE = "https://hostelhub-it51.onrender.com/api/attendance";

/* ===============================
   Helpers
=============================== */

const startOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const endOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

const formatDateKey = (date) =>
  date.toISOString().split("T")[0];

/* ===============================
   COMPONENT
=============================== */

const AdminStudentAttendanceCalendar = ({ studentId, onBack }) => {
  const [attendanceMap, setAttendanceMap] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminToken = localStorage.getItem("token");

  /* ===============================
     Fetch Attendance
  =============================== */
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/admin/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        if (res.data.success) {
          const map = {};
          res.data.data.forEach((rec) => {
            map[formatDateKey(new Date(rec.date))] = rec.status;
          });
          setAttendanceMap(map);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          "Failed to load attendance"
        );
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchAttendance();
  }, [studentId, adminToken]);

  /* ===============================
     Calendar Generation
  =============================== */

  const generateCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    const days = [];
    const date = new Date(start);

    while (date <= end) {
      const key = formatDateKey(date);
      days.push({
        date: new Date(date),
        status: attendanceMap[key] || "Absent",
      });
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const days = generateCalendarDays();

  /* ===============================
     UI
  =============================== */

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="attendance-calendar">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <button className="btn-outline" onClick={onBack}>
          ← Back
        </button>

        <h3>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-outline"
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1
                )
              )
            }
          >
            <ChevronLeft size={16} />
          </button>

          <button
            className="btn-outline"
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
        }}
      >
        {days.map(({ date, status }) => (
          <div
            key={formatDateKey(date)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              textAlign: "center",
              background:
                status === "Present" ? "#dcfce7" : "#fee2e2",
              color:
                status === "Present" ? "#166534" : "#991b1b",
              fontWeight: "600",
            }}
            title={status}
          >
            {date.getDate()}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
        <span style={{ color: "#166534" }}>■ Present</span>
        <span style={{ color: "#991b1b" }}>■ Absent</span>
      </div>
    </div>
  );
};

export default AdminStudentAttendanceCalendar;