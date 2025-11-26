"use client"
import styles from "./doctor-header.module.css"
import { Bell, Settings, LogOut } from "lucide-react"

export default function DoctorHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}>Dr</div>
          <div>
            <h1 className={styles.doctorName}>Dr. Sarah Williams</h1>
            <p className={styles.specialty}>General Practitioner</p>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.addPrescriptionBtn}>+ Add Prescription</button>

        <div className={styles.actions}>
          <button className={styles.iconBtn}>
            <Bell size={20} />
            <span className={styles.badge}>3</span>
          </button>
          <button className={styles.iconBtn}>
            <Settings size={20} />
          </button>
          <button className={styles.iconBtn}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
