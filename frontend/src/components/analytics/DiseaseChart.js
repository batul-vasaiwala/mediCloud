import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DiseaseChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics/disease-distribution")
      .then(res => {
        setData(res.data.map(d => ({
          name: d._id,
          cases: d.count
        })));
      });
  }, []);

  return (
    <div className="analytics-card chart">
      <h3>Disease Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cases" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
