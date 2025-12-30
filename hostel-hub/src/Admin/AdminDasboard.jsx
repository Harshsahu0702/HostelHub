import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  BedDouble,
  UserPlus,
  Shield,
  AlertCircle,
  MessageSquare,
  LogOut,
  ChevronDown,
  Utensils,
  Calendar,
} from "lucide-react";

// 🔹 API
import { getAdminByEmail } from "../services/api";

// 🔹 VIEWS (ALREADY CREATED BY YOU)
import DashboardView from "./pages/DashboardView";
import StudentRegistrationView from "./pages/StudentRegistrationView";
import StudentCredentialsView from "./pages/StudentCredentialsView";
import RoomAllotmentView from "./pages/RoomAllotmentView";
import CreateAdminView from "./pages/CreateAdminView";
import IssuesComplaintsView from "./pages/IssuesComplaintsView";
import AdminChatView from "./pages/AdminChatView";
import DeparturesView from "./pages/DeparturesView";

// 🔹 Mess Views
import MessMenuView from "./pages/Mess/MessMenuView";
import MessReviewsView from "./pages/Mess/MessReviewsView";
import MessFeesView from "./pages/Mess/MessFeesView";
import MessAttendanceView from "./pages/Mess/MessAttendanceView";

// 🔹 CSS
import "./styles/admin.css";

import AttendanceView from "./pages/AttendanceView";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [adminProfile, setAdminProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const profileWrapperRef = useRef(null);

  const loggedInEmail =
    location?.state?.email || localStorage.getItem("adminEmail");

  // 🔹 SAME helper (as before)
  const getCreatedAtFromId = (id) => {
    try {
      if (!id) return "N/A";
      const timestamp = parseInt(id.toString().substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  // 🔹 SAME profile fetch logic
  useEffect(() => {
    if (!loggedInEmail) return;

    let mounted = true;

    const fetchProfile = async () => {
      try {
        const res = await getAdminByEmail(loggedInEmail);
        if (mounted && res?.success) {
          setAdminProfile(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [loggedInEmail]);

  // 🔹 Route protection - redirect if no token or admin email
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminEmail = localStorage.getItem('adminEmail');

    if (!token || !adminEmail) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // 🔹 SAME outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileWrapperRef.current &&
        !profileWrapperRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleSubmenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    navigate('/');
  };

  // 🔹 SAME MENU CONFIG
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "room-allotment", label: "Room Allotment", icon: BedDouble },
    {
      id: "mess-management",
      label: "Mess Management",
      icon: Utensils,
      subItems: [
        { id: "mess-menu", label: "Mess Menu Update" },
        { id: "mess-reviews", label: "Food Reviews & Ratings" },
        { id: "mess-fees", label: "Mess Fee Status" },
        { id: "mess-attendance", label: "Student Attendance" },
      ],
    },
    { id: "registration", label: "Student Registration", icon: UserPlus },
    { id: "credentials", label: "Student Credentials", icon: Shield },
    { id: "issues", label: "Issues & Complaints", icon: AlertCircle },
    { id: "departures", label: "Departure Requests", icon: Calendar },
    { id: "chat", label: "Chat & Notices", icon: MessageSquare },
    { id: "create-admin", label: "Create Admin", icon: UserPlus },
    { id: "attendance", label: "Attendance", icon: Calendar },
  ];

  // 🔹 SAME SWITCH LOGIC (sirf views change hue hain)
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            setActiveTab={setActiveTab}
            adminProfile={adminProfile}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            profileWrapperRef={profileWrapperRef}
            getCreatedAtFromId={getCreatedAtFromId}
          />
        );
      case "room-allotment":
        return <RoomAllotmentView />;
      case "registration":
        return <StudentRegistrationView />;
      case "credentials":
        return <StudentCredentialsView />;
      case "issues":
        return <IssuesComplaintsView hostelId={adminProfile?.hostelId} />;
      case "departures":
        return <DeparturesView hostelId={adminProfile?.hostelId} />;
      case "chat":
        return <AdminChatView adminProfile={adminProfile} />;
      case "mess-menu":
        return <MessMenuView />;
      case "mess-reviews":
        return <MessReviewsView />;
      case "mess-fees":
        return <MessFeesView />;
      case "mess-attendance":
        return <MessAttendanceView />;
      case "create-admin":
        return <CreateAdminView />;
      case "attendance":
        return <AttendanceView adminProfile={adminProfile} />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      <div className="app-container">
        {isSidebarOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <div className="logo-wrapper">
              <Building />
              <span>
                {adminProfile
                  ? `Welcome, ${adminProfile.name}`
                  : "Admin Dashboard"}
              </span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = !!item.subItems;
              const isExpanded = expandedMenus[item.id];
              const isActive =
                activeTab === item.id ||
                (hasSubItems &&
                  item.subItems.some((s) => s.id === activeTab));

              return (
                <div key={item.id}>
                  <button
                    className={`nav-item ${isActive ? "active" : ""} ${hasSubItems ? "nav-item-parent" : ""
                      }`}
                    onClick={() => {
                      if (hasSubItems) toggleSubmenu(item.id);
                      else setActiveTab(item.id);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Icon className="nav-icon" />
                      <span>{item.label}</span>
                    </div>
                    {hasSubItems && (
                      <ChevronDown
                        className={`nav-arrow ${isExpanded ? "rotate" : ""
                          }`}
                      />
                    )}
                  </button>

                  {hasSubItems && (
                    <div className={`submenu ${isExpanded ? "open" : ""}`}>
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          className={`submenu-item ${activeTab === sub.id ? "active" : ""
                            }`}
                          onClick={() => setActiveTab(sub.id)}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <button className="btn-logout" onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-wrapper">
          <main className="content-area">
            <div className="content-container">{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
