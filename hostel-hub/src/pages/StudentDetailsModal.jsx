import React from "react";
import {
  X,
  Mail,
  Phone,
  Building,
  Shield,
  GraduationCap,
  BookOpen,
  User,
  Heart,
  MapPin,
} from "lucide-react";

/* 👉 keep modalStyles exactly as you wrote it */

/**
 * --- MODAL SPECIFIC CSS ---
 */
const modalStyles = `
:root {
  --primary: #4f46e5;
  --primary-dark: #3730a3;
  --primary-light: #eef2ff;
  --bg-main: #f8fafc;
  --white: #ffffff;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  --border: #e2e8f0;
  --danger: #ef4444;
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --radius: 12px;
  --radius-lg: 20px;
}

/* Animations */
@keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes modalSlideUp { 
  from { transform: translateY(20px) scale(0.98); opacity: 0; } 
  to { transform: translateY(0) scale(1); opacity: 1; } 
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
  animation: modalFadeIn 0.25s ease-out;
}

/* Modal Container */
.modal-container {
  background: var(--bg-main);
  width: 100%;
  max-width: 800px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Modal Header */
.modal-header {
  background: var(--white);
  padding: 2rem;
  position: relative;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.modal-close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: var(--bg-main);
  border: 1px solid var(--border);
  color: var(--text-muted);
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}
.modal-close-btn:hover { background: var(--danger); color: white; border-color: var(--danger); }

.modal-avatar {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.profile-summary { display: flex; flex-direction: column; }
.profile-name { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.25rem; }
.profile-meta { font-size: 0.875rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.meta-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--text-light); }

/* Modal Content Grid */
.modal-body {
  padding: 2rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-card {
  background: var(--white);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.info-card.full-width { grid-column: 1 / -1; }

.info-card-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

/* Detail Rows */
.detail-row { display: flex; align-items: flex-start; gap: 0.75rem; }
.detail-icon { color: var(--text-light); margin-top: 0.125rem; flex-shrink: 0; }
.detail-content { display: flex; flex-direction: column; }
.detail-label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.125rem; }
.detail-value { font-size: 0.875rem; font-weight: 600; color: var(--text-main); line-height: 1.4; }

/* Modal Footer */
.modal-footer {
  padding: 1.5rem 2rem;
  background: var(--white);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  border: none;
}
.btn-secondary { background: #f1f5f9; color: var(--text-main); }
.btn-secondary:hover { background: #e2e8f0; }
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-dark); }

.badge { padding: 0.25rem 0.625rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.badge-active { background: #dcfce7; color: #166534; }
.badge-locked { background: #fee2e2; color: #991b1b; }

@media (max-width: 640px) {
  .modal-body { grid-template-columns: 1fr; }
  .modal-header { flex-direction: column; text-align: center; }
  .profile-meta { justify-content: center; }
}
`;

const DetailRow = ({ label, value, icon: Icon }) => (
  <div className="detail-row">
    <div className="detail-icon">{Icon && <Icon size={16} />}</div>
    <div className="detail-content">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || "N/A"}</span>
    </div>
  </div>
);

const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`info-card ${className}`}>
    <h4 className="info-card-title">
      {Icon && <Icon size={14} />}
      {title}
    </h4>
    {children}
  </div>
);

const StudentDetailsModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{modalStyles}</style>

      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <header className="modal-header">
          <div className="modal-avatar">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <div className="profile-summary">
            <h2 className="profile-name">{student.name}</h2>
            <div className="profile-meta">
              <span>{student.rollNumber}</span>
              <span className="meta-dot" />
              <span>{student.year} Year</span>
              <span className="meta-dot" />
              <span className={`badge badge-active`}>
                {student.status}
              </span>
            </div>
          </div>
        </header>

        <div className="modal-body">
          <InfoCard title="Student Information" icon={User}>
            <DetailRow label="Email" value={student.email} icon={Mail} />
            <DetailRow label="Phone" value={student.phone} icon={Phone} />
          </InfoCard>

          <InfoCard title="Hostel Details" icon={Building}>
            <DetailRow label="Room No." value={student.roomNumber} icon={Shield} />
            <DetailRow label="Room Type" value={student.roomType} />
          </InfoCard>

          <InfoCard title="Academic Details" icon={GraduationCap}>
            <DetailRow label="Course" value={student.course} icon={BookOpen} />
            <DetailRow label="Department" value={student.department} />
          </InfoCard>

          <InfoCard title="Guardian Details" icon={Heart}>
            <DetailRow label="Name" value={student.guardianName} icon={User} />
            <DetailRow label="Phone" value={student.guardianPhone} icon={Phone} />
          </InfoCard>

          <InfoCard title="Address" icon={MapPin} className="full-width">
            <DetailRow label="Residential Address" value={student.address} />
          </InfoCard>
        </div>

        <footer className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
