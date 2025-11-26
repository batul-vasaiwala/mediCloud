import React from "react";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorAuth from "./components/Auth/DoctorAuth";
import DoctorDashboard from "./components/Doctor/DoctorDashboard";
import PatientAuth from "./components/Auth/PatientAuth";
import PatientDashboard from "./components/Patient/PatientDashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Home />} />
  
  {/* Doctor Login/Register page */}
  <Route path="/doctor-auth" element={<DoctorAuth />} />

  {/* PATIENT auth page */}
  <Route path="/patient-auth" element={<PatientAuth />} />

  {/* PROTECTED ROUTES */}
  <Route element={<ProtectedRoute />}>
    <Route path="/doctorDashboard" element={<DoctorDashboard />} />
    <Route path="/patientDashboard" element={<PatientDashboard />} />
  </Route>
</Routes>
    </Router>
  );
}

export default App;
