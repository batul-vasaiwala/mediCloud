'use client'

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import axios from 'axios'
import { useEffect, useState } from 'react'

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

export default function DiabetesTrendChart() {
  const [trend, setTrend] = useState(null)

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/diagnosis-trend/diabetes')
      .then(res => setTrend(res.data))
      .catch(err => console.error('API ERROR:', err))
  }, [])

  if (!trend) return <p>Loading analytics...</p>

  const chartData = {
    labels: trend.months,
    datasets: [
      {
        label: 'Diabetes Cases',
        data: trend.cases,
        tension: 0.4,
        borderColor: '#198754', // medical green-blue
        backgroundColor: 'rgba(25,135,84,0.15)',
        fill: true,
        pointBackgroundColor: '#198754',
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
      <h2>Diabetes Trend Analysis</h2>

      <Line data={chartData} options={options} />

      <div className="trend-summary">
        <div>
          <span className="label">Trend</span>
          <span className="value">{trend.trend}</span>
        </div>

        <div>
          <span className="label">Next Month Prediction</span>
          <span className="value">{trend.next_month_prediction}</span>
        </div>

        <div>
          <span className="label">Confidence</span>
          <span className="value">{trend.confidence}%</span>
        </div>
      </div>
    </div>
  )
}
