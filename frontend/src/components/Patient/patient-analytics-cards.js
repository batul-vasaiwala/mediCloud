import React from "react";
import styles from "./patient-analytics-cards.module.css";

export default function PatientAnalyticsCards() {
  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <h3>Total Prescriptions</h3>
        <p>12</p>
      </div>

      <div className={styles.card}>
        <h3>Last Visit</h3>
        <p>15 Jan, 2025</p>
      </div>

      <div className={styles.card}>
        <h3>Doctors Consulted</h3>
        <p>4</p>
      </div>
    </div>
  );
}
