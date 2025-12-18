'use client';

import React, { useState } from 'react';
import '../styles/PatientAuth.css';

export default function PatientAuth({ onBack }) {
  // mode is now "login" or "register" — cleaner
  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------- LOGIN ----------
    if (mode === "login") {
      const res = await fetch("http://localhost:5000/api/patients/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (data.success) {
        localStorage.setItem("token", data.token);
         // store patient object returned by backend
  localStorage.setItem(
    "patient",
    JSON.stringify(data.patient)
  );

        window.location.href = "/patientDashboard";
      } else {
        alert(data.error || "Login failed");
      }

      return; 
    }

    // ---------- REGISTER ----------
    const res = await fetch("http://localhost:5000/api/patients/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        password: formData.password
      }),
    });

    const data = await res.json();
    console.log("Registration Response:", data);

    if (data.success) {
       localStorage.setItem("token", data.token);
  localStorage.setItem(
    "patient",
    JSON.stringify(data.patient)
  );

      alert("Registration successful!");
      window.location.href = "/patientDashboard";
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="portal-container patient-portal">
      <div className="portal-background"></div>

      <div className="portal-wrapper">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>

        <div className="portal-card">
          <div className="portal-header">
            <h1 className="portal-title">Patient Portal</h1>
            <p className="portal-subtitle">Access your health records and appointments</p>
          </div>

          <div className="tab-container">
            <button
              className={`tab-button ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>

            <button
              className={`tab-button ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === "login" ? (
            <form className="portal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <button type="submit" className="portal-submit-button">
                Login to Portal
              </button>
              <a href="#" className="forgot-password">Forgot password?</a>
            </form>
          ) : (
            /* REGISTER FORM */
            <form className="portal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Create Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <button type="submit" className="portal-submit-button">
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
