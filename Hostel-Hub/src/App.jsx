import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import DesktopLogin from "./pages/DesktopLogin";
import PhoneLogin from "./pages/phone.jsx";
import HostelSetupDashboard from "./pages/HostelSetupDashboard.jsx";
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

  return isMobile ? <PhoneLogin /> : <DesktopLogin />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResponsiveLogin />} />

        <Route path="/hostel-setup" element={<HostelSetupDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
