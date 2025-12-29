import StudentDetailsModal from "./StudentDetailsModal";

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  LayoutDashboard, 
  Building, 
  BedDouble, 
  UserPlus, 
  Shield, 
  AlertCircle, 
  MessageSquare,
  X, 
  Bell, 
  Search, 
  LogOut,
  CheckCircle,
  Clock,
  Trash2,
  Send,
  Users,
  Utensils,     
  ChevronDown,  
  Star,         
  DollarSign,   
  ClipboardCheck 
} from 'lucide-react';
import { getRoomStats, registerStudent, getAllStudents, createAdmin, getAdminByEmail, getAvailableRooms, autoAllot, manualAllot } from '../services/api';

// --- CSS Styles (Embedded for Single-File Compilation) ---
const cssStyles = `
/* --- Variables & Reset --- */
:root {
  --primary-color: #4f46e5;
  --primary-hover: #4338ca;
  --primary-light: #eef2ff;
  --bg-color: #f9fafb;
  --white: #ffffff;
  --text-main: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --danger-color: #ef4444;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --sidebar-width: 16rem;
  --header-height: 4rem;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-dashboard-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* --- Layout Structure --- */
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

/* Sidebar */
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background-color: var(--white);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 30;
  flex-shrink: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border-color);
  color: var(--primary-color);
  font-size: 1.25rem;
  font-weight: 700;
  flex-shrink: 0;
  position: relative;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.875rem;
  text-align: left;
}

.nav-item:hover {
  background-color: var(--bg-color);
  color: var(--text-main);
}

.nav-item.active {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.nav-item svg.nav-icon {
  margin-right: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
}

/* Submenu Styles */
.nav-item-parent {
  justify-content: space-between;
}

.nav-arrow {
  margin-left: auto;
  transition: transform 0.3s ease;
  width: 1rem;
  height: 1rem;
}

.nav-arrow.rotate {
  transform: rotate(180deg);
}

.submenu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
  margin-left: 1rem;
  border-left: 2px solid var(--border-color);
}

.submenu.open {
  max-height: 500px; /* Arbitrary large height for transition */
}

.submenu-item {
  display: block;
  width: 100%;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s;
}

.submenu-item:hover {
  color: var(--text-main);
  background-color: rgba(0,0,0,0.02);
}

.submenu-item.active {
  color: var(--primary-color);
  font-weight: 600;
  background-color: var(--primary-light);
  border-radius: 0 0.5rem 0.5rem 0;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: var(--danger-color);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.5rem;
  font-weight: 500;
}

.btn-logout:hover {
  background-color: #fef2f2;
}

.btn-logout svg {
  margin-right: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
}

/* Mobile Sidebar Overlay & Behavior */
.mobile-overlay {
  display: none; /* Hide by default on desktop to prevent focus issues */
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 20;
}

.close-sidebar-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: none;
}

/* Main Content Area */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-y: auto;
  margin-left: var(--sidebar-width);
  width: calc(100% - var(--sidebar-width));
  background-color: var(--bg-color);
}

/* Header */
.top-bar {
  height: var(--header-height);
  background-color: var(--white);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  position: fixed;
  top: 0;
  right: 0;
  left: var(--sidebar-width);
  z-index: 20;
  justify-content: flex-end;
}

/* .menu-toggle Removed */

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: auto; /* Pushes content to the right if toggle is missing */
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
}

.badge-dot {
  position: absolute;
  top: 0.375rem;
  right: 0.375rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--danger-color);
  border-radius: 50%;
  border: 2px solid var(--white);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-left: 1.5rem;
  border-left: 1px solid var(--border-color);
}

.user-info {
  text-align: right;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background-color: var(--primary-light);
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.user-profile { cursor: pointer; }

.profile-dropdown {
  position: absolute;
  right: 1.5rem;
  top: calc(var(--header-height) + 0.5rem);
  background: var(--white);
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 24px rgba(16,24,40,0.08);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  min-width: 260px;
  z-index: 60;
}

.profile-row { display: flex; gap: 0.75rem; align-items: center; }
.profile-label { color: var(--text-secondary); font-size: 0.75rem; }
.profile-value { color: var(--text-main); font-weight: 600; font-size: 0.875rem; }

/* Content Area */
.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: var(--bg-color);
  min-height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
}

/* --- Common UI Components --- */

.section-header {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.card {
  background-color: var(--white);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.card-padding {
  padding: 1.5rem;
}

/* Grids */
.grid-2 { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }
.grid-4 { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }

@media (min-width: 768px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
  
  .grid-3-sidebar {
    grid-template-columns: 1fr 2fr;
  }
}

/* Stat Cards */
.stat-card {
  background-color: var(--white);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.stat-content { flex: 1; }
.stat-label { font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: var(--text-main); margin-top: 0.25rem; }

.stat-icon-wrapper {
  padding: 0.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-wrapper svg { width: 1.5rem; height: 1.5rem; }

.text-blue { color: #3b82f6; } .bg-blue-light { background-color: #eff6ff; }
.text-green { color: #10b981; } .bg-green-light { background-color: #ecfdf5; }
.text-orange { color: #f97316; } .bg-orange-light { background-color: #fff7ed; }
.text-indigo { color: #6366f1; } .bg-indigo-light { background-color: #eef2ff; }
.text-red { color: #ef4444; } .bg-red-light { background-color: #fef2f2; }
.text-yellow { color: #eab308; } .bg-yellow-light { background-color: #fefce8; }

.badge {
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}
.badge.Allotted, .badge.Resolved, .badge.Paid, .badge.Present { background-color: #dcfce7; color: #166534; }
.badge.Pending, .badge.Breakfast { background-color: #fef9c3; color: #854d0e; }
.badge.Active, .badge.Lunch { background-color: #dbeafe; color: #1e40af; }
.badge.Locked, .badge.Open, .badge.Due, .badge.Absent, .badge.Dinner { background-color: #fee2e2; color: #991b1b; }

.table-responsive { width: 100%; overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem; }
.data-table th { background-color: #f9fafb; color: var(--text-secondary); font-weight: 600; padding: 0.75rem 1.5rem; }
.data-table td { padding: 0.75rem 1.5rem; border-top: 1px solid var(--border-color); color: var(--text-main); }
.data-table tr:hover { background-color: #f9fafb; }
.text-right { text-align: right; }
.font-mono { font-family: monospace; }
.action-btn { color: var(--primary-color); background: none; border: none; font-weight: 500; cursor: pointer; font-size: 0.875rem; }
.action-btn:hover { text-decoration: underline; }

.form-group { margin-bottom: 1rem; }
.form-label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-main); margin-bottom: 0.25rem; }
.form-input, .form-select {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  background-color: var(--white);
  color: #000000; /* Force black text color */
}
.form-input:focus, .form-select:focus { border-color: var(--primary-color); box-shadow: 0 0 0 2px var(--primary-light); }
.btn-primary {
  width: 100%;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
}
.btn-primary:hover { background-color: var(--primary-hover); }

.filter-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.search-wrapper { position: relative; width: 250px; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--text-secondary); }
.search-input { width: 100%; padding: 0.5rem 1rem 0.5rem 2.25rem; border: 1px solid var(--border-color); border-radius: 0.5rem; outline: none; }
.btn-group { display: flex; gap: 0.5rem; }
.btn-outline { background: var(--white); border: 1px solid var(--border-color); color: var(--text-main); padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem; font-weight: 500; }

.issue-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background: var(--white);
  margin-bottom: 1rem;
}
.issue-content { display: flex; gap: 1rem; }
.issue-details h4 { font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }
.issue-meta { font-size: 0.75rem; color: #9ca3af; margin-top: 0.5rem; }
.btn-success { background-color: var(--success-color); color: var(--white); padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-size: 0.875rem; font-weight: 500; }

.chat-container { height: calc(100vh - 140px); display: flex; border: 1px solid var(--border-color); border-radius: 0.75rem; background: var(--white); overflow: hidden; }
.chat-sidebar { width: 33%; border-right: 1px solid var(--border-color); display: flex; flex-direction: column; }
.chat-main { flex: 1; display: flex; flex-direction: column; }
.chat-search { padding: 1rem; border-bottom: 1px solid var(--border-color); }
.chat-list { flex: 1; overflow-y: auto; }
.chat-item { padding: 1rem; display: flex; gap: 0.75rem; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f3f4f6; }
.chat-item:hover, .chat-item.active { background-color: #f9fafb; }
.chat-item.active { border-left: 3px solid var(--primary-color); }
.avatar-placeholder { width: 2.5rem; height: 2.5rem; background-color: #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--text-secondary); font-size: 0.75rem; }
.chat-header { padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
.chat-messages { flex: 1; padding: 1.5rem; overflow-y: auto; background-color: #f9fafb; display: flex; flex-direction: column; gap: 1rem; }
.message { max-width: 70%; padding: 0.5rem 1rem; border-radius: 0.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.message.sent { align-self: flex-end; background-color: var(--primary-color); color: var(--white); border-bottom-right-radius: 0; }
.message.received { align-self: flex-start; background-color: var(--white); color: var(--text-main); border-bottom-left-radius: 0; }
.msg-time { display: block; font-size: 0.625rem; margin-top: 0.25rem; text-align: right; opacity: 0.8; }
.chat-input-area { padding: 1rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem; }

/* --- Graph & Mess Styles --- */
.graph-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.bar-graph-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.bar-label {
  width: 120px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
.bar-track {
  flex: 1;
  height: 1.5rem;
  background-color: #eef2ff;
  border-radius: 0.25rem;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 600;
  transition: width 0.5s ease-out;
}
.summary-card {
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--white);
  text-align: center;
}
.summary-count {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.text-success { color: var(--success-color); }
.text-danger { color: var(--danger-color); }

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 25;
  }
  .main-wrapper {
    margin-left: 0;
    width: 100%;
  }
  .top-bar {
    left: 0;
  }
}  
  .user-info { display: none; }
  .grid-3-sidebar { grid-template-columns: 1fr; }
  .chat-container { flex-direction: column; height: auto; }
  .chat-sidebar { width: 100%; height: 200px; border-right: none; border-bottom: 1px solid var(--border-color); }
}

`;

// --- Sub Components ---

const StatCard = ({ title, value, colorClass, icon: Icon }) => (
  <div className="stat-card">
    <div className="stat-content">
      <p className="stat-label">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
    <div className={`stat-icon-wrapper ${colorClass}`}>
      {Icon && <Icon />}
    </div>
  </div>
);
const SectionHeader = ({ title, subtitle }) => (
  <div className="section-header">
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </div>
);
const Badge = ({ type }) => (
  <span className={`badge ${type}`}>
    {type}
  </span>
);
// --- Views ---

const DashboardView = ({ setActiveTab }) => {
  const [stats, setStats] = useState([
    { title: 'Total Students', value: '0', colorClass: 'text-blue bg-blue-light', icon: Users },
    { title: 'Rooms Occupied', value: '0 / 0', colorClass: 'text-green bg-green-light', icon: BedDouble },
    { title: 'Pending Issues', value: '0', colorClass: 'text-orange bg-orange-light', icon: AlertCircle },
    { title: 'New Messages', value: '0', colorClass: 'text-indigo bg-indigo-light', icon: MessageSquare },
  ]);
  const [recentAllocations, setRecentAllocations] = useState([]);
  const [pendingIssues, setPendingIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomStats, studentsRes, issuesRes] = await Promise.all([
          getRoomStats().catch(() => ({ occupiedRooms: 0, totalRooms: 0 })),
          getAllStudents().catch(() => ({ success: false, data: [] })),
          axios.get('http://localhost:5000/api/issues').catch(() => ({ data: [] }))
        ]);

        const students = studentsRes.success ? studentsRes.data : [];
        const issues = issuesRes.data || [];
        const openIssues = issues.filter(i => i.status === 'Open');

        setStats([
          { title: 'Total Students', value: students.length.toString(), colorClass: 'text-blue bg-blue-light', icon: Users },
          { title: 'Rooms Occupied', value: `${roomStats.occupiedRooms || 0} / ${roomStats.totalRooms || 0}`, colorClass: 'text-green bg-green-light', icon: BedDouble },
          { title: 'Pending Issues', value: openIssues.length.toString(), colorClass: 'text-orange bg-orange-light', icon: AlertCircle },
          { title: 'New Messages', value: '5', colorClass: 'text-indigo bg-indigo-light', icon: MessageSquare },
        ]);

        setRecentAllocations(students.slice(0, 5).map(s => ({
          id: s._id || s.id,
          name: s.fullName,
          room: s.roomAllocated || '-',
          status: s.roomAllocated ? 'Allotted' : 'Pending'
        })));

        setPendingIssues(openIssues.slice(0, 3).map(i => ({
            id: i._id || i.id,
            type: i.type || 'General',
            desc: i.description || i.desc || 'No description',
            room: i.roomNumber || i.room || 'N/A',
            status: i.status
        })));

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <SectionHeader title="Dashboard" subtitle="Overview of hostel activities" />
        <button 
          onClick={() => setActiveTab('registration')}
          style={{
            background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)';
          }}
        >
          <UserPlus size={20} />
          <span>Register New Student</span>
          <span style={{
            position: 'absolute',
            background: 'rgba(255, 255, 255, 0.2)',
            width: '100px',
            height: '100%',
            left: '-120%',
            top: 0,
            transform: 'skewX(-15deg)',
            transition: '0.5s',
            pointerEvents: 'none'
          }} className="shine"></span>
        </button>
      </div>
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, idx) => (
          <StatCard 
            key={idx}
            title={stat.title}
            value={stat.value}
            colorClass={stat.colorClass}
            icon={stat.icon}
          />
        ))}
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-padding" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontWeight: 600 }}>Recent Allocations</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAllocations.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.room}</td>
                    <td><Badge type={item.status} /></td>
                  </tr>
                ))}
                {recentAllocations.length === 0 && (
                  <tr><td colSpan="3" style={{textAlign: 'center', padding: '1rem'}}>No recent allocations</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-padding" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontWeight: 600 }}>Pending Issues</h3>
          </div>
          <div className="card-padding" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingIssues.map((issue) => (
              <div key={issue.id} style={{ display: 'flex', gap: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fee2e2' }}>
                <AlertCircle style={{ color: '#ef4444', width: '1.25rem', height: '1.25rem', marginTop: '0.125rem' }} />
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>{issue.type} Issue</h4>
                  <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.25rem' }}>{issue.desc} - Room {issue.room}</p>
                </div>
              </div>
            ))}
            {pendingIssues.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No pending issues.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const RoomAllotmentView = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoLoading, setAutoLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAllStudents();
        if (response.success) {
          setStudents(response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleManualSave = async (studentId, roomNumber) => {
    try {
      await manualAllot(studentId, roomNumber);
      alert('Room allotted successfully');
      // refresh students
      const r = await getAllStudents();
      if (r.success) setStudents(r.data);
      setEditingStudent(null);
      setAvailableRooms([]);
      setSelectedRoomNumber('');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Manual allot failed');
    }
  };

  const handleRemoveAllAllotments = async () => {
    if (!window.confirm('Are you sure you want to remove all room allotments? This action cannot be undone.')) {
      return;
    }

    try {
      setIsRemoving(true);
      const response = await axios.post(`${API_BASE_URL}/admin/remove-all-allotments`);
      if (response.data.success) {
        alert('All room allotments have been removed successfully');
        // Refresh the students list
        const r = await getAllStudents();
        if (r.success) setStudents(r.data);
      } else {
        throw new Error(response.data.message || 'Failed to remove all allotments');
      }
    } catch (err) {
      console.error('Error removing all allotments:', err);
      alert(err.message || 'Failed to remove all allotments');
    } finally {
      setIsRemoving(false);
    }
  };


  return (
  <div>
    <SectionHeader title="Room Allotment" subtitle="Manage student room assignments" />
    
    <div className="card">
      <div className="filter-header">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input type="text" placeholder="Search student..." className="search-input" />
        </div>
        <div className="btn-group" style={{ gap: '0.5rem' }}>
          <button 
            className="btn-outline" 
            style={{ background: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' }}
            onClick={handleRemoveAllAllotments}
            disabled={isRemoving}
          >
            {isRemoving ? 'Removing...' : 'Remove All Allotments'}
          </button>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={async () => {
            setAutoLoading(true);
            try {
              const res = await autoAllot();
              // show summary and optional details count
              alert(`Auto-Allot completed. Allotted: ${res.summary.allotted}, Failed: ${res.summary.failed}`);
              if (res.details && res.details.length > 0) {
                console.debug('Auto-Allot details:', res.details.slice(0, 20));
              }
              // refresh students list
              const r = await getAllStudents();
              if (r.success) setStudents(r.data);
            } catch (err) {
              console.error(err);
              alert(err.message || 'Auto allot failed');
            } finally {
              setAutoLoading(false);
            }
          }} disabled={autoLoading}>{autoLoading ? 'Processing...' : 'Auto-Allot'}</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Room Type Pref</th>
              <th>Allocated Room</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
                {students.map((item) => (
              <tr key={item._id || item.id}>
                <td style={{ color: 'var(--text-secondary)' }}>#{item.rollNumber || item.id}</td>
                <td style={{ fontWeight: 500 }}>{item.fullName}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{item.preferredRoomType || 'N/A'}</td>
                <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>{item.roomAllocated || '-'}</td>
                <td><Badge type={item.roomAllocated ? 'Allotted' : 'Pending'} /></td>
                <td className="text-right">
                  <button className="action-btn" onClick={async () => {
                    setEditingStudent(item);
                    try {
                      const avail = await getAvailableRooms(item.preferredRoomType);
                      if (avail.success) {
                        if (avail.data && avail.data.length > 0) {
                          setAvailableRooms(avail.data);
                          setSelectedRoomNumber(avail.data[0]?.roomNumber || '');
                        } else {
                          // no rooms matching pref, fetch any available rooms as fallback
                          const any = await getAvailableRooms();
                          if (any.success && any.data && any.data.length > 0) {
                            setAvailableRooms(any.data);
                            setSelectedRoomNumber(any.data[0]?.roomNumber || '');
                          } else {
                            setAvailableRooms([]);
                            setSelectedRoomNumber('');
                            alert('No available rooms for this student');
                          }
                        }
                      }
                    } catch (err) {
                      console.error(err);
                      alert('Failed to fetch available rooms');
                    }
                  }}>Edit</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && !loading && (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '1rem'}}>No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
      {/* Manual Allot Modal */}
      {editingStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ width: 520, background: 'white', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Assign Room - {editingStudent.fullName}</h3>
              <button className="action-btn" onClick={() => { setEditingStudent(null); setAvailableRooms([]); setSelectedRoomNumber(''); }}>Close</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <label className="form-label">Available Rooms (Preference: {editingStudent.preferredRoomType})</label>
              <select className="form-input" value={selectedRoomNumber} onChange={(e) => setSelectedRoomNumber(e.target.value)}>
                <option value="">-- Select room --</option>
                {availableRooms.map(r => (
                  <option key={r.roomNumber} value={r.roomNumber}>{r.roomNumber}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button className="btn-outline" onClick={() => { setEditingStudent(null); setAvailableRooms([]); setSelectedRoomNumber(''); }}>Cancel</button>
              <button className="btn-primary" onClick={() => handleManualSave(editingStudent._id || editingStudent.id, selectedRoomNumber)} disabled={!selectedRoomNumber}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

//create admin
const CreateAdminView = () => {
  const [formData, setFormData] = useState({
    hostelId: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'Admin',
    authorisation: {
      qrscans: false,
      manageStudents: false,
      manageAdmins: false,
      readStudents: false,
      menuUpdates: false,
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      authorisation: {
        ...prev.authorisation,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await createAdmin(formData);
      setMessage('Admin created successfully');

      setFormData({
        hostelId: '',
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'Admin',
        authorisation: {
          qrscans: false,
          manageStudents: false,
          manageAdmins: false,
          readStudents: false,
          menuUpdates: false,
        }
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-container">
      <SectionHeader title="Create Admin" subtitle="Add new hostel administrators" />

      {message && <p style={{ marginBottom: '1rem' }}>{message}</p>}

      <div className="card card-padding">
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Hostel ID *</label>
              <input
                className="form-input"
                name="hostelId"
                value={formData.hostelId}
                onChange={handleChange}
                required
              />
            </div>

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

          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
              Authorisations
            </h3>

            {Object.keys(formData.authorisation).map((key) => (
              <label
                key={key}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}
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

          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentRegistrationView = () => {
  const [formData, setFormData] = useState({
    // Student Information
    fullName: '',
    rollNumber: '',
    email: '',
    phoneNumber: '',
    address: '',
    course: 'Computer Science', // Default value
    year: '1st Year', // Default value
    // Guardian Information
    guardianName: '',
    relationship: 'Father', // Default value
    guardianEmail: '',
    guardianPhone: '',
    // Hostel Preference
    preferredRoomType: 'Single (AC)' // Default value
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoomTypeChange = (roomType) => {
    setFormData(prev => ({
      ...prev,
      preferredRoomType: roomType
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const response = await registerStudent(formData);
      setSubmitStatus({
        success: true,
        message: 'Student registered successfully!'
      });
      // Reset form after successful submission
      setFormData({
        fullName: '',
        rollNumber: '',
        email: '',
        phoneNumber: '',
        address: '',
        course: 'Computer Science',
        year: '1st Year',
        guardianName: '',
        relationship: 'Father',
        guardianEmail: '',
        guardianPhone: '',
        preferredRoomType: 'Single (AC)'
      });
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to register student. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content-container">
      <SectionHeader title="Student Registration" subtitle="Register new student to the hostel" />
      
      {submitStatus.message && (
        <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-error'}`}>
          {submitStatus.message}
        </div>
      )}

      <div className="card card-padding">
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
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
                type="text"
                className="form-input"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
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
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Residential Address *</label>
              <textarea
                className="form-input"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                required
                style={{ minHeight: '80px' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Course *</label>
              <select
                className="form-select"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Arts & Literature">Arts & Literature</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year *</label>
              <select
                className="form-select"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Guardian Information</h3>
            <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Guardian's Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Relationship with Student *</label>
                <select
                  className="form-select"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Hostel Preference</h3>
            <label className="form-label">Preferred Room Type *</label>
            <div className="grid-3" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              {[
                'Single (AC)',
                'Single (Non-AC)',
                'Double (AC)',
                'Double (Non-AC)',
                'Triple (AC)',
                'Triple (Non-AC)',
                'Quadruple (AC)',
                'Quadruple (Non-AC)'
              ].map((opt) => (
                <label
                  key={opt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: formData.preferredRoomType === opt ? 'var(--primary-light)' : 'transparent',
                    borderColor: formData.preferredRoomType === opt ? 'var(--primary-color)' : 'var(--border-color)'
                  }}
                >
                  <input
                    type="radio"
                    name="preference"
                    checked={formData.preferredRoomType === opt}
                    onChange={() => handleRoomTypeChange(opt)}
                    style={{ accentColor: 'var(--primary-color)' }}
                  />
                  <span style={{ fontSize: '0.875rem' }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                // Reset form
                setFormData({
                  fullName: '',
                  rollNumber: '',
                  email: '',
                  phoneNumber: '',
                  course: 'Computer Science',
                  year: '1st Year',
                  guardianName: '',
                  relationship: 'Father',
                  guardianEmail: '',
                  guardianPhone: '',
                  preferredRoomType: 'Single (AC)'
                });
                setSubmitStatus({ success: null, message: '' });
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: 'auto' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentCredentialsView = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students when component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAllStudents();
        if (response.success) {
          setStudents(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch students');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Error fetching students. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleShowMore = (student) => {
    console.log('Student data:', student); // Debug log
    
    const studentDetails = {
      ...student,
      name: student.fullName || `${student.firstName || ''} ${student.lastName || ''}`.trim(),
      rollNumber: student.rollNumber || student.id || 'N/A',
      roomNumber: student.roomAllocated || 'N/A',
      roomType: student.preferredRoomType || 'N/A',
      email: student.email || `${student.fullName?.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
      phone: student.phoneNumber || student.phone || 'N/A',
      course: student.course || 'N/A',
      year: student.year || 'N/A',
      department: 'School of ' + (
        student.course === 'Computer Science' || student.course === 'Mechanical Engineering' ? 'Engineering' : 
        student.course === 'Business Administration' ? 'Business' : 'Arts & Sciences'
      ),
      guardianName: student.guardianName || 'N/A',
      guardianPhone: student.guardianPhone || 'N/A',
      address: student.address || 'N/A',
      status: 'Active'
    };
    
    console.log('Mapped student details:', studentDetails); // Debug log
    setSelectedStudent(studentDetails);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="content-container">
        <SectionHeader title="Student Credentials" subtitle="Loading student information..." />
        <div className="card">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <SectionHeader title="Student Credentials" subtitle="Error loading student information" />
        <div className="card">
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger-color)' }}>
            <AlertCircle size={24} style={{ marginBottom: '1rem' }} />
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionHeader 
        title="Student Credentials" 
        subtitle={`Viewing ${students.length} student${students.length !== 1 ? 's' : ''}`} 
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
                    <td style={{ fontWeight: 500 }}>{student.roomAllocated || 'N/A'}</td>
                    <td style={{ fontWeight: 500 }}>{student.fullName}</td>
                    <td>{student.guardianName}</td>
                    <td>{student.year}</td>
                    <td>{student.course}</td>
                    <td className="text-right">
                      <button 
                        onClick={() => handleShowMore(student)}
                        className="btn-outline"
                        style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.25rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginLeft: 'auto',
                          background: 'var(--primary-light)',
                          borderColor: 'var(--primary-color)',
                          color: 'var(--primary-color)'
                        }}
                      >
                        Show More
                        <ChevronDown size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
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
const IssuesView = () => (
  <div>
    <SectionHeader title="Issues & Complaints" subtitle="Track and resolve student complaints" />
    
    <div>
      {MOCK_ISSUES.map((issue) => (
        <div key={issue.id} className="issue-card">
          <div className="issue-content">
            <div className={`stat-icon-wrapper ${issue.status === 'Resolved' ? 'text-green bg-green-light' : 'text-red bg-red-light'}`}>
              {issue.status === 'Resolved' ? <CheckCircle /> : <AlertCircle />}
            </div>
            <div className="issue-details">
              <div>
                <h4>
                  {issue.type} Issue
                  <Badge type={issue.status} />
                </h4>
                <p style={{ color: 'var(--text-secondary)' }}>{issue.desc}</p>
                <p className="issue-meta">Reported by {issue.student} (Room {issue.room}) • 2 days ago</p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {issue.status !== 'Resolved' && (
              <button className="btn-success">
                Mark Resolved
              </button>
            )}
            <button className="btn-outline">
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChatView = () => (
  <div className="chat-container">
    {/* Sidebar List */}
    <div className="chat-sidebar">
      <div className="chat-search">
        <input type="text" placeholder="Search student..." className="form-input" style={{ backgroundColor: '#f9fafb' }} />
      </div>
      <div className="chat-list">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`chat-item ${i === 1 ? 'active' : ''}`}>
            <div className="avatar-placeholder">
              ST
            </div>
            <div>
              <h5 style={{ fontWeight: 500, fontSize: '0.875rem' }}>Student Name</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>Latest message preview...</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Message Area */}
    <div className="chat-main">
      <div className="chat-header">
        <h3 style={{ fontWeight: 600 }}>John Doe (Room A-101)</h3>
        <button className="action-btn" style={{ color: 'var(--text-secondary)' }}><AlertCircle /></button>
      </div>
      
      <div className="chat-messages">
        {MOCK_CHATS.map((msg) => (
          <div key={msg.id} className={`message ${msg.isMe ? 'sent' : 'received'}`}>
            <p style={{ fontSize: '0.875rem' }}>{msg.text}</p>
            <span className="msg-time" style={{ color: msg.isMe ? '#e0e7ff' : '#9ca3af' }}>
              {msg.time}
            </span>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="form-input"
          style={{ flex: 1 }}
        />
        <button className="btn-primary" style={{ width: 'auto' }}>
          <Send style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>
    </div>
  </div>
);

// --- New Views for Mess Management ---

const MessMenuView = () => (
  <div>
    <SectionHeader title="Mess Menu Update" subtitle="Manage weekly food menu" />
    <div className="card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_MESS_MENU.map((menu, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{menu.day}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{menu.breakfast}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{menu.lunch}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{menu.dinner}</td>
                <td className="text-right">
                  <button className="action-btn">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const MessReviewsView = () => (
  <div>
    <SectionHeader title="Food Reviews & Ratings" subtitle="Feedback analytics from students" />
    
    <div className="grid-2">
      {/* Graph Card */}
      <div className="card card-padding">
        <h3 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Rating Distribution</h3>
        <div className="graph-container">
          {MOCK_MESS_REVIEWS.ratings.map((rating, idx) => (
            <div key={idx} className="bar-graph-item">
              <span className="bar-label">{rating.label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${rating.percent}%` }}>
                  {rating.percent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback List Card */}
      <div className="card">
        <div className="card-padding" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontWeight: 600 }}>Recent Feedback</h3>
        </div>
        <div className="card-padding" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {MOCK_MESS_REVIEWS.feedbacks.map((fb) => (
            <div key={fb.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 500 }}>{fb.student}</span>
                <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--warning-color)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < fb.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{fb.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MessFeesView = () => (
  <div>
    <SectionHeader title="Mess Fee Status" subtitle="Track monthly mess payments" />
    <div className="card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Monthly Fee</th>
              <th>Status</th>
              <th>Due Amount</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_MESS_FEES.map((student) => (
              <tr key={student.id}>
                <td style={{ fontWeight: 500 }}>{student.name}</td>
                <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>{student.roll}</td>
                <td>{student.fee}</td>
                <td><Badge type={student.status} /></td>
                <td style={{ color: student.due !== '$0' ? 'var(--danger-color)' : 'var(--text-secondary)', fontWeight: 500 }}>
                  {student.due}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const MessAttendanceView = () => (
  <div>
    <SectionHeader title="Student Attendance (Mess)" subtitle="Daily meal attendance tracking" />
    
    <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
      <div className="summary-card">
        <h2 className="summary-count text-success">350</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Present Today</p>
      </div>
      <div className="summary-card">
        <h2 className="summary-count text-danger">100</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Absent Today</p>
      </div>
    </div>

    <div className="card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Date</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_MESS_ATTENDANCE.map((record) => (
              <tr key={record.id}>
                <td style={{ fontWeight: 500 }}>{record.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{record.date}</td>
                <td><Badge type={record.breakfast ? 'Present' : 'Absent'} /></td>
                <td><Badge type={record.lunch ? 'Present' : 'Absent'} /></td>
                <td><Badge type={record.dinner ? 'Present' : 'Absent'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- Main App Component ---
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();
  const profileWrapperRef = React.useRef(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const loggedInEmail = location?.state?.email || localStorage.getItem('adminEmail');

  const getCreatedAtFromId = (id) => {
    try {
      if (!id) return 'N/A';
      const timestamp = parseInt(id.toString().substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return 'N/A';
    }
  };

  useEffect(() => {
    if (!loggedInEmail) return;
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await getAdminByEmail(loggedInEmail);
        if (mounted && res && res.success) {
          setAdminProfile(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin profile', err);
      }
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [loggedInEmail]);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);
  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'room-allotment', label: 'Room Allotment', icon: BedDouble },
    { 
      id: 'mess-management', 
      label: 'Mess Management', 
      icon: Utensils,
      subItems: [
        { id: 'mess-menu', label: 'Mess Menu Update' },
        { id: 'mess-reviews', label: 'Food Reviews & Ratings' },
        { id: 'mess-fees', label: 'Mess Fee Status' },
        { id: 'mess-attendance', label: 'Student Attendance' },
      ]
    },
    { id: 'registration', label: 'Student Registration', icon: UserPlus },
    { id: 'credentials', label: 'Student Credentials', icon: Shield },
    { id: 'issues', label: 'Issues & Complaints', icon: AlertCircle },
    { id: 'chat', label: 'Chat & Notices', icon: MessageSquare },
    { id: 'create-admin', label: 'Create Admin', icon: UserPlus },
  ];
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView setActiveTab={setActiveTab} />;
      case 'room-allotment': return <RoomAllotmentView />;
      case 'registration': return <StudentRegistrationView />;
      case 'credentials': return <StudentCredentialsView />;
      case 'issues': return <IssuesView />;
      case 'chat': return <ChatView />;
      case 'mess-menu': return <MessMenuView />;
      case 'mess-reviews': return <MessReviewsView />;
      case 'mess-fees': return <MessFeesView />;
      case 'mess-attendance': return <MessAttendanceView />;
      case 'create-admin': return <CreateAdminView />;
      default: return <DashboardView setActiveTab={setActiveTab} />;
    }
  };
  return (
    <div className="admin-dashboard-wrapper">
      <style>{cssStyles}</style>
      <div className="app-container">
        {isSidebarOpen && (
          <div 
            className="mobile-overlay" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-wrapper">
              <Building />
              <span>{adminProfile ? `Welcome, ${adminProfile.name}` : 'Admin Dashboard'}</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedMenus[item.id];
              const isActive = activeTab === item.id || (hasSubItems && item.subItems.some(sub => sub.id === activeTab));
              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        toggleSubmenu(item.id);
                      } else {
                        setActiveTab(item.id);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }
                    }}
                    className={`nav-item ${isActive ? 'active' : ''} ${hasSubItems ? 'nav-item-parent' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Icon className="nav-icon" />
                      <span>{item.label}</span>
                    </div>
                    {hasSubItems && (
                      <ChevronDown className={`nav-arrow ${isExpanded ? 'rotate' : ''}`} />
                    )}
                  </button>
                  
                  {hasSubItems && (
                    <div className={`submenu ${isExpanded ? 'open' : ''}`}>
                      {item.subItems.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveTab(sub.id);
                            if (window.innerWidth < 1024) setSidebarOpen(false);
                          }}
                          className={`submenu-item ${activeTab === sub.id ? 'active' : ''}`}
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
            <button className="btn-logout">
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </aside>
        <div className="main-wrapper">
          <header className="top-bar">
            <div className="header-right">
              <button className="notification-btn">
                <Bell />
                <span className="badge-dot"></span>
              </button>
              <div style={{ position: 'relative' }} ref={profileWrapperRef}>
                <div className="user-profile" onClick={() => setDropdownOpen(prev => !prev)}>
                  <div className="user-info">
                    <p className="user-name">{adminProfile?.name || 'Admin User'}</p>
                    <p className="user-role">{adminProfile?.role || 'Super Admin'}</p>
                  </div>
                  <div className="user-avatar">
                    {(() => {
                      const name = adminProfile?.name || 'Admin';
                      const parts = name.split(' ').filter(Boolean);
                      const initials = (parts.length === 1
                        ? parts[0].slice(0,2)
                        : (parts[0][0] + (parts[1] ? parts[1][0] : '') )).toUpperCase();
                      return initials;
                    })()}
                  </div>
                </div>

                {dropdownOpen && (
                  <div className="profile-dropdown">
                    <div style={{ paddingBottom: 8 }} className="profile-row">
                      <div className="user-avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>
                        {adminProfile ? (
                          (adminProfile.name || 'A').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()
                        ) : 'AD'}
                      </div>
                      <div>
                        <div className="profile-value">{adminProfile?.name || 'Admin User'}</div>
                        <div className="profile-label">{adminProfile?.email || ''}</div>
                      </div>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />
                    <div style={{ display: 'grid', gap: 6 }}>
                      <div>
                        <div className="profile-label">Role</div>
                        <div className="profile-value">{adminProfile?.role || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="profile-label">Phone</div>
                        <div className="profile-value">{adminProfile?.phone || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="profile-label">Hostel / Dept</div>
                        <div className="profile-value">{adminProfile?.hostelId?.hostelName || adminProfile?.hostelId || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="profile-label">Account Created</div>
                        <div className="profile-value">{adminProfile?.createdAt || getCreatedAtFromId(adminProfile?._id)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="content-area">
            <div className="content-container">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
