import React from "react";
import styles from "./patient-medical-history.module.css";

export default function PatientMedicalHistory() {
  return (
    <section className={styles.section}>
      <h2>Medical History</h2>

      <div className={styles.list}>
        <div className={styles.item}>
          <div>
            <h4>Hypertension</h4>
            <p>Diagnosed: 2023</p>
          </div>
          <button className={styles.viewBtn}>View</button>
        </div>

        <div className={styles.item}>
          <div>
            <h4>Type 2 Diabetes</h4>
            <p>Diagnosed: 2021</p>
          </div>
          <button className={styles.viewBtn}>View</button>
        </div>
      </div>
    </section>
  );
}
