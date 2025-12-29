import React from 'react';

const SectionHeader = ({ title, subtitle }) => (
    <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
    </div>
);

const MOCK_MESS_MENU = [
    { day: 'Monday', breakfast: 'Idli, Sambar, Chutney', lunch: 'Rice, Dal, Sabzi, Roti', dinner: 'Chapati, Paneer Curry, Rice' },
    { day: 'Tuesday', breakfast: 'Poha, Tea', lunch: 'Rice, Rajma, Sabzi, Roti', dinner: 'Rice, Chicken Curry, Salad' },
    { day: 'Wednesday', breakfast: 'Sandwich, Milk', lunch: 'Rice, Chole, Sabzi, Roti', dinner: 'Chapati, Mix Veg, Rice' },
    { day: 'Thursday', breakfast: 'Upma, Tea', lunch: 'Rice, Dal Makhani, Sabzi, Roti', dinner: 'Rice, Fish Curry, Salad' },
    { day: 'Friday', breakfast: 'Dosa, Sambar', lunch: 'Rice, Sambar, Sabzi, Roti', dinner: 'Chapati, Dal, Rice' },
    { day: 'Saturday', breakfast: 'Paratha, Curd', lunch: 'Rice, Kadhi, Sabzi, Roti', dinner: 'Rice, Egg Curry, Salad' },
    { day: 'Sunday', breakfast: 'Puri, Bhaji', lunch: 'Rice, Dal, Sabzi, Roti', dinner: 'Chapati, Veg Biryani, Raita' }
];

const MessMenuView = () => (
    <div>
        <SectionHeader title="Mess Menu Update" subtitle="Manage weekly food menu" />
        <div className="card">
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Breakfast</th>
                            <th>Lunch</th>
                            <th>Dinner</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_MESS_MENU.map((menu, idx) => (
                            <tr key={idx}>
                                <td style={{ fontWeight: 600 }}>{menu.day}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{menu.breakfast}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{menu.lunch}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{menu.dinner}</td>
                                <td className="text-right">
                                    <button className="action-btn">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default MessMenuView;