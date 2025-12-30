"use client";
import React, { useEffect, useState } from "react";
import styles from "./patient-recent-prescriptions.module.css";
import { Eye, Share2, X } from "lucide-react";
import QRCode from "react-qr-code";
const API_BASE_URL = "https://nonspirited-marni-unhugged.ngrok-free.dev";




export default function PatientRecentPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
const [shareLink, setShareLink] = useState("");


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
  {/* View */}
  <a
    href={`${API_BASE_URL}/api/prescriptions/download/${p._id}`}

    target="_blank"
    rel="noreferrer"
    className={styles.iconBtn}
  >
    <Eye size={18} />
  </a>

  {/* Share */}
  <button
    className={styles.iconBtn}
    onClick={() => {
      setShareLink(
  `${API_BASE_URL}/api/prescriptions/download/${p._id}`
);

      setShowShare(true);
    }}
  >
    <Share2 size={18} />
  </button>
</div>

          </div>
        ))}
      </div>
      {showShare && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <button
        className={styles.closeBtn}
        onClick={() => setShowShare(false)}
      >
        <X size={18} />
      </button>

      <h3>Share Prescription</h3>

<QRCode value={shareLink} size={180} />



      <p className={styles.shareLink}>{shareLink}</p>

      <a
        href={shareLink}
        target="_blank"
        rel="noreferrer"
        className={styles.openLink}
      >
        Open Prescription
      </a>
    </div>
  </div>
)}

    </section>
  );
}
