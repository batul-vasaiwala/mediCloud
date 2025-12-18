"use client";
import React, { useEffect, useState } from "react";
import styles from "./patient-analytics-cards.module.css";

export default function PatientAnalyticsCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patient"));

    if (!patient?.email) return;

    fetch(
      `http://localhost:5000/api/prescriptions/patient-analytics?email=${patient.email}`
    )
      .then(res => res.json())
      .then(data => {
        setStats(data);
      })
      .catch(err => console.error(err));
  }, []);

  if (!stats) return null;

  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <h3>Total Prescriptions</h3>
        <p>{stats.totalPrescriptions}</p>
      </div>

      <div className={styles.card}>
        <h3>Last Visit</h3>
        <p>
          {stats.lastVisit
            ? new Date(stats.lastVisit).toLocaleDateString()
            : "-"}
        </p>
      </div>

      <div className={styles.card}>
        <h3>Doctors Consulted</h3>
        <p>{stats.doctorsConsulted}</p>
      </div>
    </div>
  );
}
