import React, { useState, useMemo, useEffect } from 'react';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    MoreVertical,
    Home,
    Calendar,
    MapPin,
    X,
    User,
    Check
} from 'lucide-react';
import { getDeparturesForAdmin, updateDepartureStatus } from '../../services/api';

const DeparturesView = ({ hostelId }) => {
    console.log('DeparturesView received hostelId:', hostelId);
    const [departures, setDepartures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!hostelId) {
                console.log('No hostelId provided');
                setLoading(false);
                return;
            }

            try {
                const result = await getDeparturesForAdmin(hostelId);

                if (result.success) {
                    const formattedData = result.data.map(d => ({
                        id: d._id,
                        studentName: d.studentId?.fullName || 'Unknown',
                        roomNo: d.studentId?.roomAllocated || 'N/A',
                        destination: d.destination || '',
                        departureDate: new Date(d.departureDate).toLocaleDateString('en-CA'),
                        returnDate: d.returnDate ? new Date(d.returnDate).toLocaleDateString('en-CA') : 'N/A',
                        reason: d.reason || '',
                        status: d.status || 'Pending',
                        priority: d.urgent ? 'High' : 'Medium',
                        date: new Date(d.createdAt).toLocaleDateString('en-CA'),
                        type: 'departure'
                    }));
                    setDepartures(formattedData);
                }
            } catch (err) {
                console.error('Failed to fetch departure requests:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [hostelId]);

    const updateItemStatus = async (itemId, newStatus) => {
        try {
            // Find the original status for potential revert
            const originalItem = departures.find(item => item.id === itemId);
            const originalStatus = originalItem ? originalItem.status : 'Pending';

            // Update local state immediately for better UX
            setDepartures(prev => prev.map(item =>
                item.id === itemId
                    ? { ...item, status: newStatus }
                    : item
            ));

            setActiveDropdown(null);

            // Make API call to update status
            await updateDepartureStatus(itemId, newStatus);

            console.log(`Successfully updated departure ${itemId} to status: ${newStatus}`);
        } catch (error) {
            console.error('Failed to update departure status:', error);

            // Revert the change if API call fails
            setDepartures(prev => prev.map(item =>
                item.id === itemId
                    ? { ...item, status: originalStatus }
                    : item
            ));

            alert(`Failed to update status: ${error.message || 'Unknown error'}`);
        }
    };

    const filteredDepartures = useMemo(() => {
        return departures.filter(item => {
            const matchesSearch =
                item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.reason.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === "All" || item.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus, departures]);

    const stats = {
        total: departures.length,
        pending: departures.filter(d => d.status === "Pending").length,
        approved: departures.filter(d => d.status === "Approved").length,
        rejected: departures.filter(d => d.status === "Rejected").length
    };

    return (
        <div style={styles.pageWrapper}>
            <style>{hoverStyles}</style>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Departure Requests</h1>
                    <p style={styles.subtitle}>Manage student departure requests and approvals</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={styles.statsGrid}>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ ...styles.iconBox, backgroundColor: '#eff6ff', color: '#3b82f6' }}><Calendar size={20} /></div>
                    <div>
                        <div style={styles.statLabel}>TOTAL REQUESTS</div>
                        <div style={styles.statValue}>{stats.total}</div>
                    </div>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #ef4444' }}>
                    <div style={{ ...styles.iconBox, backgroundColor: '#fef2f2', color: '#ef4444' }}><Clock size={20} /></div>
                    <div>
                        <div style={styles.statLabel}>PENDING APPROVAL</div>
                        <div style={styles.statValue}>{stats.pending}</div>
                    </div>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
                    <div style={{ ...styles.iconBox, backgroundColor: '#ecfdf5', color: '#10b981' }}><CheckCircle2 size={20} /></div>
                    <div>
                        <div style={styles.statLabel}>APPROVED</div>
                        <div style={styles.statValue}>{stats.approved}</div>
                    </div>
                </div>
                <div style={{ ...styles.statCard, borderLeft: '4px solid #f1f5f9' }}>
                    <div style={{ ...styles.iconBox, backgroundColor: '#f1f5f9', color: '#64748b' }}><X size={20} /></div>
                    <div>
                        <div style={styles.statLabel}>REJECTED</div>
                        <div style={styles.statValue}>{stats.rejected}</div>
                    </div>
                </div>
            </div>

            {/* Main Table Container */}
            <div style={styles.mainContainer}>
                <div style={styles.toolbar}>
                    <div style={styles.searchWrapper}>
                        <Search size={18} style={styles.searchIcon} />
                        <input
                            style={styles.searchInput}
                            placeholder="Search student, destination, or reason..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={styles.filterWrapper}>
                        <Filter size={16} color="#64748b" />
                        <select
                            style={styles.select}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div style={styles.tableResponsive}>
                    <table style={styles.table}>
                        <thead style={styles.thead}>
                            <tr>
                                <th style={styles.th}>Student & Room</th>
                                <th style={styles.th}>Destination</th>
                                <th style={styles.th}>Dates</th>
                                <th style={styles.th}>Reason</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Priority</th>
                                <th style={styles.th}>Requested</th>
                                <th style={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartures.map((item) => (
                                <tr key={item.id} className="table-row">
                                    <td style={styles.td}>
                                        <div style={styles.studentCell}>
                                            <div style={styles.avatar}>{item.studentName.charAt(0)}</div>
                                            <div>
                                                <div style={styles.studentName}>{item.studentName}</div>
                                                <div style={styles.roomNo}><Home size={10} style={{ marginRight: 4 }} />Room {item.roomNo}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.destinationCell}>
                                            <div style={styles.destinationText}>{item.destination}</div>
                                            <div style={styles.departureId}>ID: {item.id}</div>
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.datesCell}>
                                            <div style={styles.dateRow}>
                                                <Calendar size={12} style={{ marginRight: 4 }} />
                                                <span>From: {item.departureDate}</span>
                                            </div>
                                            {item.returnDate !== 'N/A' && (
                                                <div style={styles.dateRow}>
                                                    <Calendar size={12} style={{ marginRight: 4 }} />
                                                    <span>To: {item.returnDate}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.reasonText}>{item.reason}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td style={styles.td}>
                                        <PriorityBadge priority={item.priority} />
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ fontSize: '12px', color: '#64748b' }}>{item.date}</span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ position: 'relative' }}>
                                            {item.status === 'Approved' || item.status === 'Rejected' ? (
                                                <div style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                                    <MoreVertical size={16} color="#94a3b8" />
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        style={{ ...styles.actionBtn, ...(activeDropdown === item.id ? { backgroundColor: '#f1f5f9', color: '#475569' } : {}) }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDropdown(activeDropdown === item.id ? null : item.id);
                                                        }}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {activeDropdown === item.id && (
                                                        <div style={styles.dropdownMenu}>
                                                            <div style={styles.dropdownHeader}>Change Status</div>
                                                            <button
                                                                style={{ ...styles.dropdownItem, ...(item.status === 'Pending' ? styles.dropdownItemActive : {}) }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateItemStatus(item.id, 'Pending');
                                                                }}
                                                            >
                                                                <Clock size={14} style={{ marginRight: 8 }} />
                                                                Pending
                                                            </button>
                                                            <button
                                                                style={{ ...styles.dropdownItem, ...(item.status === 'Approved' ? styles.dropdownItemActive : {}) }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateItemStatus(item.id, 'Approved');
                                                                }}
                                                            >
                                                                <Check size={14} style={{ marginRight: 8 }} />
                                                                Approve
                                                            </button>
                                                            <div style={styles.dropdownDivider}></div>
                                                            <button
                                                                style={{ ...styles.dropdownItem, ...(item.status === 'Rejected' ? styles.dropdownItemActive : {}) }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateItemStatus(item.id, 'Rejected');
                                                                }}
                                                            >
                                                                <X size={14} style={{ marginRight: 8 }} />
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredDepartures.length === 0 && (
                        <div style={styles.emptyState}>
                            <AlertCircle size={40} color="#cbd5e1" />
                            <p>No departure requests found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatusBadge = ({ status }) => {
    const colors = {
        "Pending": { bg: "#fef2f2", text: "#ef4444", border: "#fee2e2" },
        "Approved": { bg: "#ecfdf5", text: "#10b981", border: "#d1fae5" },
        "Rejected": { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" }
    };
    const theme = colors[status];
    return (
        <span style={{
            ...styles.badge,
            backgroundColor: theme.bg,
            color: theme.text,
            borderColor: theme.border
        }}>
            {status}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const dotColor = priority === "High" ? "#ef4444" : priority === "Medium" ? "#3b82f6" : "#94a3b8";
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ height: 8, width: 8, borderRadius: '50%', backgroundColor: dotColor }}></span>
            <span style={{ fontSize: '13px', color: '#475569' }}>{priority}</span>
        </div>
    );
};

// CSS Styles
const hoverStyles = `
  .table-row:hover { background-color: #f1f5f9; transition: background 0.2s; }
  select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
`;

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        maxWidth: '1200px',
        margin: '0 auto 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
    },
    title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' },
    subtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
    headerActions: { display: 'flex', gap: '12px' },
    btnPrimary: {
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px'
    },
    btnSecondary: {
        backgroundColor: 'white',
        color: '#475569',
        border: '1px solid #e2e8f0',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    statsGrid: {
        maxWidth: '1200px',
        margin: '0 auto 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    iconBox: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statLabel: { fontSize: '11px', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em' },
    statValue: { fontSize: '24px', fontWeight: '800', color: '#0f172a' },
    mainContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        overflow: 'hidden'
    },
    toolbar: {
        padding: '20px 24px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
    },
    searchWrapper: { position: 'relative', flex: '1', minWidth: '300px' },
    searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
    searchInput: {
        width: '100%',
        padding: '10px 10px 10px 40px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    filterWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#f8fafc',
        padding: '4px 12px',
        borderRadius: '10px',
        border: '1px solid #e2e8f0'
    },
    select: {
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        fontWeight: '600',
        color: '#475569',
        cursor: 'pointer',
        outline: 'none'
    },
    tableResponsive: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    thead: { backgroundColor: '#fcfdfe' },
    th: {
        padding: '16px 24px',
        fontSize: '11px',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '1px solid #f1f5f9'
    },
    td: { padding: '16px 24px', verticalAlign: 'middle', borderBottom: '1px solid #f8fafc' },
    studentCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '14px'
    },
    studentName: { fontWeight: '700', color: '#0f172a', fontSize: '14px' },
    roomNo: { color: '#64748b', fontSize: '12px', marginTop: '2px', display: 'flex', alignItems: 'center' },
    destinationCell: {},
    destinationText: { fontSize: '14px', color: '#334155', fontWeight: '500', lineHeight: '1.4' },
    departureId: { fontSize: '10px', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase' },
    datesCell: { display: 'flex', flexDirection: 'column', gap: '4px' },
    dateRow: { display: 'flex', alignItems: 'center', fontSize: '12px', color: '#64748b' },
    reasonText: { fontSize: '13px', color: '#475569', maxWidth: '200px', lineHeight: '1.3' },
    badge: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        border: '1px solid'
    },
    actionBtn: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'all 0.2s'
    },
    dropdownMenu: {
        position: 'absolute',
        right: 0,
        top: '100%',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 50,
        minWidth: '180px',
        marginTop: '4px'
    },
    dropdownHeader: {
        padding: '8px 12px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        borderBottom: '1px solid #f1f5f9',
        backgroundColor: '#f8fafc'
    },
    dropdownItem: {
        width: '100%',
        padding: '10px 12px',
        border: 'none',
        backgroundColor: 'transparent',
        textAlign: 'left',
        fontSize: '14px',
        color: '#334155',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#f8fafc'
        }
    },
    dropdownItemActive: {
        backgroundColor: '#f1f5f9',
        color: '#2563eb',
        fontWeight: '600'
    },
    dropdownDivider: {
        height: '1px',
        backgroundColor: '#f1f5f9',
        margin: '4px 0'
    },
    emptyState: {
        padding: '60px 20px',
        textAlign: 'center',
        color: '#94a3b8'
    }
};

export default DeparturesView;
