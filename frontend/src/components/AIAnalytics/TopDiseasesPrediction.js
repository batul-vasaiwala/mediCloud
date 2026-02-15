'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function TopDiseasesPrediction() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/top-diseases')
      .then(res => setData(res.data))
  }, [])

  return (
    <div className="ai-card">
      <h2 className="card-title">AI Disease Risk Forecast</h2>

      <ol className="risk-list">
  {data.map((d, i) => (
    <li key={i} className="risk-item">
      <div className="risk-left">
        <span className="rank">{i + 1}</span>
        <span className="disease-name">{d.diagnosis}</span>
      </div>

      <div className="risk-right">
        <div className="metric">
          <span className="label">Predicted</span>
          <span className="value">{d.predicted_cases}</span>
        </div>

        <div className="metric risk-badge">
          <span className="label">Risk</span>
          <span className="value">{d.risk_score}</span>
        </div>
      </div>
    </li>
  ))}
</ol>

    </div>
  )
}
