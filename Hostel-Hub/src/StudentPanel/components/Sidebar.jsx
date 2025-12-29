import React from 'react';
import { 
  LayoutDashboard, Bell, MessageSquareWarning, ShieldAlert, Utensils, 
  PlaneTakeoff, CreditCard, MessageCircle, Star, LogOut , CalendarDays
} from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
    { id: 'antiragging', label: 'Anti-Ragging', icon: ShieldAlert },
    { id: 'mess', label: 'Mess', icon: Utensils },
    { id: 'departure', label: 'Departure', icon: PlaneTakeoff },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'feedback', label: 'Feedback', icon: Star },
    { id: 'attendance', label: 'Attendance', icon: CalendarDays },
  ];

  const handleLogout = () => {
    localStorage.removeItem('studentData');
    window.location.href = '/';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>HOSTEL PORTAL</h2>
      </div>
      
      <nav className="sidebar-menu">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`menu-item ${activePage === item.id ? 'active' : ''}`}
            >
              <Icon className="menu-icon" size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

