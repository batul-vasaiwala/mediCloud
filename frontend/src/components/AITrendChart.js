'use client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
import axios from 'axios'
import { useEffect, useState } from 'react'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

export default function TrendChart() {
  const [data, setData] = useState(null)

useEffect(() => {
  axios
    .get('http://127.0.0.1:8000/api/heart-trend')
    .then(res => setData(res.data))
    .catch(err => {
      console.error("API ERROR:", err)
    })
}, [])

  if (!data) return <p>Loading analytics...</p>

  const chartData = {
    labels: data.months,
    datasets: [
      {
        label: 'Heart Disease Cases',
        data: data.cases,
        tension: 0.4
      }
    ]
  }

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <h2>Heart Disease Trend</h2>

      <Line data={chartData} />

      <div style={{ marginTop: '15px' }}>
        <p><b>Trend:</b> {data.trend}</p>
        <p><b>Next Month Prediction:</b> {data.next_month_prediction}</p>
        <p><b>Confidence:</b> {data.confidence}%</p>
      </div>
    </div>
  )
}
