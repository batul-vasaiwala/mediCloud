"use client";
import React, { useEffect, useState } from "react";
import styles from "./patient-recent-prescriptions.module.css";
import { Eye } from "lucide-react";

export default function PatientRecentPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patient = JSON.parse(localStorage.getItem("patient"));

    if (!patient?.email) {
      console.error("No patient email found");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/prescriptions/patient-list?email=${patient.email}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched prescriptions:", data);
        setPrescriptions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (prescriptions.length === 0)
    return <p>No prescriptions found</p>;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Recent Prescriptions</h2>

      <div className={styles.list}>
        {prescriptions.map((p) => (
          <div key={p._id} className={styles.item}>
            <div className={styles.left}>
              <h4 className={styles.doctor}>
  Dr. {p.doctorId?.name || "Unknown Doctor"}
</h4>

<p className={styles.specialization}>
  {p.doctorId?.specialization}
</p>

<p className={styles.diagnosis}>
  Diagnosis: {p.diagnosis || "-"}
</p>

              <p className={styles.date}>
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className={styles.actions}>
              <a
                href={`http://localhost:5000/api/prescriptions/download/${p._id}`}
                target="_blank"
                rel="noreferrer"
                className={styles.iconBtn}
              >
                <Eye size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
