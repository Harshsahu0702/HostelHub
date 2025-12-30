import React, { useState, useEffect } from 'react';
import { UserPlus, Users, BedDouble, AlertCircle, MessageSquare, QrCode } from 'lucide-react';
import { getRoomStats, getAllStudents, getComplaintsForAdmin, getAntiRaggingForAdmin, getUnreadMessageCount } from '../../services/api';


const StatCard = ({ title, value, colorClass, icon: Icon, onClick }) => (
    <div
        className="stat-card"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.2s' }}
        onMouseOver={e => onClick && (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseOut={e => onClick && (e.currentTarget.style.transform = 'translateY(0)')}
    >
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

const DashboardView = ({ setActiveTab, adminProfile, dropdownOpen, setDropdownOpen, profileWrapperRef, getCreatedAtFromId }) => {
    const [stats, setStats] = useState([
        { title: 'Total Students', value: '0', colorClass: 'text-blue bg-blue-light', icon: Users },
        { title: 'Rooms Occupied', value: '0 / 0', colorClass: 'text-green bg-green-light', icon: BedDouble },
        { title: 'Pending Issues', value: '0', colorClass: 'text-orange bg-orange-light', icon: AlertCircle },
        { title: 'New Messages', value: '0', colorClass: 'text-indigo bg-indigo-light', icon: MessageSquare },
    ]);
    const [recentAllocations, setRecentAllocations] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hostelId = adminProfile?.hostelId?._id || adminProfile?.hostelId;

                const [roomStats, studentsRes, complaintsRes, antiRaggingRes, unreadRes] = await Promise.all([
                    getRoomStats().catch(() => ({ occupiedRooms: 0, totalRooms: 0 })),
                    getAllStudents().catch(() => ({ success: false, data: [] })),
                    hostelId ? getComplaintsForAdmin(hostelId).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
                    hostelId ? getAntiRaggingForAdmin(hostelId).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
                    getUnreadMessageCount().catch(() => ({ count: 0 }))
                ]);

                const students = studentsRes.success ? studentsRes.data : [];

                // Process Pending Issues
                const complaints = complaintsRes.data || [];
                const antiRagging = antiRaggingRes.data || [];

                const pendingComplaints = complaints.filter(c => (c.status || 'Pending') === 'Pending');
                // Note: Assuming anti-ragging items rely on similar status field, defaulting to 'Pending' if missing
                const pendingAntiRagging = antiRagging.filter(r => (r.status || 'Pending') === 'Pending');

                const totalPendingIssues = pendingComplaints.length + pendingAntiRagging.length;
                const unreadCount = unreadRes.count || 0;

                setStats([
                    { title: 'Total Students', value: students.length.toString(), colorClass: 'text-blue bg-blue-light', icon: Users },
                    { title: 'Rooms Occupied', value: `${roomStats.occupiedRooms || 0} / ${roomStats.totalRooms || 0}`, colorClass: 'text-green bg-green-light', icon: BedDouble },
                    { title: 'Pending Issues', value: totalPendingIssues.toString(), colorClass: 'text-orange bg-orange-light', icon: AlertCircle },
                    {
                        title: 'New Messages',
                        value: unreadCount.toString(),
                        colorClass: 'text-indigo bg-indigo-light',
                        icon: MessageSquare,
                        onClick: () => setActiveTab('chat')
                    },
                ]);

                setRecentAllocations(students.slice(0, 5).map(s => ({
                    id: s._id || s.id,
                    name: s.fullName,
                    room: s.roomAllocated || '-',
                    status: s.roomAllocated ? 'Allotted' : 'Pending'
                })));


            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [adminProfile]);



    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <SectionHeader title="Dashboard" subtitle="Overview of hostel activities" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

                    <div
                        style={{ position: 'relative' }}
                        ref={profileWrapperRef}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div
                            className="user-profile"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(prev => !prev);
                            }}
                        >
                            <div className="user-info">
                                <p className="user-name">{adminProfile?.name || 'Admin User'}</p>
                                <p className="user-role">{adminProfile?.role || 'Super Admin'}</p>
                            </div>
                            <div className="user-avatar">
                                {(() => {
                                    const name = adminProfile?.name || 'Admin';
                                    const parts = name.split(' ').filter(Boolean);
                                    const initials = (parts.length === 1
                                        ? parts[0].slice(0, 2)
                                        : (parts[0][0] + (parts[1] ? parts[1][0] : ''))).toUpperCase();
                                    return initials;
                                })()}
                            </div>
                        </div>

                        {dropdownOpen && (
                            <div
                                className="profile-dropdown"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <div style={{ paddingBottom: 8 }} className="profile-row">
                                    <div className="user-avatar" style={{ width: 48, height: 48, fontSize: '1rem' }}>
                                        {adminProfile ? (
                                            (adminProfile.name || 'A').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
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
                                        <div className="profile-value">{adminProfile?.createdAt || (getCreatedAtFromId ? getCreatedAtFromId(adminProfile?._id) : 'N/A')}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        title={stat.title}
                        value={stat.value}
                        colorClass={stat.colorClass}
                        icon={stat.icon}
                        onClick={stat.onClick}
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
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>No recent allocations</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card">
                    <div className="card-padding" style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontWeight: 600 }}>QR Scanner</h3>
                    </div>
                    <div className="card-padding" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                            borderRadius: '0.5rem',
                            border: '1px solid #0ea5e9'
                        }}>
                            <div style={{
                                width: '3rem',
                                height: '3rem',
                                borderRadius: '50%',
                                background: '#0ea5e9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <QrCode size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#0c4a6e', margin: '0 0 0.25rem 0' }}>Attendance Scanner</h4>
                                <p style={{ fontSize: '0.875rem', color: '#0284c7', margin: 0 }}>Scan student QR codes to mark attendance</p>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => setActiveTab('attendance')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                width: '100%',
                                background: 'linear-gradient(45deg, #0ea5e9, #0284c7)',
                                border: 'none',
                                borderRadius: '0.5rem',
                                color: 'white',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <QrCode size={20} />
                            Open QR Scanner
                        </button>

                        <div style={{
                            padding: '0.75rem',
                            background: '#f8fafc',
                            borderRadius: '0.375rem',
                            fontSize: '0.813rem',
                            color: '#64748b',
                            border: '1px solid #e2e8f0'
                        }}>
                            <strong>Quick Tip:</strong> Students can show their QR codes from the dashboard for instant attendance marking.
                        </div>
                    </div>
                </div>

                {/* QR Scanner Modal Removed - Redirects to AttendanceView instead */}
            </div>
        </div>
    );
};

export default DashboardView;
