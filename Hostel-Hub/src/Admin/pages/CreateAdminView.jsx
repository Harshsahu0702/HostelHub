import React, { useState } from "react";
import { createAdmin } from "../../services/api";

/* ---------- Reusable Header ---------- */

const SectionHeader = ({ title, subtitle }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </div>
);

/* ---------- MAIN COMPONENT ---------- */

const CreateAdminView = () => {
  const [formData, setFormData] = useState({
    hostelId: localStorage.getItem("hostelId"),
    email: "",
    password: "",
    name: "",
    phone: "",
    role: "Admin",
    authorisation: {
      qrscans: false,
      manageStudents: false,
      manageAdmins: false,
      readStudents: false,
      menuUpdates: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ---------- HANDLERS ---------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      authorisation: {
        ...prev.authorisation,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await createAdmin(formData);
      setMessage("Admin created successfully");

      setFormData({
        hostelId: localStorage.getItem("hostelId"),
        email: "",
        password: "",
        name: "",
        phone: "",
        role: "Admin",
        authorisation: {
          qrscans: false,
          manageStudents: false,
          manageAdmins: false,
          readStudents: false,
          menuUpdates: false,
        },
      });
    } catch (err) {
      setMessage(err.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="content-container">
      <SectionHeader
        title="Create Admin"
        subtitle="Add new hostel administrators"
      />

      {message && (
        <p style={{ marginBottom: "1rem", fontWeight: 500 }}>{message}</p>
      )}

      <div className="card card-padding">
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Admin Name *</label>
              <input
                className="form-input"
                name="name"
                value={formData.name}
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
              <label className="form-label">Password *</label>
              <input
                type="password"
                className="form-input"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                className="form-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role *</label>
              <input
                className="form-input"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* ---------- Authorisations ---------- */}
          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
              Authorisations
            </h3>

            {Object.keys(formData.authorisation).map((key) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={formData.authorisation[key]}
                  onChange={handleCheckboxChange}
                />
                <span>{key}</span>
              </label>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminView;
