import React from "react";
import IssuesComplaints from "../../pages/issues&complaints.jsx";

const SectionHeader = ({ title, subtitle }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </div>
);

const IssuesComplaintsView = ({ hostelId }) => {
  return (
    <div className="content-container">
      <SectionHeader
        title="Issues & Complaints"
        subtitle="View and resolve student issues"
      />

      {/* SAME COMPONENT, SAME PROPS */}
      <IssuesComplaints hostelId={hostelId} />
    </div>
  );
};

export default IssuesComplaintsView;
