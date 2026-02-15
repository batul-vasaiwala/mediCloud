"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import styles from "./search-bar.module.css"
import { Search } from "lucide-react"

export default function SearchBar({ onSelectPatient }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const delay = setTimeout(() => {
      searchPatients()
    }, 400)

    return () => clearTimeout(delay)
  }, [query])

  async function searchPatients() {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/prescriptions/search?q=${query}`
      )
      setResults(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search patient by name, email, diagnosis..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {results.length > 0 && (
        <div className={styles.resultsBox}>
          {results.map((patient) => (
            <div
              key={patient._id}
              className={styles.resultItem}
              onClick={() => {
                onSelectPatient({
                  email: patient.patientEmail,
                  fullName: patient.patientSnapshot?.fullName
                })

                setQuery("")
                setResults([])
              }}
            >
              <strong>
                {patient.patientSnapshot?.fullName}
              </strong>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                {patient.patientEmail}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
