import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";


import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import AntiRagging from "./pages/AntiRagging";
import Mess from "./pages/Mess";
import Departure from "./pages/Departure";
import Fees from "./pages/Fees";
import Chat from "./pages/Chat";
import Feedback from "./pages/Feedback";
import StudentAttendanceView from "./pages/StudentAttendanceView";

import "./styles/global.css";

export default function StudentPanel() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // 🔹 Route protection - redirect if no token or student data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const studentData = localStorage.getItem('studentData');

    if (!token || !studentData) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard setActivePage={setActivePage} />;
      case "complaints": return <Complaints />;
      case "antiragging": return <AntiRagging />;
      case "mess": return <Mess />;
      case "departure": return <Departure />;
      case "fees": return <Fees />;
      case "chat": return <Chat />;
      case "feedback": return <Feedback />;
      case "attendance":
        return <StudentAttendanceView />;
      default: return <Dashboard setActivePage={setActivePage} />;
    }
  };

  const getPageTitle = () =>
    activePage.charAt(0).toUpperCase() +
    activePage.slice(1).replace(/([A-Z])/g, " $1");

  return (
    <div className="app-container">
      {/* Sidebar Overlay - Only visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          // Close sidebar when a menu item is selected on mobile
          if (window.innerWidth <= 768) {
            setSidebarOpen(false);
          }
        }}
        className={sidebarOpen ? 'open' : ''}
      />

      <main className="main-content">
        <Header
          title={getPageTitle()}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
