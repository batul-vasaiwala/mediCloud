import styles from "./DoctorDashboard.module.css"
import DoctorHeader from "./doctor-header"
import Sidebar from "./sidebar"
import SearchBar from "./search-bar"
import AnalyticsCards from "./analytics-cards"
import PatientList from "./patient-list"
import RecentPrescriptions from "./recent-prescriptions"

export default function DoctorDashboard() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <DoctorHeader />
         <div className={styles.content}>
          <SearchBar />
         <AnalyticsCards />
          <div className={styles.gridContent}>
            <PatientList />
            <RecentPrescriptions />
          </div>
        </div> 
      </div> 
    </div>
  )
}
