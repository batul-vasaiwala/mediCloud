import React from "react";
import styles from "./patient-sidebar.module.css";
import { useNavigate } from "react-router-dom"
export default function PatientSidebar() {
  const navigate=useNavigate()
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>MediCloud</h2>

      <nav className={styles.menu}>
        <a className={styles.active}>Dashboard</a>
        <a>Prescriptions</a>
        <a>Medical History</a>
        <a>Profile</a>
        <a>Settings</a>
      </nav>
    </aside>
  );
}
{/*import React from "react";
import styles from "./patient-sidebar.module.css";
import { Link, useLocation } from "react-router-dom";

export default function PatientSidebar() {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>MediCloud</h2>

      <nav className={styles.menu}>
        <Link
          to="/patient-dashboard"
          className={
            location.pathname === "/patient-dashboard"
              ? styles.active
              : ""
          }
        >
          Dashboard
        </Link>

        <Link to="/prescriptions">Prescriptions</Link>

        <Link to="/medical-history">Medical History</Link>

        <Link to="/patient-profile">Profile</Link>

        <Link to="/settings">Settings</Link>
      </nav>
    </aside>
  );
}
 */}