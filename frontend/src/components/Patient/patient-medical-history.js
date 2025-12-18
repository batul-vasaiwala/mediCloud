"use client";
import React, { useEffect, useState } from "react";
import styles from "./patient-medical-history.module.css";

export default function PatientMedicalHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patient"));

    if (!patient?.email) {
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/prescriptions/patient-medical-history?email=${patient.email}`
    )
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (history.length === 0)
    return <p>No medical history found</p>;

  return (
    <section className={styles.section}>
      <h2>Medical History</h2>

      <div className={styles.list}>
        {history.map((item, index) => (
          <div key={index} className={styles.item}>
            <div>
              <h4>{item.diagnosis}</h4>
              <p>
                Diagnosed:{" "}
                {new Date(item.firstDiagnosed).getFullYear()}
              </p>
            </div>

            <button className={styles.viewBtn}>
              View
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
