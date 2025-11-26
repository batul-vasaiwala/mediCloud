"use client"
import React from "react";
import styles from "./patient-recent-prescriptions.module.css";
import { Eye, Share2, QrCode } from "lucide-react";

export default function PatientRecentPrescriptions() {
  const items = [
    { doctor: "Dr. Sharma", date: "10 Jan 2025" },
    { doctor: "Dr. Rao", date: "5 Jan 2025" },
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recent Prescriptions</h2>

      <div className={styles.list}>
        {items.map((it, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.left}>
              <h4 className={styles.doctor}>{it.doctor}</h4>
              <p className={styles.date}>Prescribed on: {it.date}</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.iconBtn}>
                <Eye size={18} />
              </button>
              <button className={styles.iconBtn}>
                <Share2 size={18} />
              </button>
              <button className={styles.iconBtn}>
                <QrCode size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
