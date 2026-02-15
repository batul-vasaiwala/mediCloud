'use client'
import TrendChart from './AITrendChart'
import './AIanalytics.css'

export default function AnalyticsDashboard() {
  return (
    <div className="dashboard">
      <h2>AI Disease Prediction Dashboard</h2>

      <div className="grid">
        <TrendChart
          title="Heart Disease"
          endpoint="http://127.0.0.1:8000/api/heart-trend"
        />

        <TrendChart
          title="Diabetes"
          endpoint="http://127.0.0.1:8000/api/diabetes-trend"
        />

        <TrendChart
          title="Stroke"
          endpoint="http://127.0.0.1:8000/api/stroke-trend"
        />
      </div>
    </div>
  )
}
