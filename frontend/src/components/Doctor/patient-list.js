"use client"
import styles from "./patient-list.module.css"
import { ChevronRight } from "lucide-react"

export default function PatientList() {
  const patients = [
    {
      id: 1,
      name: "John Anderson",
      age: 45,
      gender: "M",
      lastVisit: "2 days ago",
      conditions: "Hypertension, Type 2 Diabetes",
    },
    {
      id: 2,
      name: "Emma Johnson",
      age: 32,
      gender: "F",
      lastVisit: "Today",
      conditions: "Asthma, Allergies",
    },
    {
      id: 3,
      name: "Michael Smith",
      age: 58,
      gender: "M",
      lastVisit: "1 week ago",
      conditions: "Heart Disease, Hypertension",
    },
    {
      id: 4,
      name: "Sarah Williams",
      age: 28,
      gender: "F",
      lastVisit: "3 days ago",
      conditions: "Migraine",
    },
  ]

  return (
    <div className={styles.patientList}>
      <h2 className={styles.title}>Patient List</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age / Gender</th>
              <th>Last Visit</th>
              <th>Conditions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className={styles.patientName}>{patient.name}</td>
                <td>
                  {patient.age} / {patient.gender}
                </td>
                <td>{patient.lastVisit}</td>
                <td className={styles.conditions}>{patient.conditions}</td>
                <td>
                  <button className={styles.viewBtn}>
                    View History
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
