import React, { useEffect, useState } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { useStudent } from '../../contexts/StudentContext';
import { createDeparture, getDepartures } from '../../services/api';

const Departure = () => {
  const { student } = useStudent() || {};
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ fromDate: '', toDate: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!student) return;

    setLoading(true);
    setError(null);
    try {
      const res = await getDepartures(); // ✅ no studentId
      setRequests(res.data || []);
    } catch (err) {
      setError('Failed to load departures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDeparture({
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason,
      }); // ✅ no studentId

      setForm({ fromDate: '', toDate: '', reason: '' });
      load(); // ✅ always refetch
    } catch (err) {
      setError('Failed to create request');
    }
  };

  const handleDelete = (id) => {
    setRequests(prev => prev.filter(req => req._id !== id));
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Departure</label>
            <input
              type="date"
              className="form-control"
              value={form.fromDate}
              onChange={e => setForm({ ...form, fromDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Return</label>
            <input
              type="date"
              className="form-control"
              value={form.toDate}
              onChange={e => setForm({ ...form, toDate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              className="form-control"
              rows="3"
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              required
            />
          </div>

          <button className="btn btn-primary" style={{ width:'100%' }}>
            <Send size={18} /> Submit
          </button>

          {error && <div style={{ color:'var(--danger)', marginTop:8 }}>{error}</div>}
        </form>
      </div>

      <div>
        <h4 style={{ marginTop:0 }}>History</h4>

        {loading && <div>Loading...</div>}

        {!loading && requests.length === 0 && (
          <div className="card">No departures to display</div>
        )}

        {requests.map(req => (
          <div key={req._id} className="card">
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <div>
                {new Date(req.fromDate).toLocaleDateString()} →{' '}
                {new Date(req.toDate).toLocaleDateString()}
              </div>

              <div style={{ display:'flex', gap: 8 }}>
                <span className={`badge badge-${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
                <button
                  onClick={() => handleDelete(req._id)}
                  className="btn btn-danger-ghost"
                  style={{ padding:4 }}
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departure;
