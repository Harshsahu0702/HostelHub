import React, { useEffect, useState } from 'react';
import { CreditCard, Utensils, Download } from 'lucide-react';
import { useStudent } from '../../contexts/StudentContext';
import { getFees } from '../../services/api';

const Fees = () => {
  const { student } = useStudent() || {};
  const [feeHistory, setFeeHistory] = useState({ hostel: [], mess: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!student) return;

      setLoading(true);
      setError(null);
      try {
        const res = await getFees(); // ✅ no studentId
        const records = res.data || [];

        const hostel = records.filter(
          r => r.desc && !/mess/i.test(r.desc)
        );
        const mess = records.filter(
          r => r.desc && /mess/i.test(r.desc)
        );

        setFeeHistory({ hostel, mess });
      } catch (err) {
        setFeeHistory({ hostel: [], mess: [] });
        setError('Failed to load fees');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [student]);

  const hostelTotal = feeHistory.hostel.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );
  const messTotal = feeHistory.mess.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );
  const messPaid = feeHistory.mess
    .filter(m => m.status === 'Paid')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{background:'#eff6ff', padding:'8px', borderRadius:'8px'}}>
              <CreditCard size={20} color="var(--primary)" />
            </div>
            <h4 style={{margin:0}}>Hostel Fee History - Sem 1</h4>
          </div>
          <button className="btn btn-ghost" style={{fontSize:'0.8rem'}}>
            <Download size={16}/> Receipt
          </button>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="card">{error}</div>}

        <div style={{overflowX:'auto'}}>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {feeHistory.hostel.map(item => (
                <tr key={item._id}>
                  <td style={{fontWeight:500}}>{item.desc}</td>
                  <td style={{color:'var(--text-muted)'}}>{item.date}</td>
                  <td>{item.method}</td>
                  <td style={{fontWeight:700}}>₹{item.amount.toLocaleString()}</td>
                  <td>
                    <span className="badge badge-success">{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{textAlign:'right', fontWeight:600, padding:'20px 12px'}}>
                  Total Paid (Sem 1)
                </td>
                <td style={{padding:'20px 12px', fontWeight:800, fontSize:'1rem', color:'var(--primary)'}}>
                  ₹{hostelTotal.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{background:'#fef3c7', padding:'8px', borderRadius:'8px'}}>
              <Utensils size={20} color="var(--warning)" />
            </div>
            <h4 style={{margin:0}}>Mess Fee History - Monthly</h4>
          </div>
          <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>
            Outstanding:{' '}
            <b style={{color:'var(--danger)'}}>
              ₹{(messTotal - messPaid).toLocaleString()}
            </b>
          </div>
        </div>

        <div style={{overflowX:'auto'}}>
          <table>
            <thead>
              <tr>
                <th>Billing Month</th>
                <th>Billing Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {feeHistory.mess.map(item => (
                <tr key={item._id}>
                  <td style={{fontWeight:500}}>{item.desc}</td>
                  <td style={{color:'var(--text-muted)'}}>{item.date}</td>
                  <td>{item.method}</td>
                  <td style={{fontWeight:700}}>₹{item.amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${item.status === 'Paid' ? 'badge-success' : 'badge-pending'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fees;
