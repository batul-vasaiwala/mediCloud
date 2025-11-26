import React, { useState } from "react";
import "../styles/DoctorAuth.css";

export default function DoctorAuth({ onBack }) {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    specialization: "",
    license: "",
    signature: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "login") {
      // ----- LOGIN -----
      const res = await fetch("http://localhost:5000/api/doctors/login", {
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
    window.location.href = "/doctorDashboard";  // redirect
} else {
    alert(data.error || "Login failed");
}

      return;
    }

    // ---------- REGISTER ----------
    const registerForm = new FormData();
    registerForm.append("name", formData.name);
    registerForm.append("phone", formData.phone);
    registerForm.append("email", formData.email);
    registerForm.append("specialization", formData.specialization);
    registerForm.append("license", formData.license);
    registerForm.append("password", formData.password);
    registerForm.append("signature", formData.signature);

    const res = await fetch("http://localhost:5000/api/doctors/register", {
      method: "POST",
      body: registerForm,
    });

    const data = await res.json();
    console.log("Registration Response:", data);
  };

  return (
    <div className="doctor-portal">
   
      <div className="doctor-background">
        <div className="doctor-gradient"></div>
        <div className="doctor-blob doctor-blob-1"></div>
        <div className="doctor-blob doctor-blob-2"></div>
      </div>

      {/* Content */}
      <div className="doctor-container">
        {/* Header */}
        <div className="doctor-header">
          <button className="back-button" onClick={onBack}>
            ← Back to Home
          </button>
          <h1 className="doctor-title">Doctor Portal</h1>
        </div>

        {/* Card */}
        <div className="doctor-card">
          {/* Tabs */}
          <div className="doctor-tabs">
            <button
              className={`tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>

            <button
              className={`tab ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="doctor-form">
            {mode === "login" ? (
              <>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="form-button">
                  Sign In
                </button>

                <p className="form-link">
                  Don’t have an account?{" "}
                  <span onClick={() => setMode("register")}>
                    Register here
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Dr. John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Specialization</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="neurology">Neurology</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="general">General Practice</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Medical License Number</label>
                  <input
                    type="text"
                    name="license"
                    placeholder="LIC-123456789"
                    value={formData.license}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Upload Signature</label>
                  <input
                    type="file"
                    name="signature"
                    accept="image/png, image/jpeg"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        signature: e.target.files[0],
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="form-button">
                  Create Account
                </button>

                <p className="form-link">
                  Already have an account?{" "}
                  <span onClick={() => setMode("login")}>Sign in here</span>
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
