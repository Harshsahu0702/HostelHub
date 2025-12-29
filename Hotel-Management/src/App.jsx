import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import HostelLoginToggle from "./pages/HostelLoginToggle.jsx";
import PhoneLogin from "./pages/phone.jsx";
import StudentPanel from "./StudentPanel/StudentPanel.jsx";
import { StudentProvider } from './contexts/StudentContext';
import AdminDashboard from "./Admin/AdminDasboard.jsx";
import HostelSetupDashboard from "./pages/HostelSetupDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";

// Component to handle responsive rendering
const ResponsiveLogin = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <PhoneLogin /> : <HostelLoginToggle />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResponsiveLogin />} />

        {/* STUDENT PANEL */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentProvider>
                <StudentPanel />
              </StudentProvider>
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/hostel-setup" element={<HostelSetupDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
