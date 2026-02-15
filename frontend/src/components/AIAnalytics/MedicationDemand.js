'use client'

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import axios from 'axios'
import { useEffect, useState } from 'react'

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

export default function MedicationDemandChart() {
  const [trend, setTrend] = useState(null)
  const [prediction, setPrediction] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/medication-demand/trend')
      .then(res => setTrend(res.data))

    axios.get('http://127.0.0.1:8000/api/medication-demand/prediction')
      .then(res => setPrediction(res.data))
  }, [])

  if (!trend || !prediction) return <p>Loading...</p>

 const chartData = {
  labels: trend.map(m => m.medicine),
  datasets: [
    {
      label: 'Current Month Demand',
      data: trend.map(m => m.count),
      backgroundColor: 'rgba(13, 110, 253, 0.8)', // solid medical blue
      borderColor: 'rgba(13, 110, 253, 1)',
      borderWidth: 1
    },
    {
      label: 'Next Month Prediction',
      data: prediction.map(m => m.predicted_next_month),
      backgroundColor: 'rgba(13, 110, 253, 0.35)', // lighter blue
      borderColor: 'rgba(13, 110, 253, 1)',
      borderWidth: 1
    }
  ]
}
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      beginAtZero: true
    }
  }
}


  return (
    <div className="ai-card">
      <h2> Medication Demand Forecast</h2>
      <Bar data={chartData} options={options} />
    </div>
  )
}
