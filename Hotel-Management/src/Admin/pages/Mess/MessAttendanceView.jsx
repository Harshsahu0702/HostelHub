import React from 'react';

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

const MOCK_MESS_ATTENDANCE = [
    { id: 1, name: 'John Doe', date: '2024-01-15', breakfast: 'Present', lunch: 'Present', dinner: 'Absent' },
    { id: 2, name: 'Jane Smith', date: '2024-01-15', breakfast: 'Present', lunch: 'Absent', dinner: 'Present' },
    { id: 3, name: 'Mike Johnson', date: '2024-01-15', breakfast: 'Absent', lunch: 'Present', dinner: 'Present' },
    { id: 4, name: 'Sarah Wilson', date: '2024-01-15', breakfast: 'Present', lunch: 'Present', dinner: 'Present' }
];

const MessAttendanceView = () => (
    <div>
        <SectionHeader title="Student Attendance (Mess)" subtitle="Daily meal attendance tracking" />

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
            <div className="summary-card">
                <h2 className="summary-count text-success">350</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Present Today</p>
            </div>
            <div className="summary-card">
                <h2 className="summary-count text-danger">100</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Absent Today</p>
            </div>
        </div>

        <div className="card">
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Date</th>
                            <th>Breakfast</th>
                            <th>Lunch</th>
                            <th>Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_MESS_ATTENDANCE.map((record) => (
                            <tr key={record.id}>
                                <td style={{ fontWeight: 500 }}>{record.name}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{record.date}</td>
                                <td><Badge type={record.breakfast ? 'Present' : 'Absent'} /></td>
                                <td><Badge type={record.lunch ? 'Present' : 'Absent'} /></td>
                                <td><Badge type={record.dinner ? 'Present' : 'Absent'} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default MessAttendanceView;