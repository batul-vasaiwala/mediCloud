"use client"
import styles from "./sidebar.module.css"
import { LayoutDashboard, Plus, Users, FileText, BarChart3, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Sidebar() {
  const navigate = useNavigate()

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
  onClick={(e) => {
    e.preventDefault()

    if (item.label === "Add Prescription") {
      navigate("/Doctor/add-prescription")
    }

    if (item.label === "Dashboard") {
      navigate("/Doctor/dashboard")
    }
  }}
  className={`${styles.navItem} ${
    item.label === "Dashboard" ? styles.active : ""
  }`}
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
