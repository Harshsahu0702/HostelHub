import React, { useEffect, useState } from "react";
import {
  Search,
} from "lucide-react";

import {
  getAllStudents,
  getAvailableRooms,
  autoAllot,
  manualAllot,
  removeAllotment,
} from "../../services/api";

/* ---------- Reusable Components ---------- */

const SectionHeader = ({ title, subtitle }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </div>
);

const Badge = ({ type }) => (
  <span className={`badge ${type}`}>{type}</span>
);

/* ---------- MAIN COMPONENT ---------- */

const RoomAllotmentView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingStudent, setEditingStudent] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");

  const [autoLoading, setAutoLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ---------- FETCH STUDENTS ---------- */

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents();
        if (res.success) setStudents(res.data || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ---------- HANDLERS ---------- */

  const handleManualSave = async (studentId, roomNumber) => {
    try {
      await manualAllot(studentId, roomNumber);
      alert("Room allotted successfully");

      const r = await getAllStudents();
      if (r.success) setStudents(r.data);

      setEditingStudent(null);
      setAvailableRooms([]);
      setSelectedRoomNumber("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Manual allot failed");
    }
  };

  const handleRemoveAllotment = async (studentId) => {
    if (!studentId) return;
    if (!window.confirm("Remove room allotment for this student?")) return;

    setDeleteLoading(true);
    try {
      await removeAllotment(studentId);
      alert("Allotment removed successfully");

      const r = await getAllStudents();
      if (r.success) setStudents(r.data);

      setEditingStudent(null);
      setAvailableRooms([]);
      setSelectedRoomNumber("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Remove allotment failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div>
      <SectionHeader
        title="Room Allotment"
        subtitle="Manage student room assignments"
      />

      <div className="card">
        {/* Filters */}
        <div className="filter-header">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search student..."
              className="search-input"
            />
          </div>

          <button
            className="btn-primary"
            style={{ width: "auto" }}
            disabled={autoLoading}
            onClick={async () => {
              setAutoLoading(true);
              try {
                const res = await autoAllot();
                alert(
                  `Auto-Allot completed. Allotted: ${res.summary.allotted}, Failed: ${res.summary.failed}`
                );

                const r = await getAllStudents();
                if (r.success) setStudents(r.data);
              } catch (err) {
                console.error(err);
                alert(err.message || "Auto allot failed");
              } finally {
                setAutoLoading(false);
              }
            }}
          >
            {autoLoading ? "Processing..." : "Auto-Allot"}
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Room Preference</th>
                <th>Allocated Room</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s._id || s.id}>
                    <td>#{s.rollNumber || s.id}</td>
                    <td style={{ fontWeight: 500 }}>{s.fullName}</td>
                    <td>{s.preferredRoomType || "N/A"}</td>
                    <td className="font-mono">
                      {s.roomAllocated || "-"}
                    </td>
                    <td>
                      <Badge
                        type={s.roomAllocated ? "Allotted" : "Pending"}
                      />
                    </td>
                    <td className="text-right">
                      <button
                        className="action-btn"
                        onClick={async () => {
                          setEditingStudent(s);
                          try {
                            const avail = await getAvailableRooms(
                              s.preferredRoomType
                            );
                            if (avail.success && avail.data.length > 0) {
                              setAvailableRooms(avail.data);
                              setSelectedRoomNumber(
                                avail.data[0]?.roomNumber || ""
                              );
                            } else {
                              alert("No available rooms");
                            }
                          } catch (err) {
                            console.error(err);
                            alert("Failed to fetch available rooms");
                          }
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                    {loading ? "Loading..." : "No students found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------- MANUAL ALLOT MODAL ---------- */}
      {editingStudent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 60,
          }}
        >
          <div
            style={{
              width: 520,
              background: "#fff",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <h3>Assign Room – {editingStudent.fullName}</h3>

            <label className="form-label">
              Available Rooms ({editingStudent.preferredRoomType})
            </label>
            <select
              className="form-input"
              value={selectedRoomNumber}
              onChange={(e) => setSelectedRoomNumber(e.target.value)}
            >
              <option value="">-- Select room --</option>
              {availableRooms.map((r) => (
                <option key={r.roomNumber} value={r.roomNumber}>
                  {r.roomNumber}
                </option>
              ))}
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <button
                className="btn-outline"
                disabled={deleteLoading}
                onClick={() =>
                  handleRemoveAllotment(editingStudent._id || editingStudent.id)
                }
              >
                {deleteLoading ? "Deleting..." : "Delete Allotment"}
              </button>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn-outline"
                  onClick={() => {
                    setEditingStudent(null);
                    setAvailableRooms([]);
                    setSelectedRoomNumber("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn-primary"
                  disabled={!selectedRoomNumber}
                  onClick={() =>
                    handleManualSave(
                      editingStudent._id || editingStudent.id,
                      selectedRoomNumber
                    )
                  }
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAllotmentView;
