"use client"
import styles from "./sidebar.module.css"
import { LayoutDashboard, Plus, Users, FileText, BarChart3, Settings } from "lucide-react"

export default function Sidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Plus, label: "Add Prescription" },
    { icon: Users, label: "Patients" },
    { icon: FileText, label: "Prescriptions" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Settings, label: "Settings" },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>MC</div>
        <div>
          <h2 className={styles.logoText}>MediCloud</h2>
          <p className={styles.logoSubtext}>Pro</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`${styles.navItem} ${item.label === "Dashboard" ? styles.active : ""}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className={styles.footer}>
        <p className={styles.footerText}>© 2025 MediCloud</p>
      </div>
    </aside>
  )
}
