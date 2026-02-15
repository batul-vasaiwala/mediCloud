'use client';
import './AIAnalytics.css';
import HeartTrendChart from './HeartTrendChart'
import DiabetesTrendChart from './DiabetesTrendChart';
import StrokeTrendChart from './StrokeTrendChart';
import CovidTrendChart from './CovidTrendChart';
import TopDiseasesPrediction from './TopDiseasesPrediction';
import MedicationDemandChart from './MedicationDemand';
import Chatbot from '../Chatbot';
import axios from 'axios'
import { useEffect, useState } from 'react'
export default function AIAnalyticsDashboard({ onBack }) {
    const [summary, setSummary] = useState(null)
 const [isLoading, setIsLoading] = useState(true);
 useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/ai-summary")
    .then(res => {
      setSummary(res.data);
      setIsLoading(false);   // ✅ IMPORTANT
    })
    .catch(err => {
      console.error(err);
      setIsLoading(false);   // ✅ avoid infinite loading on error
    });
}, []);





  // if (!summary) return <p>Loading AI insights...</p>
     return (
    <div className="dashboard-container">
      {/* Healthcare Background Pattern */}
      <div className="background-pattern"></div>
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          
          <div className="header-title-section">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            <div>
              <h1 className="dashboard-title">AI Health Analytics</h1>
              <p className="dashboard-subtitle">Advanced Medical Intelligence System</p>
            </div>
          </div>
          <div className="header-meta">
            <span className="system-status">
              <span className="status-dot"></span>
              System Active
            </span>
          </div>
          {/* BACK BUTTON */}
    <button className="back-button" onClick={onBack}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Back
    </button>
        </div>
      </header>

      {/* Stats Overview
      <section className="stats-overview">
        <StatCard 
          icon="📊" 
          label="Active Cases" 
          value="2,847" 
          trend="+12%" 
          trendUp={true}
          customIcon="📈"
        />
        <StatCard 
          icon="💊" 
          label="Medications Tracked" 
          value="156" 
          trend="+8%" 
          trendUp={true}
          customIcon="⚗️"
        />
        <StatCard 
          icon="🧬" 
          label="Predictions" 
          value="94.7%" 
          trend="Accuracy" 
          trendUp={true}
          customIcon="🎯"
        />
        <StatCard 
          icon="🏥" 
          label="AI Insights" 
          value="24" 
          trend="This Week" 
          trendUp={true}
          customIcon="💡"
        />
      </section> */}

      {/* Charts Grid */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading AI analytics...</p>
        </div>
      ) : (
        <>
          <section className="charts-grid">
            
            <div className="chart-card">
              <HeartTrendChart />
            </div>
            <div className="chart-card">
              <DiabetesTrendChart />
            </div>
            <div className="chart-card">
              <TopDiseasesPrediction />
            </div>
            <div className="chart-card">
              <MedicationDemandChart />
            </div>
          </section>

          {/* AI Summary Card */}
          <section className="summary-section">
            <div className="summary-card">
              <div className="summary-header">
                <div className="summary-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="summary-title">AI Health Summary</h3>
              </div>
              <div className="summary-content">
                {summary?.summary.map((line, i) => (
                  <div key={i} className="summary-item">
                    <span className="summary-bullet"></span>
                    <p>{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleTimeString()}</p>
        <p>Data is updated every 15 minutes • System running on AI-Neural Network v4.2</p>
      </footer>
    </div>
  );
}
