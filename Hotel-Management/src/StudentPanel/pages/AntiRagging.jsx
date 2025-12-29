import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useStudent } from '../../contexts/StudentContext';
import { createAntiRagging, getAntiRagging } from '../../services/api';

const AntiRagging = () => {
  const { student } = useStudent() || {};
  const [sent, setSent] = useState(false);
  const [details, setDetails] = useState('');
  const [anon, setAnon] = useState(false);
  const [history, setHistory] = useState([]);

  const load = async () => {
    if (!student) return;
    try {
      const res = await getAntiRagging(); // ✅ no studentId
      setHistory(res.data || []);
    } catch (err) {
      setHistory([]);
    }
  };

  useEffect(() => {
    load();
  }, [student]);

  const submit = async () => {
    if (!details) return;

    try {
      await createAntiRagging({
        reporterName: anon ? 'Anonymous' : (student?.fullName || 'Reporter'),
        reporterContact: anon ? '' : (student?.phoneNumber || ''),
        details,
        anonymous: anon,
      }); // ✅ no studentId

      setSent(true);
      setDetails('');
      load();
    } catch (err) {
      // optional error handling
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div
        className="card"
        style={{ background: '#fef2f2', borderLeft: '4px solid var(--danger)' }}
      >
        <ShieldAlert size={40} color="var(--danger)" />
        <p style={{ marginTop: 8, color: '#b91c1c' }}>
          Ragging is a punishable offense. Confidentiality guaranteed.
        </p>
      </div>

      {!sent ? (
        <div className="card">
          <textarea
            className="form-control"
            rows={5}
            placeholder="Details..."
            value={details}
            onChange={e => setDetails(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <input
              type="checkbox"
              checked={anon}
              onChange={e => setAnon(e.target.checked)}
            />
            <span>Report anonymously</span>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', background: 'var(--danger)', marginTop: 16 }}
            onClick={submit}
          >
            Report
          </button>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <CheckCircle2
            size={48}
            color="var(--success)"
            style={{ margin: '0 auto 16px' }}
          />
          <h4>Logged!</h4>
          <button className="btn btn-ghost" onClick={() => setSent(false)}>
            Back
          </button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h4>Submitted Reports</h4>
        {history.length === 0 && (
          <div className="card">No reports to display</div>
        )}
        {history.map(h => (
          <div key={h._id} className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>
              {h.anonymous ? 'Anonymous' : (h.reporterName || 'Reporter')}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              {new Date(h.createdAt).toLocaleString()}
            </div>
            <div style={{ marginTop: 8 }}>{h.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AntiRagging;
