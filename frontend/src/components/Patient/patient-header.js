"use client";
import React from "react";
import styles from "./patient-header.module.css";
import { Bell, Settings, LogOut } from "lucide-react";

export default function PatientHeader() {
  return (
    <header className={styles.header}>
      {/* LEFT SIDE */}
      <div className={styles.leftSection}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}>P</div>
          <div>
            <h1 className={styles.patientName}>Batul Vasaiwala</h1>
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

          <button className={styles.iconBtn}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
