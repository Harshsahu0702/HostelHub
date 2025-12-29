import React, { useEffect, useState } from 'react';
import { useStudent } from '../../contexts/StudentContext';
import { getMessMenu } from '../../services/api';

const Mess = () => {
  const { student } = useStudent() || {};
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const [menu, setMenu] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student) return;

    const load = async () => {
      setMenuLoading(true);
      setError(null);
      try {
        const res = await getMessMenu(); // ✅ no hostelId
        setMenu(res.data?.items || []);
      } catch (err) {
        setMenu([]);
        setError('No menu to display');
      } finally {
        setMenuLoading(false);
      }
    };

    load();
  }, [student]);

  return (
    <div>
      <div className="card">
        <h4 style={{ marginTop: 0 }}>Weekly Menu</h4>

        {error && <div className="card">{error}</div>}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {menuLoading && (
                <tr>
                  <td colSpan={4}>Loading...</td>
                </tr>
              )}

              {!menuLoading && (!menu || menu.length === 0) && (
                <tr>
                  <td colSpan={4}>Nothing to display</td>
                </tr>
              )}

              {!menuLoading &&
                (menu || []).map((m) => (
                  <tr
                    key={m.day}
                    style={{
                      background: m.day === today ? '#eff6ff' : 'transparent',
                    }}
                  >
                    <td style={{ fontWeight: 700 }}>{m.day}</td>
                    <td>{m.breakfast || 'Not Found'}</td>
                    <td>{m.lunch || 'Not Found'}</td>
                    <td>{m.dinner || 'Not Found'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Mess;
