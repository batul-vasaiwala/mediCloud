import { useEffect, useState } from "react"
import axios from "axios"

export default function PatientHistory({ email, onBack }) {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [email])

  async function fetchHistory() {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/prescriptions/patient-list`,
        { params: { email } }
      )
      setPrescriptions(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading history...</p>

  return (
    <div style={{ padding: 24 }}>
      <button onClick={onBack}>← Back</button>
      <h2>Prescription History</h2>

      {prescriptions.length === 0 && <p>No prescriptions found.</p>}

      {prescriptions.map(p => (
        <div
          key={p._id}
          style={{
            border: "1px solid #e5e7eb",
            padding: 16,
            borderRadius: 8,
            marginBottom: 12
          }}
        >
          <div><strong>Date:</strong> {new Date(p.createdAt).toLocaleDateString()}</div>
          <div><strong>Diagnosis:</strong> {p.diagnosis}</div>

          <strong>Medicines:</strong>
          <ul>
            {p.medicines.map((m, i) => (
              <li key={i}>
                {m.name} – {m.dosage} ({m.durationDays} days)
              </li>
            ))}
          </ul>

          <a
            href={`http://localhost:5000/api/prescriptions/download/${p._id}`}
            target="_blank"
            rel="noreferrer"
          >
            View PDF
          </a>
        </div>
      ))}
    </div>
  )
}
