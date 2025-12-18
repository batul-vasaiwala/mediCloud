import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./recent-prescriptions.module.css";

export default function RecentPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const doctor = JSON.parse(localStorage.getItem("doctor"));
  const doctorId = doctor?._id;

  const openPrescription = (prescriptionId) => {
  window.open(
    `http://localhost:5000/api/prescriptions/download/${prescriptionId}`,
    "_blank"
  );
};

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/prescriptions/recent/${doctorId}`
        );
        setPrescriptions(res.data);
      } catch (err) {
        console.error("Failed to load recent prescriptions", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchRecent();
  }, [doctorId]);

  if (loading) return <p>Loading recent prescriptions...</p>;
  if (prescriptions.length === 0)
    return <p>No recent prescriptions</p>;

  return (
    <div className={styles.prescriptions}>
      <h2 className={styles.title}>Recent Prescriptions</h2>

      <div className={styles.prescriptionsList}>
        {prescriptions.map((rx) => (
          <div key={rx._id} className={styles.prescriptionItem}>
            <div className={styles.itemContent}>
              <h4 className={styles.itemTitle}>
                {rx.patientSnapshot?.fullName || rx.patientEmail}
              </h4>

              <p className={styles.itemTime}>
                {new Date(rx.createdAt).toLocaleString()}
              </p>

             <p className={styles.itemSummary}>
  <strong>Diagnosis:</strong> {rx.diagnosis || "N/A"}
</p>

<p className={styles.itemSummary}>
  <strong>Medicines:</strong> {rx.medicines.map(m => m.name).join(", ")}
</p>

            </div>

            <div className={styles.itemRight}>
              <button
  className={styles.openBtn}
  onClick={() => openPrescription(rx._id)}
>
  Open
</button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
