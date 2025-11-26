'use client';

import React, { useState } from 'react';
import './styles/Home.css';
import DoctorAuth from './Auth/DoctorAuth';   
import PatientAuth from './Auth/PatientAuth';

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
      id: 'admin',
      title: 'Admin',
      description: 'Oversee operations, manage data, and monitor system activity.',
      icon: <AdminIcon />,
    },
    {
      id: 'verify',
      title: 'Verify Prescription',
      description: 'Authenticate prescription documents instantly.',
      icon: <VerifyIcon />,
    },
  ];

  return (
    <div className="homepage">

      {/* ------------ HERO SECTION ------------ */}
      <section className="hero-section">
        <div className="hero-background"></div>

        <div className="hero-content">
          <h1 className="hero-title">Welcome to MediCloud</h1>
          <p className="hero-subtitle">A Modern, Secure Healthcare Management System</p>

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
                  Enter Portal
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------ ABOUT US ------------ */}
      <section className="about-section">
        <h2 className="section-title">About MediCloud</h2>
        <p className="section-text">
          MediCloud is a cloud–powered healthcare platform designed to make medical
          workflows smarter and easier. From digital prescriptions to secure data
          management, we bring modern solutions to hospitals, doctors, and patients.
        </p>
      </section>

      {/* ------------ FEATURES SECTION ------------ */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>

        <div className="features-grid">
          <div className="feature-box">
            <h3>⚡ Fast & Reliable</h3>
            <p>Optimized for speed, ensuring quick access to medical data.</p>
          </div>

          <div className="feature-box">
            <h3>🔒 Secure</h3>
            <p>Your records are encrypted and stored safely on the cloud.</p>
          </div>

          <div className="feature-box">
            <h3>🌐 Accessible</h3>
            <p>Use from any device without installation — just log in.</p>
          </div>

          <div className="feature-box">
            <h3>🤝 User Friendly</h3>
            <p>A smooth and simple UI for doctors, patients, and admins.</p>
          </div>
        </div>
      </section>

      {/* ------------ CONTACT SECTION ------------ */}
      <section className="contact-section">
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
