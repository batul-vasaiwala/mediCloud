"use client";
import React, { useEffect, useState } from "react";
import styles from "./patient-header.module.css";
import { Bell, Settings, LogOut } from "lucide-react";

export default function PatientHeader() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const storedPatient = localStorage.getItem("patient");
    if (storedPatient) {
      setPatient(JSON.parse(storedPatient));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("patient");
    window.location.href = "/login";
  };

  if (!patient) return null; // prevent crash before data loads

  return (
    <header className={styles.header}>
      {/* LEFT SIDE */}
      <div className={styles.leftSection}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            {patient.fullName.charAt(0)}
          </div>
          <div>
            <h1 className={styles.patientName}>
              {patient.fullName}
            </h1>
            <p className={styles.subtext}>Patient Dashboard</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.rightSection}>
        <div className={styles.actions}>
          <button className={styles.iconBtn}>
            <Bell size={20} />
            <span className={styles.badge}>2</span>
          </button>

          <button className={styles.iconBtn}>
            <Settings size={20} />
          </button>

          <button
            className={styles.iconBtn}
            onClick={handleLogout}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
