import React, { useEffect, useState } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

import { getAllStudents } from "../../services/api";
import StudentDetailsModal from "../../pages/StudentDetailsModal";
import AdminStudentAttendanceCalendar from "./AdminStudentAttendanceCalendar";

/* ---------- Reusable Header ---------- */

const SectionHeader = ({ title, subtitle }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */

const StudentCredentialsView = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceStudentId, setAttendanceStudentId] = useState(null);

  /* ---------- FETCH STUDENTS ---------- */

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents();
        if (res.success) {
          setStudents(res.data || []);
        } else {
          setError(res.message || "Failed to fetch students");
        }
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Error fetching students. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ---------- SHOW MORE HANDLER ---------- */

  const handleShowMore = (student) => {
    const mappedStudent = {
      ...student,
      name: student.fullName,
      rollNumber: student.rollNumber || student.id || "N/A",
      roomNumber: student.roomAllocated || "N/A",
      roomType: student.preferredRoomType || "N/A",
      email: student.email || "N/A",
      phone: student.phoneNumber || "N/A",
      course: student.course || "N/A",
      year: student.year || "N/A",
      department:
        student.course === "Computer Science" ||
          student.course === "Mechanical Engineering"
          ? "School of Engineering"
          : student.course === "Business Administration"
            ? "School of Business"
            : "Arts & Sciences",
      guardianName: student.guardianName || "N/A",
      guardianPhone: student.guardianPhone || "N/A",
      address: student.address || "N/A",
      status: "Active",
    };

    setSelectedStudent(mappedStudent);
    setIsModalOpen(true);
  };

  const handleViewAttendance = (studentId) => {
    setAttendanceStudentId(studentId);
  };

  /* ---------- LOADING / ERROR STATES ---------- */

  if (isLoading) {
    return (
      <div className="content-container">
        <SectionHeader
          title="Student Credentials"
          subtitle="Loading student information..."
        />
        <div className="card">
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <SectionHeader
          title="Student Credentials"
          subtitle="Error loading student information"
        />
        <div className="card">
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--danger-color)",
            }}
          >
            <AlertCircle size={24} style={{ marginBottom: "1rem" }} />
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
              style={{ marginTop: "1rem" }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (attendanceStudentId) {
    return (
      <AdminStudentAttendanceCalendar
        studentId={attendanceStudentId}
        onBack={() => setAttendanceStudentId(null)}
      />
    );
  }

  /* ---------- UI ---------- */

  return (
    <>
      <SectionHeader
        title="Student Credentials"
        subtitle={`Viewing ${students.length} student${students.length !== 1 ? "s" : ""
          }`}
      />

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room No.</th>
                <th>Student Name</th>
                <th>Guardian Name</th>
                <th>Year</th>
                <th>Course</th>
                <th className="text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id || student.id}>
                    <td style={{ fontWeight: 500 }}>
                      {student.roomAllocated || "N/A"}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {student.fullName}
                    </td>
                    <td>{student.guardianName}</td>
                    <td>{student.year}</td>
                    <td>{student.course}</td>
                    <td className="text-right">
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          className="btn-outline"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            background: "var(--primary-light)",
                            borderColor: "var(--primary-color)",
                            color: "var(--primary-color)",
                          }}
                          onClick={() => handleShowMore(student)}
                        >
                          Show More
                          <ChevronDown size={16} />
                        </button>

                        <button
                          className="btn-outline"
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.75rem",
                            background: "#e0f2fe",
                            borderColor: "#0284c7",
                            color: "#0284c7",
                          }}
                          onClick={() => handleViewAttendance(student._id)}
                        >
                          View Attendance
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No students found. Register a new student to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <StudentDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          student={selectedStudent}
        />
      )}
    </>
  );
};

export default StudentCredentialsView;
