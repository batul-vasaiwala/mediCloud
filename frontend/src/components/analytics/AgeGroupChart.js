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

export default function AgeGroupChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics/age-groups")
      .then(res => {
        const groups = {
          "0–18": 0,
          "19–40": 0,
          "41–60": 0,
          "60+": 0,
        };

        res.data.forEach(item => {
          const dob = item.patientSnapshot?.dateOfBirth;
          if (!dob) return;

          const age =
            new Date().getFullYear() - new Date(dob).getFullYear();

          if (age <= 18) groups["0–18"]++;
          else if (age <= 40) groups["19–40"]++;
          else if (age <= 60) groups["41–60"]++;
          else groups["60+"]++;
        });

        setData(
          Object.keys(groups).map(key => ({
            ageGroup: key,
            count: groups[key],
          }))
        );
      });
  }, []);

  return (
    <div className="analytics-card chart">
      <h3>Age Group Distribution</h3>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="ageGroup" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
