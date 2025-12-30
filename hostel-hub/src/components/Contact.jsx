import React, { useState } from 'react';

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#1E293B',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1000,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Contact Us
      </button>
    );
  }

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
    }} onClick={() => setIsOpen(false)}>
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '400px',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
      }} onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => setIsOpen(false)}
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
        }}>Contact Us</h2>
        
        <div style={{ margin: '1.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '10px',
              borderRadius: '10px',
              marginRight: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <a href="mailto:harshsahu10072006@gmail.com" style={{ color: '#E0E7FF', textDecoration: 'none' }}>
              harshsahu10072006@gmail.com
            </a>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '10px',
              borderRadius: '10px',
              marginRight: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22.0005 20.1982 21.9157 20.4703 21.757 20.7006C21.5982 20.9309 21.3729 21.1092 21.112 21.211C20.7173 21.3654 20.241 21.456 19.74 21.486C19.4975 21.5003 19.2539 21.5003 19.0114 21.486C14.7009 21.24 10.7612 19.3209 7.80021 16.1998C4.83923 13.0787 3.1245 8.96024 3.01421 4.65C2.99985 4.40749 2.99985 4.16385 3.01399 3.92143C3.044 3.4195 3.1346 2.9425 3.28921 2.548C3.43968 2.16488 3.69984 1.83366 4.03668 1.59888C4.37352 1.3641 4.77179 1.23682 5.18021 1.23438H8.18021C8.54021 1.23438 8.87321 1.4375 9.05021 1.7635L10.8132 5.12158C10.9194 5.321 10.9654 5.5472 10.945 5.7719C10.9246 5.9966 10.8387 6.20967 10.6987 6.3835L8.96021 8.5435C9.11621 9.2835 9.41521 10.0165 9.87421 10.7165C10.3032 11.4005 10.8572 12.0025 11.5072 12.4925C12.1002 12.9425 12.8192 13.3335 13.5152 13.5785L15.6162 11.8835C15.7901 11.7435 16.0072 11.6575 16.2322 11.6375C16.4572 11.6175 16.6832 11.6635 16.8812 11.7695L20.2362 13.5315C20.5622 13.7085 20.7652 14.0425 20.7652 14.4025V17.4025C20.7652 17.8025 20.5652 18.2265 20.2402 18.4915C19.9152 18.7565 19.5402 18.7965 19.2402 18.7265" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <a href="tel:+916203132092" style={{ color: '#E0E7FF', textDecoration: 'none' }}>
              +91 6203132092
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
