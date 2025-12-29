import React from "react";
import { useEffect, useRef } from "react";
import "./WhyChooseSection.css";
import Ballpit from "./Ballpit/Ballpit";

const features = [
  {
    title: "Fast Room Allotment",
    description: "Automated room allocation removes manual errors and saves time.",
    icon: "🚀",
  },
  {
    title: "Smart Mess Management",
    description: "Daily attendance, meal tracking, and transparent billing.",
    icon: "🍽️",
  },
  {
    title: "Student Dashboard",
    description: "Students can view dues, notices, mess status, and ID details.",
    icon: "📊",
  },
  {
    title: "Admin Control Panel",
    description: "Manage everything from one centralized dashboard.",
    icon: "🎛️",
  },
];

export default function WhyChooseSection() {
  const ballpitRef = useRef(null);

  // Handle scroll effect for the ballpit
  useEffect(() => {
    const handleScroll = () => {
      if (ballpitRef.current) {
        const rect = ballpitRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
          const scrollRatio = 1 - Math.max(0, Math.min(1, rect.top / window.innerHeight));
          ballpitRef.current.style.opacity = scrollRatio;
          ballpitRef.current.style.transform = `translateY(${(1 - scrollRatio) * 50}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="why-section">
      <div className="ballpit-container" ref={ballpitRef}>
        <Ballpit 
          count={150}
          gravity={0.4}
          friction={0.9}
          wallBounce={0.9}
          followCursor={true}
          colors={['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd']}
          minSize={0.3}
          maxSize={0.8}
        />
      </div>
      
      <div className="why-content">
        <h2>Why Choose Hostel-Hub?</h2>
        <p>
          Hostel-Hub simplifies hostel management with automated allotment,
          digital records, mess management, and secure student portals— 
          all in one powerful panel.
        </p>

        <div className="why-grid">
          {features.map((feature, index) => (
            <div key={index} className="why-card">
              <div className="card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
