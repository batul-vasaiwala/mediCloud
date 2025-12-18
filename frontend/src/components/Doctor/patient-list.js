"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import styles from "./patient-list.module.css"
import { ChevronRight } from "lucide-react"
import PatientHistory from "./PatientHistory"
export default function PatientList() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
useEffect(() => {
    fetchPatients()
  }, [])

  if (selectedPatient) {
    return (
      <PatientHistory
        email={selectedPatient.email}
        onBack={() => setSelectedPatient(null)}
      />
    )
  }
  
  async function fetchPatients() {
    try {
      const res = await axios.get("http://localhost:5000/api/patients")
      setPatients(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function calculateAge(dob) {
    if (!dob) return "-"
    const birth = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  if (loading) return <p>Loading patients...</p>

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
              <th>Email</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td className={styles.patientName}>
                  {patient.fullName}
                </td>

                <td>
                  {calculateAge(patient.dateOfBirth)} / {patient.gender}
                </td>

                <td>
                  {patient.updatedAt
                    ? new Date(patient.updatedAt).toLocaleDateString()
                    : "-"}
                </td>

                <td className={styles.conditions}>
                  {patient.email}
                </td>

                <td>
                 <button
  className={styles.viewBtn}
  onClick={() => setSelectedPatient(patient)}
>
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
