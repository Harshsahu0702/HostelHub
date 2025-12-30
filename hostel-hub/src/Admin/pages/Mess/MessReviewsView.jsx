import React from 'react';
import { Star } from 'lucide-react';

const SectionHeader = ({ title, subtitle }) => (
    <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
    </div>
);

const MOCK_MESS_REVIEWS = {
    ratings: [
        { label: '5★', count: 45, percentage: 30 },
        { label: '4★', count: 60, percentage: 40 },
        { label: '3★', count: 30, percentage: 20 },
        { label: '2★', count: 10, percentage: 6.7 },
        { label: '1★', count: 5, percentage: 3.3 }
    ],
    feedbacks: [
        { id: 1, student: 'John Doe', rating: 5, comment: 'Excellent food quality and variety!', date: '2024-01-15' },
        { id: 2, student: 'Jane Smith', rating: 4, comment: 'Good food but need more variety in breakfast', date: '2024-01-14' },
        { id: 3, student: 'Mike Johnson', rating: 3, comment: 'Average quality, can be improved', date: '2024-01-13' }
    ]
};

const MessReviewsView = () => (
    <div>
        <SectionHeader title="Food Reviews & Ratings" subtitle="Feedback analytics from students" />

        <div className="grid-2">
            {/* Graph Card */}
            <div className="card card-padding">
                <h3 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Rating Distribution</h3>
                <div className="graph-container">
                    {MOCK_MESS_REVIEWS.ratings.map((rating, idx) => (
                        <div key={idx} className="bar-graph-item">
                            <span className="bar-label">{rating.label}</span>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: `${rating.percentage}%` }}>
                                    {rating.percentage}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feedback List Card */}
            <div className="card">
                <div className="card-padding" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontWeight: 600 }}>Recent Feedback</h3>
                </div>
                <div className="card-padding" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {MOCK_MESS_REVIEWS.feedbacks.map((fb) => (
                        <div key={fb.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 500 }}>{fb.student}</span>
                                <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--warning-color)' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < fb.rating ? "currentColor" : "none"} />
                                    ))}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{fb.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default MessReviewsView;