import { useEffect, useState } from "react"
import axios from "axios"
import "./PatientHistory.css"
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
  <div className="history-container">
    <button className="back-btn" onClick={onBack}>← Back</button>
    <h2 className="history-title">Prescription History</h2>

    {prescriptions.length === 0 && (
      <p className="no-data">No prescriptions found.</p>
    )}

    {prescriptions.map(p => (
      <div key={p._id} className="history-card">
        <div className="history-date">
          <strong>Date:</strong> {new Date(p.createdAt).toLocaleDateString()}
        </div>

        <div className="history-diagnosis">
          <strong>Diagnosis:</strong> {p.diagnosis}
        </div>

        <div className="history-medicines">
          <strong>Medicines:</strong>
          <ul>
            {p.medicines.map((m, i) => (
              <li key={i}>
                {m.name} – {m.dosage} ({m.durationDays} days)
              </li>
            ))}
          </ul>
        </div>

        <a
          className="pdf-link"
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
