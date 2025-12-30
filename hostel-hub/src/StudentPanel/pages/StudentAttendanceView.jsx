import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays } from "lucide-react";

const API_BASE = "https://hostelhub-it51.onrender.com/api/attendance";

const StudentAttendanceView = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

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
     Calendar Helpers
  =============================== */
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const getDayStatus = (day) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Normalize checkDate to match API date format usually (start of day)
    // The API returns ISODates. Let's compare comparable strings.
    const checkDateStr = checkDate.toDateString();

    const record = attendance.find(a => new Date(a.date).toDateString() === checkDateStr);
    return record ? record.status : null;
  };

  /* ===============================
     Stats Calculation (Total)
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

  // Calendar Grid Generation
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarCells = [...blanks, ...days];

  return (
    <div className="student-attendance-view">
      <h2 style={{ marginBottom: "20px" }}>
        <CalendarDays style={{ marginRight: '10px' }} /> My Attendance
      </h2>

      {/* ================= STATS ================= */}
      <div className="card" style={{ marginBottom: "24px", display: 'flex', gap: '32px' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Days</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalDays}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Present <span style={{ color: 'green' }}>●</span></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{presentDays}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Absent <span style={{ color: 'red' }}>●</span></div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{absentDays}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Percentage</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: percentage >= 75 ? 'green' : 'orange' }}>{percentage}%</div>
        </div>
      </div>

      {/* ================= CALENDAR ================= */}
      <div className="card">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button className="btn btn-ghost" onClick={() => changeMonth(-1)}>&lt; Prev</button>
          <h3 style={{ margin: 0 }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <button className="btn btn-ghost" onClick={() => changeMonth(1)}>Next &gt;</button>
        </div>

        {/* Days Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{d}</div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
          {calendarCells.map((day, index) => {
            const status = day ? getDayStatus(day) : null;
            return (
              <div
                key={index}
                style={{
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  background: !day ? 'transparent' : (status === 'Present' ? '#dcfce7' : status === 'Absent' ? '#fee2e2' : '#f1f5f9'),
                  color: !day ? 'transparent' : (status === 'Present' ? '#166534' : status === 'Absent' ? '#991b1b' : 'var(--text-main)'),
                  fontWeight: day ? '600' : 'normal',
                  border: day && status ? '1px solid currentColor' : 'none'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceView;
