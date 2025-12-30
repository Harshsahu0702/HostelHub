import React, { useEffect, useState } from 'react';
import { useStudent } from '../../contexts/StudentContext';
import { createComplaint, getComplaints } from '../../services/api';

const Complaints = () => {
  const { student } = useStudent() || {};
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ cat: 'Electricity', desc: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!student) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getComplaints(); // ✅ no studentId
      setComplaints(res?.data || []);
    } catch (err) {
      setError('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [student]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.desc) return;

    try {
      await createComplaint({
        subject: form.cat,
        description: form.desc,
      }); // ✅ no studentId
      setForm({ cat: 'Electricity', desc: '' });
      load();
    } catch (err) {
      setError('Failed to file complaint');
    }
  };

  return (
    <div style={{display:'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px'}}>
      <div className="card">
        <h4 style={{marginTop:0}}>Submit New Complaint</h4>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-control"
              value={form.cat}
              onChange={e => setForm({ ...form, cat: e.target.value })}
            >
              <option>Electricity</option>
              <option>Plumbing</option>
              <option>Internet/WiFi</option>
              <option>Furniture</option>
              <option>Cleaning</option>
            </select>
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Describe issue..."
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
            />
          </div>

          <button className="btn btn-primary" style={{width:'100%'}}>
            File Complaint
          </button>

          {error && <div style={{color:'var(--danger)', marginTop:8}}>{error}</div>}
        </form>
      </div>

      <div>
        <h4 style={{marginTop:0}}>History</h4>
        {loading && <div>Loading...</div>}
        {!loading && complaints.length === 0 && (
          <div className="card">No complaints to display</div>
        )}

        {complaints.map(c => (
          <div key={c._id} className="card" style={{padding: '16px', marginBottom: '12px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
              <span style={{fontWeight:600}}>{c.subject || 'General'}</span>
              <span className={`badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-pending'}`}>
                {c.status}
              </span>
            </div>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
              {c.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
