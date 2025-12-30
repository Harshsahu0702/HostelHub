import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Home,
  MessageSquare,
  ArrowUpDown,
  X
} from 'lucide-react';
import { getComplaintsForAdmin, getAntiRaggingForAdmin, updateComplaintStatus, updateAntiRaggingStatus } from '../services/api';

const IssuesComplaints = ({ hostelId }) => {
  console.log('IssuesComplaints received hostelId:', hostelId);
  const [complaints, setComplaints] = useState([]);
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
        const [complaintsRes, antiRaggingRes] = await Promise.all([
          getComplaintsForAdmin(hostelId),
          getAntiRaggingForAdmin(hostelId)
        ]);

        const merged = [
          ...(complaintsRes.data?.map(c => ({
            id: c._id,
            studentName: c.studentName || 'Unknown',
            roomNo: c.studentId?.roomAllocated || 'N/A',
            category: c.subject || 'Complaint',
            issue: c.description || '',
            status: c.status || 'Pending',
            priority: 'Medium',
            date: new Date(c.createdAt).toLocaleDateString('en-CA'),
            type: 'complaint'
          })) || []),
          ...(antiRaggingRes.data?.map(r => ({
            id: r._id,
            studentName: r.anonymous ? 'Anonymous' : (r.studentName || r.reporterName || 'Unknown'),
            roomNo: r.studentId?.roomAllocated || 'N/A',
            category: 'Anti-Ragging',
            issue: r.details || '',
            status: 'Pending',
            priority: 'High',
            date: new Date(r.createdAt).toLocaleDateString('en-CA'),
            type: 'antiragging'
          })) || [])
        ];
        setComplaints(merged);
      } catch (err) {
        console.error('Failed to fetch issues/complaints:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hostelId]);

  const updateItemStatus = async (itemId, newStatus, type) => {
    try {
      // Find the original status for potential revert
      const originalItem = complaints.find(item => item.id === itemId);
      const originalStatus = originalItem ? originalItem.status : 'Pending';

      // Update local state immediately for better UX
      setComplaints(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, status: newStatus }
          : item
      ));

      setActiveDropdown(null);

      // Make API call based on type
      if (type === 'complaint') {
        await updateComplaintStatus(itemId, newStatus);
      } else if (type === 'antiragging') {
        await updateAntiRaggingStatus(itemId, newStatus);
      }

      console.log(`Successfully updated ${type} ${itemId} to status: ${newStatus}`);
    } catch (error) {
      console.error(`Failed to update ${type} status:`, error);

      // Revert the change if API call fails
      setComplaints(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, status: originalStatus }
          : item
      ));

      alert(`Failed to update status: ${error.message || 'Unknown error'}`);
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter(item => {
      const matchesSearch =
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roomNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.issue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, complaints]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
    rejected: complaints.filter(c => c.status === "Rejected").length
  };

  return (
    <div style={styles.pageWrapper}>
      <style>{hoverStyles}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Issues & Complaints</h1>
          <p style={styles.subtitle}>Admin panel to track and resolve hostel grievances</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #3b82f6' }}>
          <div style={{ ...styles.iconBox, backgroundColor: '#eff6ff', color: '#3b82f6' }}><MessageSquare size={20} /></div>
          <div>
            <div style={styles.statLabel}>TOTAL COMPLAINTS</div>
            <div style={styles.statValue}>{stats.total}</div>
          </div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #ef4444' }}>
          <div style={{ ...styles.iconBox, backgroundColor: '#fef2f2', color: '#ef4444' }}><Clock size={20} /></div>
          <div>
            <div style={styles.statLabel}>PENDING ACTION</div>
            <div style={styles.statValue}>{stats.pending}</div>
          </div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
          <div style={{ ...styles.iconBox, backgroundColor: '#ecfdf5', color: '#10b981' }}><CheckCircle2 size={20} /></div>
          <div>
            <div style={styles.statLabel}>RESOLVED CASES</div>
            <div style={styles.statValue}>{stats.resolved}</div>
          </div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #f1f5f9' }}>
          <div style={{ ...styles.iconBox, backgroundColor: '#f1f5f9', color: '#64748b' }}><X size={20} /></div>
          <div>
            <div style={styles.statLabel}>REJECTED CASES</div>
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
              placeholder="Search student or room..."
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
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Student & Room</th>
                <th style={styles.th}>Complaint</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((item) => (
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
                    <div style={styles.issueText}>{item.issue}</div>
                    <div style={styles.complaintId}>ID: {item.id}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>{item.category}</span>
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
                      {item.status === 'Resolved' || item.status === 'Rejected' ? (
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
                                  updateItemStatus(item.id, 'Pending', item.type);
                                }}
                              >
                                <Clock size={14} style={{ marginRight: 8 }} />
                                Pending
                              </button>
                              <button
                                style={{ ...styles.dropdownItem, ...(item.status === 'In Progress' ? styles.dropdownItemActive : {}) }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateItemStatus(item.id, 'In Progress', item.type);
                                }}
                              >
                                <ArrowUpDown size={14} style={{ marginRight: 8 }} />
                                In Progress
                              </button>
                              <button
                                style={{ ...styles.dropdownItem, ...(item.status === 'Resolved' ? styles.dropdownItemActive : {}) }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateItemStatus(item.id, 'Resolved', item.type);
                                }}
                              >
                                <CheckCircle2 size={14} style={{ marginRight: 8 }} />
                                Resolved
                              </button>
                              <div style={styles.dropdownDivider}></div>
                              <button
                                style={{ ...styles.dropdownItem, ...(item.status === 'Rejected' ? styles.dropdownItemActive : {}) }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateItemStatus(item.id, 'Rejected', item.type);
                                }}
                              >
                                <X size={14} style={{ marginRight: 8 }} />
                                Rejected
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
          {filteredComplaints.length === 0 && (
            <div style={styles.emptyState}>
              <AlertCircle size={40} color="#cbd5e1" />
              <p>No complaints found matching your criteria.</p>
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
    "In Progress": { bg: "#fffbeb", text: "#d97706", border: "#fef3c7" },
    "Resolved": { bg: "#ecfdf5", text: "#10b981", border: "#d1fae5" },
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
  issueText: { fontSize: '14px', color: '#334155', fontWeight: '500', lineHeight: '1.4' },
  complaintId: { fontSize: '10px', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase' },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },
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
    padding: '80px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    color: '#64748b'
  }
};

export default IssuesComplaints;