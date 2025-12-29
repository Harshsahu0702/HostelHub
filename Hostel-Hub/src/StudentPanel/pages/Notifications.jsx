import React, { useEffect, useState } from 'react';
import { useStudent } from '../../contexts/StudentContext';
import { getNotifications } from '../../services/api';

const Notifications = () => {
  const { student, loading } = useStudent() || {};
  const [notifs, setNotifs] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student) return;

    const fetch = async () => {
      setLoadingState(true);
      setError(null);
      try {
        const res = await getNotifications(); // ✅ no argument
        setNotifs(res.data || []);
      } catch (err) {
        setError('Failed to load notifications');
      } finally {
        setLoadingState(false);
      }
    };

    fetch();
  }, [student]);

  if (loading || loadingState) return <div>Loading notifications...</div>;

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '20px'}}>
        <h3 style={{margin:0}}>Recent Notices</h3>
      </div>

      {error && <div className="card">{error}</div>}

      {(!notifs || notifs.length === 0) && (
        <div className="card">No notifications to display</div>
      )}

      {notifs.map(n => (
        <div
          key={n._id}
          className="card"
          style={{
            opacity: n.read ? 0.7 : 1,
            borderLeft: n.type === 'IMPORTANT'
              ? '4px solid var(--danger)'
              : '1px solid var(--border)'
          }}
        >
          <div style={{display:'flex', justifyContent:'space-between', marginBottom: '8px'}}>
            <span className={`badge ${n.type === 'IMPORTANT' ? 'badge-danger' : 'badge-pending'}`}>
              {n.type || 'NOTICE'}
            </span>
            <span style={{fontSize:'0.75rem', color: 'var(--text-muted)'}}>
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
          <h4 style={{margin: '0 0 8px 0'}}>{n.title || 'No title'}</h4>
          <p style={{margin:0, fontSize:'0.9rem', color: 'var(--text-muted)', lineHeight: 1.5}}>
            {n.message || 'No details available'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;