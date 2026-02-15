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

export default function HeartTrendChart() {
  const [data, setData] = useState(null)

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/heart-trend')
      .then(res => setData(res.data))
      .catch(err => console.error("API ERROR:", err))
  }, [])

  if (!data) return <p>Loading analytics...</p>

const chartData = {
  labels: data.months,
  datasets: [
    {
      label: 'Heart Disease Cases',
      data: data.cases,
      tension: 0.4,
      borderColor: '#0d6efd',               // medical blue
      backgroundColor: 'rgba(13,110,253,0.15)',
      fill: true,
      pointBackgroundColor: '#0d6efd',
      pointBorderColor: '#ffffff',
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 3
    }
  ]
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0,0,0,0.05)'
      }
    }
  }
}


  return (
    <div className="ai-card">
  <h2> Heart Disease Trend</h2>

  <Line data={chartData} options={options} />

  <div className="trend-summary">
    <div>
      <span className="label">Trend</span>
      <span className="value">{data.trend}</span>
    </div>

    <div>
      <span className="label">Next Month Prediction</span>
      <span className="value">{data.next_month_prediction}</span>
    </div>

    <div>
      <span className="label">Confidence</span>
      <span className="value">{data.confidence}%</span>
    </div>
  </div>
</div>

  )
}
