import styles from "./doctor-header.module.css"
import { Bell, Settings, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function DoctorHeader() {
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor")
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor))
    }
  }, [])

  const handleAddPrescription = () => {
    navigate("/Doctor/add-prescription")
  }

  const handleLogout = () => {
    localStorage.removeItem("doctor")
    navigate("./Auth/DoctorAuth")
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            {doctor?.fullName?.charAt(0) || "D"}
          </div>

          <div>
            <h1 className={styles.doctorName}>
              {doctor ? doctor.name : "Doctor"}
            </h1>
            <p className={styles.specialty}>
              {doctor ? doctor.specialization : ""}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <button
          className={styles.addPrescriptionBtn}
          onClick={handleAddPrescription}
        >
          + Add Prescription
        </button>

        <div className={styles.actions}>
          <button className={styles.iconBtn}>
            <Bell size={20} />
            <span className={styles.badge}>3</span>
          </button>

          <button className={styles.iconBtn}>
            <Settings size={20} />
          </button>

          <button className={styles.iconBtn} onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
