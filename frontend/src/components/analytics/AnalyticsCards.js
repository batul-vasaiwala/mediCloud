import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AnalyticsCards() {
  const [total, setTotal] = useState(0);
  const [topDisease, setTopDisease] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics/summary")
      .then(res => setTotal(res.data.total));

    axios.get("http://localhost:5000/api/analytics/disease-distribution")
      .then(res => setTopDisease(res.data[0]));
  }, []);

  return (
    <div className="analytics-cards-row">
      <div className="analytics-card kpi">
        <h4>Total Prescriptions</h4>
        <h1>{total}</h1>
      </div>

      {topDisease && (
        <div className="analytics-card kpi highlight">
          <h4>Most Common Disease</h4>
          <h2>{topDisease._id}</h2>
          <p>{topDisease.count} cases</p>
        </div>
      )}
    </div>
  );
}
