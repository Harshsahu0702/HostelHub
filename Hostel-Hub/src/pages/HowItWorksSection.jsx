import React, { useEffect, useState, useRef } from 'react';

/**
 * HowItWorks Component
 * Theme: Deep Blackish-Blue with High-Contrast Cards
 * Animation: GSAP powered 360-degree smooth 3D rotation (Optimized)
 */
const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isGsapLoaded, setIsGsapLoaded] = useState(false);

  // GSAP script ko load karne ke liye useEffect
  useEffect(() => {
    setIsVisible(true);
    
    // GSAP CDN load kar rahe hain for smooth animations
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => setIsGsapLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const steps = [
    {
      id: "01",
      title: "Hostel Setup",
      description: "Apne hostel ka profile banayein aur secure admin credentials generate karein digital management shuru karne ke liye.",
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: "02",
      title: "Admin Operations",
      description: "Admin login karke students ko register karein aur real-time availability ke hisaab se rooms allot karein.",
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="17" y1="11" x2="23" y2="11" />
        </svg>
      )
    },
    {
      id: "03",
      title: "Student Portal",
      description: "Students apne dashboard se room details aur updates dekh sakte hain aur administration se digitally jude reh sakte hain.",
      icon: (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    }
  ];

  const colors = {
    bg: '#00020a', 
    cardBg: '#0f172a', // Pehle se thoda light aur bluer contrast ke liye
    primary: '#3b82f6',
    secondary: '#60a5fa',
    textHeader: '#f8fafc',
    textMuted: '#94a3b8',
    border: 'rgba(59, 130, 246, 0.2)' 
  };

  // GSAP Hover Logic - Fixed for all cards and faster duration
  const handleMouseEnter = (e) => {
    if (window.gsap) {
      window.gsap.to(e.currentTarget, { 
        rotationY: 360, 
        duration: 0.7, // Fast 360 rotation
        ease: "power2.out",
        borderColor: colors.secondary,
        backgroundColor: '#162447',
        boxShadow: "0 0 50px rgba(59, 130, 246, 0.35)",
        overwrite: "auto"
      });
    }
  };

  const handleMouseLeave = (e) => {
    if (window.gsap) {
      window.gsap.to(e.currentTarget, { 
        rotationY: 0, 
        duration: 0.6, 
        ease: "power2.inOut",
        borderColor: colors.border,
        backgroundColor: colors.cardBg,
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
        overwrite: "auto"
      });
    }
  };

  const styles = {
    section: {
      padding: '120px 24px',
      backgroundColor: colors.bg,
      fontFamily: '"Inter", sans-serif',
      color: colors.textHeader,
      position: 'relative',
      overflow: 'hidden',
      perspective: '2000px' 
    },
    glow1: {
      position: 'absolute',
      top: '10%',
      left: '5%',
      width: '400px',
      height: '400px',
      backgroundColor: 'rgba(59, 130, 246, 0.12)',
      filter: 'blur(100px)',
      borderRadius: '50%',
      zIndex: 1,
      animation: 'moveGlow 20s infinite alternate'
    },
    glow2: {
      position: 'absolute',
      bottom: '10%',
      right: '5%',
      width: '500px',
      height: '500px',
      backgroundColor: 'rgba(96, 165, 250, 0.08)',
      filter: 'blur(120px)',
      borderRadius: '50%',
      zIndex: 1,
      animation: 'moveGlow 25s infinite alternate-reverse'
    },
    container: {
      maxWidth: '1250px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2
    },
    header: {
      textAlign: 'center',
      marginBottom: '80px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '900',
      marginBottom: '15px',
      background: `linear-gradient(to bottom, #fff 40%, ${colors.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.03em'
    },
    row: {
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
      gap: '0px',
      flexWrap: 'nowrap',
      perspective: '1500px'
    },
    card: {
      flex: 1,
      backgroundColor: colors.cardBg,
      padding: '65px 45px',
      minHeight: '480px',
      borderRadius: '35px',
      border: `1px solid ${colors.border}`,
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
      // Note: transition removed for transform to avoid conflict with GSAP
      transition: 'opacity 0.6s, background 0.3s, border-color 0.3s, box-shadow 0.3s',
      transformStyle: 'preserve-3d',
      cursor: 'pointer',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
      position: 'relative'
    },
    iconCircle: {
      width: '85px',
      height: '85px',
      borderRadius: '24px', 
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      color: colors.secondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '35px',
      border: `1px solid rgba(59, 130, 246, 0.3)`,
      boxShadow: '0 0 30px rgba(59, 130, 246, 0.15)',
      transform: 'rotateZ(-5deg)'
    },
    cardTitle: {
      fontSize: '1.65rem',
      fontWeight: '800',
      marginBottom: '20px',
      letterSpacing: '-0.02em',
      color: '#fff'
    },
    cardDesc: {
      fontSize: '1.05rem',
      color: colors.textMuted,
      lineHeight: '1.8',
      margin: 0,
      maxWidth: '300px'
    },
    arrowContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 25px',
      opacity: 0.3
    }
  };

  return (
    <section style={styles.section}>
      {/* Background Animated Glows */}
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>
      
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>System Workflow</h2>
          <p style={{color: colors.textMuted, fontSize: '1.2rem', fontWeight: '500'}}>
            Simple, automated, aur digital. Hostel manage karna hua ab aur bhi aasaan.
          </p>
        </div>

        <div className="workflow-row" style={styles.row}>
          <style>
            {`
              @keyframes moveGlow {
                0% { transform: translate(0, 0); }
                100% { transform: translate(120px, 60px); }
              }

              .arrow-svg {
                color: ${colors.primary};
                animation: pulse 2.5s infinite;
              }

              @keyframes pulse {
                0% { opacity: 0.1; transform: translateX(0); }
                50% { opacity: 0.8; transform: translateX(10px); }
                100% { opacity: 0.1; transform: translateX(0); }
              }

              @media (max-width: 1024px) {
                .workflow-row {
                  flex-direction: column !important;
                  align-items: center !important;
                  gap: 35px;
                }
                .arrow-connector {
                  transform: rotate(90deg);
                  padding: 15px 0 !important;
                }
                .workflow-card {
                  width: 100% !important;
                  max-width: 500px;
                  min-height: 420px;
                }
              }
            `}
          </style>

          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div 
                className="workflow-card"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  ...styles.card,
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <div className="icon-box" style={{...styles.iconCircle, transition: 'all 0.4s ease'}}>
                  {step.icon}
                </div>
                <h3 style={styles.cardTitle}>{step.title}</h3>
                <p style={styles.cardDesc}>{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="arrow-connector" style={styles.arrowContainer}>
                  <svg className="arrow-svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return <HowItWorks />;
}