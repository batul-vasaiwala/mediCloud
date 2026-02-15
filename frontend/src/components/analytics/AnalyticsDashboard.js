import React from "react";
import AnalyticsCards from "./AnalyticsCards";
import AnalyticsCarousel from "./AnalyticsCarousel";
import "./analytics.css";

export default function AnalyticsDashboard() {
  return (
    <section className="analytics-section">
      <AnalyticsCarousel />
    </section>
  );
}
