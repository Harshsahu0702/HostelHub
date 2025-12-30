import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { registerStudent } from "../../services/api";

/* ---------- Reusable Header ---------- */

const SectionHeader = ({ title, subtitle }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */

const StudentRegistrationView = () => {
  // Room types configuration
  const roomTypes = {
    'Single (AC)': { capacity: 1 },
    'Single (Non-AC)': { capacity: 1 },
    'Double (AC)': { capacity: 2 },
    'Double (Non-AC)': { capacity: 2 },
    'Triple (AC)': { capacity: 3 },
    'Triple (Non-AC)': { capacity: 3 },
    'Quadruple (AC)': { capacity: 4 },
    'Quadruple (Non-AC)': { capacity: 4 },
  };

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    phoneNumber: "",
    address: "",
    course: "Computer Science",
    year: "1st Year",
    guardianName: "",
    relationship: "Father",
    guardianEmail: "",
    guardianPhone: "",
    preferredRoomType: "Single (AC)",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    message: "",
  });

  /* ---------- HANDLERS ---------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomTypeChange = (roomType) => {
    setFormData((prev) => ({ ...prev, preferredRoomType: roomType }));
  };

  // Render room type options
  const renderRoomTypeOptions = () => {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
        marginTop: '12px'
      }}>
        {Object.entries(roomTypes).map(([type, { capacity }]) => (
          <button
            key={type}
            type="button"
            onClick={() => handleRoomTypeChange(type)}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: `2px solid ${formData.preferredRoomType === type ? '#4F46E5' : '#e2e8f0'}`,
              backgroundColor: formData.preferredRoomType === type ? '#EEF2FF' : '#ffffff',
              color: formData.preferredRoomType === type ? '#4F46E5' : '#1a202c',
              fontWeight: '500',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span>{type}</span>
            <span style={{
              fontSize: '12px',
              color: formData.preferredRoomType === type ? '#4F46E5' : '#64748b',
              marginTop: '4px'
            }}>
              {capacity} {capacity > 1 ? 'people' : 'person'}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Get available room types based on capacity
  const availableRoomTypes = Object.entries(roomTypes).map(([type, { capacity }]) => ({
    type,
    capacity,
    label: `${type} (${capacity} ${capacity > 1 ? 'people' : 'person'})`
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: "" });

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSubmitStatus({
          success: false,
          message: "Login expired. Please login again.",
        });
        return;
      }

      const decoded = jwtDecode(token);
      const hostelId = decoded?.hostelId;

      if (!hostelId) {
        setSubmitStatus({
          success: false,
          message: "Hostel ID missing. Please login again.",
        });
        return;
      }

      await registerStudent({
        ...formData,
        hostelId,
      });

      setSubmitStatus({
        success: true,
        message: "Student registered successfully!",
      });

      setFormData({
        fullName: "",
        rollNumber: "",
        email: "",
        phoneNumber: "",
        address: "",
        course: "Computer Science",
        year: "1st Year",
        guardianName: "",
        relationship: "Father",
        guardianEmail: "",
        guardianPhone: "",
        preferredRoomType: "Single (AC)",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus({
        success: false,
        message:
          error?.response?.data?.message ||
          "Failed to register student. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="content-container student-registration">
      <SectionHeader
        title="Student Registration"
        subtitle="Register new student to the hostel"
      />

      {submitStatus.message && (
        <div
          className={`alert ${
            submitStatus.success ? "alert-success" : "alert-error"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <div className="card card-padding">
        <form onSubmit={handleSubmit}>
          {/* Student Info */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                className="form-input"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Roll Number *</label>
              <input
                className="form-input"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                className="form-input"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address *</label>
              <textarea
                className="form-input"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course *</label>
              <select
                className="form-select"
                name="course"
                value={formData.course}
                onChange={handleChange}
              >
                <option>Computer Science</option>
                <option>Mechanical Engineering</option>
                <option>Business Administration</option>
                <option>Arts & Literature</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year *</label>
              <select
                className="form-select"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>

          {/* Guardian */}
          <hr />
          <h3>Guardian Information</h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Guardian Name *</label>
              <input
                className="form-input"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Relationship *</label>
              <select
                className="form-select"
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
              >
                <option>Father</option>
                <option>Mother</option>
                <option>Guardian</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Email *</label>
              <input
                className="form-input"
                name="guardianEmail"
                value={formData.guardianEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Phone *</label>
              <input
                className="form-input"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Room Preference */}
          <hr style={{ margin: '24px 0', borderColor: '#e2e8f0' }} />
          <h3 style={{ 
            color: '#1a202c', 
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Room Preference
          </h3>
          {renderRoomTypeOptions()}

          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationView;
