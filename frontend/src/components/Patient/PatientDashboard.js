import React from "react";
import styles from "./PatientDashboard.module.css";

import PatientSidebar from "./patient-sidebar";
import PatientHeader from "./patient-header";
import PatientAnalyticsCards from "./patient-analytics-cards";
import PatientRecentPrescriptions from "./patient-recent-prescriptions";
import PatientMedicalHistory from "./patient-medical-history";

export default function PatientDashboard() {
  return (
    <div className={styles.container}>
      <PatientSidebar />

      <main className={styles.main}>
        <PatientHeader />
        <PatientAnalyticsCards />

        <div className={styles.grid}>
          <PatientRecentPrescriptions />
          <PatientMedicalHistory />
        </div>
      </main>
    </div>
  );
}
