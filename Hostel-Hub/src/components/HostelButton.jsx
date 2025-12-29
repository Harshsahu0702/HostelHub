import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccessCodeModal = ({ isOpen, onClose }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accessCode === '17102006') {
      navigate('/hostel-setup');
      onClose();
    } else {
      setError('Invalid access code. Please try again.');
    }
  };

 if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1001,
    }}>
       {/* Rest of your modal JSX remains the same */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '50%',
          }}
        >
          ×
        </button>
        <h2 style={{
          color: 'white',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontSize: '1.5rem',
        }}>Enter Access Code</h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => {
              setAccessCode(e.target.value);
              setError('');
            }}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
            }}
            placeholder="Enter access code"
            autoFocus
          />
          {error && <p style={{
            color: '#ef4444',
            margin: '0.5rem 0 0',
            fontSize: '0.9rem',
            textAlign: 'center',
          }}>{error}</p>}
          <button type="submit" style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '0.5rem',
          }}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const HostelButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="hostel-btn-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');

        .hostel-btn-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding: 20px 40px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .simple-btn {
          position: relative;
          padding: 20px 50px;
          font-size: 1.5rem;
          font-family: 'Orbitron', sans-serif;
          font-weight: 600;
          color: #2962ff;
          background: rgba(4, 12, 24, 0.95);
          border: 2px solid #2962ff;
          border-radius: 50px;
          cursor: pointer;
          outline: none;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          z-index: 1;
          box-shadow: 0 0 10px rgba(41, 98, 255, 0.2);
        }

        .simple-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 40px rgba(98, 0, 234, 0.5);
        }

        .icon-arrow {
          display: inline-block;
          margin-left: 12px;
          transition: transform 0.3s ease;
        }

        .simple-btn:hover .icon-arrow {
          transform: translateX(8px);
        }
      `}</style>

      <button 
        className="simple-btn" 
        onClick={() => setIsModalOpen(true)}
      >
        Setup Your Hostel
        <span className="icon-arrow">➜</span>
      </button>

      <AccessCodeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default HostelButton;