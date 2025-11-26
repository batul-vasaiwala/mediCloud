import React from "react";
import styles from "./patient-sidebar.module.css";

export default function PatientSidebar() {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>MediCloud</h2>

      <nav className={styles.menu}>
        <a className={styles.active}>Dashboard</a>
        <a>Prescriptions</a>
        <a>Medical History</a>
        <a>Profile</a>
        <a>Settings</a>
      </nav>
    </aside>
  );
}
