'use client'

import { Line } from 'react-chartjs-2'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function StrokeTrendChart() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/stroke-trend')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <div className="ai-card">
      <h2>🧠 Stroke Trend</h2>
      <Line
        data={{
          labels: data.months,
          datasets: [{
            label: 'Stroke Cases',
            data: data.cases,
            tension: 0.4
          }]
        }}
      />
    </div>
  )
}
