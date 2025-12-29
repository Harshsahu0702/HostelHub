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

const MOCK_MESS_FEES = [
    { id: 1, name: 'John Doe', roll: 'CS001', month: 'January', status: 'Paid', amount: 3000 },
    { id: 2, name: 'Jane Smith', roll: 'CS002', month: 'January', status: 'Pending', amount: 3000 },
    { id: 3, name: 'Mike Johnson', roll: 'CS003', month: 'January', status: 'Paid', amount: 3000 },
    { id: 4, name: 'Sarah Wilson', roll: 'CS004', month: 'January', status: 'Unpaid', amount: 3000 }
];

const MessFeesView = () => (
    <div>
        <SectionHeader title="Mess Fee Status" subtitle="Track monthly mess payments" />
        <div className="card">
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Roll No</th>
                            <th>Monthly Fee</th>
                            <th>Status</th>
                            <th>Due Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_MESS_FEES.map((student) => (
                            <tr key={student.id}>
                                <td style={{ fontWeight: 500 }}>{student.name}</td>
                                <td className="font-mono" style={{ color: 'var(--text-secondary)' }}>{student.roll}</td>
                                <td>{student.amount}</td>
                                <td><Badge type={student.status} /></td>
                                <td style={{ color: student.status !== 'Paid' ? 'var(--danger-color)' : 'var(--text-secondary)', fontWeight: 500 }}>
                                    {student.status === 'Paid' ? '$0' : student.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default MessFeesView;