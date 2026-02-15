import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function TrendChart() {
  const [data, setData] = useState([]);
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics/disease-trend")
      .then(res => {
        const formatted = {};
        const diseaseSet = new Set();

        res.data.forEach(d => {
          const month = `Month ${d._id.month}`;
          const disease = d._id.diagnosis;

          diseaseSet.add(disease);

          if (!formatted[month]) {
            formatted[month] = { month };
          }

          formatted[month][disease] = d.count;
        });

        setData(Object.values(formatted));
        setDiseases(Array.from(diseaseSet));
      })
      .catch(err => console.error("Trend API error:", err));
  }, []);

  return (
    <div className="analytics-card chart">
      <h3>Disease Trends</h3>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          {diseases.map((disease, index) => (
            <Line
              key={disease}
              dataKey={disease}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
