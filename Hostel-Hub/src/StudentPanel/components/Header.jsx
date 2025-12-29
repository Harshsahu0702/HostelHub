import React, { useState } from 'react';
import { useStudent } from '../../contexts/StudentContext';

const Header = ({ title }) => {
  const { student, loading } = useStudent() || {};
  const [open, setOpen] = useState(false);

  const name = student?.fullName || 'Not Found';
  const room = student?.roomAllocated || 'Not Found';
  const email = student?.email || 'Not Found';
  const phone = student?.phoneNumber || 'Not Found';
  const course = student?.course || 'Not Found';
  const year = student?.year || 'Not Found';

  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || 'NF';

  return (
    <header className="header">
      <div style={{display:'flex', alignItems:'center'}}>
        <h2 style={{margin:0, fontSize: '1.5rem', fontWeight: 700}}>{title}</h2>
      </div>
      <div style={{display:'flex', alignItems:'center', gap: '12px', position: 'relative'}}>
        <div style={{textAlign:'right'}}>
          <div style={{fontWeight:700, fontSize:'0.85rem'}}>{loading ? 'Loading...' : name}</div>
          <div style={{fontSize:'0.7rem', color: 'var(--text-muted)'}}>Room: {loading ? 'Loading...' : room}</div>
        </div>
        <div onClick={() => setOpen(!open)} style={{cursor:'pointer', width:36, height:36, borderRadius: '50%', background: '#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color: 'var(--primary)', fontSize:'0.8rem'}}>
          {initials}
        </div>

        {open && (
          <div style={{position:'absolute', right:0, top:56, background:'#fff', border:'1px solid var(--border)', padding:'12px', borderRadius:8, width:220, zIndex:40}}>
            <div style={{fontWeight:700, marginBottom:6}}>{name}</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{email}</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>{phone}</div>
            <hr style={{margin:'8px 0', border:'none', borderTop:'1px solid var(--border)'}} />
            <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Course: {course}</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Year: {year}</div>
            <div style={{fontSize:'0.85rem', color:'var(--text-muted)'}}>Room: {room}</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

