import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Mail, Lock, UserCheck, Briefcase, 
  ArrowRight, Sparkles, X, KeyRound, ShieldCheck,
  ChevronRight, Loader2
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Enhanced Particle System
 * Using deep blues and subtle transparency to maintain depth without white tones.
 */
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 25;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.init();
      }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.fill();
      }
    }

    const setup = () => {
      resize();
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    setup();
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#020617' }} />;
};

const App = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (role === "student") {
        const studentCreds = {
          email: email,
          password: password,
        };

        const res = await axios.post(
          "http://localhost:5000/api/auth/student/login",
          studentCreds
        );

        if (res?.data?.token) {
          localStorage.setItem("token", res.data.token);
        }

        if (res?.data?.data) {
          localStorage.setItem("studentData", JSON.stringify(res.data.data));
        }
        
        navigate("/student-dashboard");
      } else {
        const adminCreds = {
          email: email,
          password: password,
        };

        const res = await axios.post(
          "http://localhost:5000/api/auth/admin/login",
          adminCreds
        );

        if (res?.data?.token) {
          localStorage.setItem("token", res.data.token);
        }

        localStorage.setItem("adminEmail", adminCreds.email);
        navigate("/admin-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --bg-deep: #020617;
          --bg-card: rgba(15, 23, 42, 0.75);
          --primary: #3b82f6;
          --primary-glow: rgba(59, 130, 246, 0.3);
          --text-main: #f1f5f9;
          --text-dim: #94a3b8;
          --border: rgba(255, 255, 255, 0.06);
          --input-bg: rgba(0, 0, 0, 0.25);
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          background-color: var(--bg-deep);
          overflow-x: hidden;
        }

        .app-root {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          position: relative;
        }

        /* Ambient Glows */
        .glow-sphere {
          position: fixed;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          z-index: 1;
          pointer-events: none;
        }
        .glow-1 { top: -10%; right: -10%; }
        .glow-2 { bottom: -10%; left: -10%; background: radial-gradient(circle, rgba(30, 58, 138, 0.1) 0%, transparent 70%); }

        .container {
          width: 100%;
          max-width: 440px;
          z-index: 10;
          animation: pageIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes pageIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Branding */
        .brand {
          text-align: center;
          margin-bottom: 32px;
        }

        .icon-hex {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          margin: 0 auto 16px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px var(--primary-glow);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform: rotate(-5deg);
        }

        .brand h1 {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .brand span {
          color: var(--text-dim);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Card System */
        .glass-card {
          background: var(--bg-card);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 28px;
          padding: 40px;
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6);
        }

        /* Switcher */
        .role-switch {
          display: flex;
          background: var(--input-bg);
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 32px;
          position: relative;
          border: 1px solid var(--border);
        }

        .switch-pill {
          position: absolute;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          top: 4px;
          transition: transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .role-btn {
          flex: 1;
          border: none;
          background: none;
          padding: 12px;
          color: var(--text-dim);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: color 0.3s;
        }

        .role-btn.active { color: #fff; }

        /* Form Controls */
        .input-group {
          margin-bottom: 20px;
          position: relative;
        }

        .input-field {
          width: 100%;
          background: var(--input-bg);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 16px 16px 16px 48px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .input-field::placeholder { color: #475569; }

        .input-field:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(59, 130, 246, 0.03);
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          transition: color 0.3s;
        }

        .input-field:focus + .input-icon {
          color: var(--primary);
        }

        /* Divider styling */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 32px 0 20px;
        }

        .line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
        }

        .divider-text {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* Buttons */
        .btn-primary {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 14px;
          padding: 16px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 10px 20px -5px var(--primary-glow);
          margin-top: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.1);
          box-shadow: 0 15px 30px -5px var(--primary-glow);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-outline {
          width: 100%;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-dim);
          border-radius: 14px;
          padding: 14px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-outline:hover {
          border-color: rgba(255, 255, 255, 0.2);
          color: white;
          background: rgba(255, 255, 255, 0.02);
        }

        .link-text {
          display: block;
          text-align: right;
          color: var(--primary);
          font-size: 13px;
          text-decoration: none;
          font-weight: 600;
          margin: -12px 0 24px;
        }

        /* Modal */
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.95);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 100;
        }

        .modal {
          background: #0f172a;
          border: 1px solid var(--border);
          border-radius: 32px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          position: relative;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
          animation: modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalPop {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .otp-box {
          width: 100%;
          background: #020617;
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: 0.4em;
          color: var(--primary);
          margin: 24px 0;
          text-transform: uppercase;
        }

        .otp-box:focus {
          outline: none;
          border-color: var(--primary);
        }

        /* Prevent white background on autofill (Chrome/Safari) */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #1e293b inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div className="glow-sphere glow-1" />
      <div className="glow-sphere glow-2" />
      <ParticleBackground />

      <div className="container">
        <header className="brand">
          <div className="icon-hex">
            <Home color="white" size={32} />
          </div>
          <h1>Hostel Hub</h1>
          <span>Hostel Management System</span>
        </header>

        <main className="glass-card">
          <div className="role-switch">
            <div 
              className="switch-pill" 
              style={{ transform: role === 'admin' ? 'translateX(100%)' : 'translateX(0)' }}
            />
            <button 
              className={`role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              <UserCheck size={18} /> Student
            </button>
            <button 
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <Briefcase size={18} /> Admin
            </button>
          </div>

          <form onSubmit={submitHandler} className="form-container">
            <div className="input-group">
              <input 
                type="text" 
                className="input-field" 
                placeholder={role === 'admin' ? "Admin Identifier" : "Student Email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="input-icon" size={20} />
            </div>

            <div className="input-group">
              <input 
                type="password" 
                className="input-field" 
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="input-icon" size={20} />
            </div>

            <a href="#" className="link-text" onClick={(e) => e.preventDefault()}>
              Forgot Access?
            </a>

            <button className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Sign In <ChevronRight size={18} /></>
              )}
            </button>
          </form>

          {/* New Divider Section */}
          <div className="divider">
            <div className="line" />
            <span className="divider-text">New to Hostel Hub?</span>
            <div className="line" />
          </div>

          <button className="btn-outline" onClick={() => setIsModalOpen(true)}>
            <Sparkles size={16} />
            Setup Your Hostel
          </button>
        </main>
      </div>

      {isModalOpen && (
        <div className="overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button 
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 20px', color: '#3b82f6', justifyContent: 'center' }}>
                <KeyRound size={28} />
              </div>
              <h2 style={{ fontSize: '1.4rem', color: '#f1f5f9', marginBottom: 8 }}>Activation Key</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.5 }}>
                Enter the unique 8-character system key provided by your institution.
              </p>

              <input 
                className="otp-box" 
                placeholder="HUB-0000"
                maxLength={8}
                value={accessCode}
                onChange={e => {
                  setAccessCode(e.target.value.toUpperCase());
                  if (accessCodeError) setAccessCodeError('');
                }}
                autoFocus
              />

              <button 
                className="btn-primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  if (accessCode === '17102006') {
                    navigate('/hostel-setup');
                    setIsModalOpen(false);
                  } else {
                    setAccessCodeError('Invalid access code. Please try again.');
                  }
                }}
                disabled={!accessCode}
              >
                Verify Hub <ShieldCheck size={18} />
              </button>
              {accessCodeError && (
                <p style={{
                  color: '#ef4444',
                  margin: '0.5rem 0 0',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                }}>{accessCodeError}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;