"use client"
import { useEffect, useState } from "react"
import axios from "axios"

export default function PatientProfile() {
  const [patient, setPatient] = useState(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("patient")
    if (stored) {
      setPatient(JSON.parse(stored))
    }
  }, [])

  if (!patient) return <p>Loading...</p>

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/patients/${patient._id}`,
        patient
      )

      localStorage.setItem("patient", JSON.stringify(res.data))
      setEditing(false)
      alert("Profile updated!")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Profile</h2>

      <div>
        <label>Full Name</label>
        <input
          name="fullName"
          value={patient.fullName}
          disabled={!editing}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Email</label>
        <input
          name="email"
          value={patient.email}
          disabled
        />
      </div>

      <div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={patient.dateOfBirth?.split("T")[0]}
          disabled={!editing}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Gender</label>
        <select
          name="gender"
          value={patient.gender}
          disabled={!editing}
          onChange={handleChange}
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>

      {!editing ? (
        <button onClick={() => setEditing(true)}>Edit</button>
      ) : (
        <button onClick={handleSave}>Save</button>
      )}
    </div>
  )
}
