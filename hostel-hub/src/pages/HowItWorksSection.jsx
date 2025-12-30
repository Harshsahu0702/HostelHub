import React, { useEffect, useState, useRef } from 'react';
import { FaBuilding, FaUserCog, FaUserGraduate, FaArrowRight } from 'react-icons/fa';
import { BsBuilding, BsFillPersonCheckFill } from 'react-icons/bs';
import { RiAdminFill } from 'react-icons/ri';

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
      icon: <BsBuilding className="step-icon" />,
      color: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(99, 102, 241, 0.2))',
      iconColor: '#8b5cf6',
      borderColor: 'rgba(139, 92, 246, 0.5)'
    },
    {
      id: "02",
      title: "Admin Operations",
      description: "Admin login karke students ko register karein aur real-time availability ke hisaab se rooms allot karein.",
      icon: <RiAdminFill className="step-icon" />,
      color: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2))',
      iconColor: '#ec4899',
      borderColor: 'rgba(236, 72, 153, 0.5)'
    },
    {
      id: "03",
      title: "Student Portal",
      description: "Students apne dashboard se room details aur updates dekh sakte hain aur administration se digitally jude reh sakte hain.",
      icon: <BsFillPersonCheckFill className="step-icon" />,
      color: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
      iconColor: '#10b981',
      borderColor: 'rgba(16, 185, 129, 0.5)'
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
      width: '100px',
      height: '100px',
      borderRadius: '50%', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '30px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform, box-shadow',
      transform: 'translateZ(0)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
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
              .workflow-card:hover {
                transform: translateY(-10px) scale(1.02) !important;
                border-color: ${colors.primary} !important;
                background: rgba(17, 24, 39, 0.8) !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                backdrop-filter: blur(16px);
              }
              
              .workflow-card:hover .icon-box {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
              }
              
              .step-icon {
                font-size: 2.5rem;
                transition: all 0.3s ease;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
              }
              
              .workflow-card:hover .step-icon {
                transform: scale(1.15);
                filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
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
                <div className="icon-box" style={{
                  ...styles.iconCircle,
                  background: step.color,
                  border: `1px solid ${step.borderColor}`,
                  transform: 'rotateZ(-5deg)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    color: step.iconColor,
                    fontSize: '2.5rem',
                    transition: 'all 0.3s ease'
                  }}>
                    {React.cloneElement(step.icon, { 
                      style: { 
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                        transition: 'all 0.3s ease'
                      } 
                    })}
                  </div>
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