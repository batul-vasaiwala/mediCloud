import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./analytics-card.module.css";

export default function AnalyticsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // doctorId saved at login
  const doctorId = localStorage.getItem("doctorId");
console.log("Doctor ID:", doctorId);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(
           `http://localhost:5000/api/doctor/analytics/${doctorId}`
        );
        console.log("ANALYTICS API RESPONSE 👉", res.data)
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchAnalytics();
  }, [doctorId]);

  if (loading) return <p>Loading analytics...</p>;
  if (!stats) return <p>No analytics available</p>;

  const cards = [
    {
      title: "Today",
      items: [
        { label: "Patients Attended", value: stats.today.patientsAttended },
        { label: "Prescriptions Issued", value: stats.today.prescriptionsIssued },
        { label: "AI Verification", value: stats.today.aiVerification }
      ]
    },
    {
      title: "This Month",
      items: [
        { label: "Total Patients", value: stats.month.totalPatients },
        { label: "Total Prescriptions", value: stats.month.totalPrescriptions },
        { label: "Common Diagnosis", value: stats.month.commonDiagnosis }
      ]
    },
    {
      title: "All Time",
      items: [
        { label: "Total Patients", value: stats.allTime.totalPatients },
        { label: "Lifetime Prescriptions", value: stats.allTime.lifetimePrescriptions },
        { label: "Avg. Patients/Day", value: stats.allTime.avgPatientsPerDay }
      ]
    }
  ];

  return (
    <div className={styles.cardsGrid}>
      {cards.map((card, idx) => (
        <div key={idx} className={styles.card}>
          <h3 className={styles.cardTitle}>{card.title}</h3>

          <div className={styles.statsList}>
            {card.items.map((item, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statLabel}>{item.label}</span>
                <span className={styles.statValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
