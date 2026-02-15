'use client';

import React, { useState,useEffect } from 'react';
import './styles/Home.css';
import DoctorAuth from './Auth/DoctorAuth';   
import PatientAuth from './Auth/PatientAuth';
import VerifyUpload from './verify/VerifyUpload';
import AnalyticsDashboard from './analytics/AnalyticsDashboard';
import TrendChart from './AITrendChart';
import AIAnalyticsDashboard from './AIAnalytics/AnalyticsDashboard';
import Chatbot from './Chatbot';
// ------------------- Icons ------------------------

const DoctorIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="12" r="6" fill="#8B5CF6" />
    <path d="M24 20C16 20 10 26 10 32v8h28v-8c0-6-6-12-14-12z" fill="#8B5CF6" opacity="0.8" />
    <rect x="20" y="28" width="8" height="12" fill="#8B5CF6" opacity="0.6" />
  </svg>
);

const PatientIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="10" width="32" height="28" rx="4" fill="#EC4899" opacity="0.8" />
    <path d="M20 22h8" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 18v8" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="32" r="2" fill="#EC4899" />
    <circle cx="32" cy="32" r="2" fill="#EC4899" />
  </svg>
);

const AdminIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="6" y="8" width="36" height="32" rx="4" fill="#06B6D4" opacity="0.8" />
    <circle cx="14" cy="14" r="2" fill="#06B6D4" />
    <rect x="8" y="20" width="32" height="12" fill="#06B6D4" opacity="0.4" />
    <circle cx="24" cy="34" r="3" fill="#06B6D4" />
  </svg>
);

const VerifyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="16" fill="#F59E0B" opacity="0.8" />
    <path d="M18 25l4 4 8-8" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 8c-8.8 0-16 7.2-16 16" stroke="#F59E0B" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

// ------------------- MAIN PAGE ------------------------

export default function HomePage() {
  const [activePortal, setActivePortal] = useState(null);
const [showAI, setShowAI] = useState(false);
const [aiOpen, setAiOpen] = useState(false);
const [chatbotOpen, setChatbotOpen] = useState(false);

useEffect(() => {
  const interval = setInterval(() => {
    setAiOpen(true);
    setTimeout(() => setAiOpen(false), 1500);
  }, 3000);

  return () => clearInterval(interval);
}, []);
  // Handle opening a portal
  const handleEnterPortal = (id) => {
    setActivePortal(id);
  };

  // Handle going back to home screen
  const handleBack = () => {
    setActivePortal(null);
  };

  // SHOW DOCTOR PORTAL
  if (activePortal === 'doctor') {
    return <DoctorAuth onBack={handleBack} />;
  }
  else if(activePortal==='patient'){
    return <PatientAuth onBack={handleBack}/>;
  }
  else if (activePortal === 'verify') {
  return <VerifyUpload />
}
if (showAI) {
  return <AIAnalyticsDashboard onBack={() => setShowAI(false)} />;
}



  const cards = [
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Manage patient records, appointments, and prescriptions efficiently.',
      icon: <DoctorIcon />,
    },
    {
      id: 'patient',
      title: 'Patient',
      description: 'Access health records, book appointments, and track medications.',
      icon: <PatientIcon />,
    },
  
    {
      id: 'verify',
      title: 'Verify Prescription',
      description: 'Authenticate and validate prescription documents instantly.',
      icon: <VerifyIcon />,
    },
  ];

  return (
    <div className="homepage">
{/* ------------ NAVBAR ------------ */}
<nav className="navbar">
  <div className="nav-container">
    
    <div className="nav-logo">
      MediCloud
    </div>

    <ul className="nav-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#analytics">Analytics</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>

  </div>
</nav>

      {/* ------------ HERO SECTION ------------ */}
      <section className="hero-section" id="home" >
        <div className="hero-background"></div>

        <div className="hero-content">
          <h1 className="hero-title">Welcome to MediCloud</h1>
          <p className="hero-subtitle">A Modern, Secure Healthcare Management System</p>
<div
  className={`ai-ai-pill ${aiOpen ? 'active' : ''}`}
  onClick={() => setChatbotOpen(true)}
>


  <div className="ai-icon-circle">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a7 7 0 0 0-7 7v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a7 7 0 0 0-7-7z"/>
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
    </svg>
  </div>

  <span className="ai-pill-text">Medicloud AI</span>
</div>


          <div className="cards-grid">
            {cards.map(card => (
              <div key={card.id} className="card">
                <div className="card-icon">{card.icon}</div>
                <h2 className="card-title">{card.title}</h2>
                <p className="card-description">{card.description}</p>

                {/* FIX: OnClick added */}
               <button
  className="card-button"
  onClick={() => handleEnterPortal(card.id)}
>
  {card.id === 'verify' ? 'Upload to Verify' : 'Enter Portal'}
</button>

              </div>
              
            ))}
          </div>
        </div>
      </section>

{/* ------------ ANALYTICS DASHBOARD ------------ */}

<AnalyticsDashboard />

<section  id="analytics" className="ai-cta-section">
  <div className="ai-cta-box">
    <h3>Need deeper AI insights?</h3>
    <p>
      Explore AI-powered disease trends, predictions,
      and monthly analytics generated from real data.
    </p>
    <button
      className="ai-cta-button"
      onClick={() => setShowAI(true)}
    >
      View AI Analytics →
    </button>
  </div>
</section>



<Chatbot open={chatbotOpen} onClose={() => setChatbotOpen(false)} />

{/* ------------ ANALYTICS DASHBOARD ------------ */}
{/* <section id="ai-dashboard" className="ai-dashboard-section">
  <TrendChart />
</section> */}
      {/* ------------ ABOUT US ------------ */}
 <section id="about" className="about-section">
  <div className="about-overlay"></div>

  <div className="about-content">
    <h2 className="section-title">Powering the Future of Digital Healthcare</h2>

    <p className="about-text">
      MediCloud is a cloud-based healthcare management platform designed to
      streamline clinical workflows and enhance patient engagement.
      From secure digital prescriptions to AI-powered analytics,
      the system unifies medical data into a structured and intelligent ecosystem.
    </p>

    <p className="about-text">
      Built with scalability and security at its core, MediCloud enables
      hospitals, clinics, and practitioners to operate efficiently while
      maintaining strict healthcare data standards.
    </p>

    <div className="about-stats">
      <div>
        <h3>Secure</h3>
        <span>Encrypted Cloud Architecture</span>
      </div>

      <div>
        <h3>Intelligent</h3>
        <span>AI-Based Trend Analysis</span>
      </div>

      <div>
        <h3>Scalable</h3>
        <span>Built for Growing Healthcare Systems</span>
      </div>
    </div>
  </div>
</section>



      {/* ------------ FEATURES SECTION ------------ */}
   <section  id="features" className="features-section">
  <div className="features-wrapper">

    <h2 className="section-title">How MediCloud Works</h2>

    <div className="feature-steps">

      <div className="feature-step">
        <span>01</span>
        <div>
          <h4>Structured User Portals</h4>
          <p>
            Doctors and patients access personalized dashboards
            with role-specific functionality.
          </p>
        </div>
      </div>

      <div className="feature-step">
        <span>02</span>
        <div>
          <h4>Prescription Verification</h4>
          <p>
            Uploaded prescriptions are authenticated
            using digital validation systems.
          </p>
        </div>
      </div>

      <div className="feature-step">
        <span>03</span>
        <div>
          <h4>Analytics & AI Insights</h4>
          <p>
            Real-time dashboards and AI models identify
            trends and support decision-making.
          </p>
        </div>
      </div>

      <div className="feature-step">
        <span>04</span>
        <div>
          <h4>Scalable Cloud Deployment</h4>
          <p>
            Built for expansion across hospitals,
            clinics, and healthcare networks.
          </p>
        </div>
      </div>

    </div>

  </div>
</section>


      {/* ------------ CONTACT SECTION ------------ */}
      <section id="contact" className="contact-section">
        <h2 className="section-title">Contact Us</h2>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" className="contact-input" />
          <input type="email" placeholder="Your Email" className="contact-input" />
          <textarea placeholder="Your Message" className="contact-textarea"></textarea>
          <button className="contact-button">Send Message</button>
        </form>
      </section>

      {/* ------------ FOOTER ------------ */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} MediCloud — All Rights Reserved</p>
      </footer>
    </div>
  );
}
