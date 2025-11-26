"use client"
import styles from "./analytics-card.module.css"

export default function AnalyticsCards() {
  const stats = [
    {
      title: "Today",
      items: [
        { label: "Patients Attended", value: "12" },
        { label: "Prescriptions Issued", value: "18" },
        { label: "AI Verification", value: "15" },
      ],
    },
    {
      title: "This Month",
      items: [
        { label: "Total Patients", value: "284" },
        { label: "Total Prescriptions", value: "456" },
        { label: "Common Diagnosis", value: "Hypertension" },
      ],
    },
    {
      title: "All Time",
      items: [
        { label: "Total Patients", value: "2,847" },
        { label: "Lifetime Prescriptions", value: "12,450" },
        { label: "Avg. Patients/Day", value: "34.2" },
      ],
    },
  ]

  return (
    <div className={styles.cardsGrid}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.card}>
          <h3 className={styles.cardTitle}>{stat.title}</h3>
          <div className={styles.statsList}>
            {stat.items.map((item, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statLabel}>{item.label}</span>
                <span className={styles.statValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
