"use client"
import styles from "./recent-prescriptions.module.css"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function RecentPrescriptions() {
  const prescriptions = [
    {
      id: 1,
      patient: "John Anderson",
      time: "2 hours ago",
      summary: "Metformin 500mg, Lisinopril 10mg",
      status: "verified",
    },
    {
      id: 2,
      patient: "Emma Johnson",
      time: "4 hours ago",
      summary: "Albuterol inhaler, Cetirizine 10mg",
      status: "verified",
    },
    {
      id: 3,
      patient: "Michael Smith",
      time: "6 hours ago",
      summary: "Aspirin 81mg, Atorvastatin 20mg",
      status: "pending",
    },
    {
      id: 4,
      patient: "Sarah Williams",
      time: "1 day ago",
      summary: "Sumatriptan 50mg, Ibuprofen 400mg",
      status: "flagged",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle size={16} style={{ color: "#22c55e" }} />
      case "pending":
        return <Clock size={16} style={{ color: "#f59e0b" }} />
      case "flagged":
        return <AlertCircle size={16} style={{ color: "#ef4444" }} />
    }
  }

  const getStatusClass = (status: string) => {
    return `${styles.statusBadge} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]}`
  }

  return (
    <div className={styles.prescriptions}>
      <h2 className={styles.title}>Recent Prescriptions</h2>
      <div className={styles.prescriptionsList}>
        {prescriptions.map((rx) => (
          <div key={rx.id} className={styles.prescriptionItem}>
            <div className={styles.itemContent}>
              <h4 className={styles.itemTitle}>{rx.patient}</h4>
              <p className={styles.itemTime}>{rx.time}</p>
              <p className={styles.itemSummary}>{rx.summary}</p>
            </div>
            <div className={styles.itemRight}>
              <span className={getStatusClass(rx.status)}>
                {getStatusIcon(rx.status)}
                {rx.status.charAt(0).toUpperCase() + rx.status.slice(1)}
              </span>
              <button className={styles.openBtn}>Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
