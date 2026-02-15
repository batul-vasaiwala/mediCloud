import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MedicineDistributionChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/analytics/medicine-distribution")
      .then((res) => {
        const formatted = res.data.map((item) => ({
          medicine: item._id || "Unknown",
          count: item.count,
        }));

        setData(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="analytics-card chart">
      <h3>Most Prescribed Medicines</h3>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="medicine" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
