import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import { useStudent } from '../../contexts/StudentContext';
import { postFeedback } from '../../services/api';

const Feedback = () => {
  const { student } = useStudent() || {};
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState({
    infrastructure: 0,
    cleanliness: 0,
    wardenSupport: 0,
    wifiInternet: 0,
    messQuality: 0,
  });
  const [comments, setComments] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const avg =
      Math.round(
        Object.values(ratings).reduce((a, b) => a + b, 0) /
          Object.keys(ratings).length
      ) || 0;

    try {
      await postFeedback({
        rating: avg,
        comments,
      }); // ✅ no studentId

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit feedback');
    }
  };

  if (submitted) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          maxWidth: '600px',
          margin: '40px auto',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: '#dcfce7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <ThumbsUp size={40} color="var(--success)" />
        </div>
        <h2>Thank You!</h2>
        <button
          className="btn btn-primary"
          onClick={() => setSubmitted(false)}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <h4>Rating Categories</h4>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {Object.keys(ratings).map((id) => (
              <div
                key={id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                  {id.replace(/([A-Z])/g, ' $1')}
                </span>
                <RatingStars
                  rating={ratings[id]}
                  setRating={(val) =>
                    setRatings({ ...ratings, [id]: val })
                  }
                  interactive
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <textarea
            className="form-control"
            rows="5"
            placeholder="Suggestions..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px' }}
          >
            Submit Feedback
          </button>
          {error && (
            <div style={{ color: 'var(--danger)', marginTop: 8 }}>
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Feedback;
