import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays } from "lucide-react";

const API_BASE = "http://localhost:5000/api/attendance";

const StudentAttendanceView = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentToken = localStorage.getItem("token");

  /* ===============================
     Fetch My Attendance
  =============================== */
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(`${API_BASE}/student/me`, {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
        });

        if (res.data.success) {
          setAttendance(res.data.data);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load attendance"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentToken]);

  /* ===============================
     Stats Calculation
  =============================== */
  const totalDays = attendance.length;
  const presentDays = attendance.filter(
    (a) => a.status === "Present"
  ).length;
  const absentDays = totalDays - presentDays;
  const percentage =
    totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

  if (loading) return <p>Loading attendance...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="student-attendance-view">
      <h2 style={{ marginBottom: "20px" }}>
        <CalendarDays /> My Attendance
      </h2>

      {/* ================= STATS ================= */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <p><strong>Total Days:</strong> {totalDays}</p>
        <p style={{ color: "green" }}>
          <strong>Present:</strong> {presentDays}
        </p>
        <p style={{ color: "red" }}>
          <strong>Absent:</strong> {absentDays}
        </p>
        <p>
          <strong>Attendance %:</strong> {percentage}%
        </p>
      </div>

      {/* ================= CALENDAR LIST ================= */}
      <div className="card">
        <h3>Attendance History</h3>

        {attendance.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              marginTop: "10px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Date</th>
                <th style={{ textAlign: "left" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a._id}>
                  <td>
                    {new Date(a.date).toDateString()}
                  </td>
                  <td
                    style={{
                      color:
                        a.status === "Present" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentAttendanceView;
