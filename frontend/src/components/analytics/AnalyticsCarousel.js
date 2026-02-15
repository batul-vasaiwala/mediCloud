import React, { useEffect, useRef, useState } from "react";
import DiseaseChart from "./DiseaseChart";
import TrendChart from "./TrendChart";
import AnalyticsCards from "./AnalyticsCards";
import GenderChart from "./GenderChart";
import AgeGroupChart from "./AgeGroupChart";
import MedicineDistributionChart from "./MedicineDistributionChart";
export default function AnalyticsCarousel() {
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const [index, setIndex] = useState(0);

  const totalSlides = 6; // KPI + 2 charts
  const visibleItems = 3; // 3 visible at once

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 10000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  /* ---------- MOVE TRACK ---------- */
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${index * (100 / visibleItems)}%)`;
    }
  }, [index]);

  /* ---------- HANDLERS ---------- */
  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      {/* LEFT ARROW */}
      <button className="carousel-arrow left" onClick={prevSlide}>
        ‹
      </button>

      <div className="carousel-viewport">
        <div className="carousel-track" ref={trackRef}>
          <div className="carousel-item">
            <AnalyticsCards />
          </div>
          <div className="carousel-item">
            <DiseaseChart />
          </div>
          <div className="carousel-item">
            <TrendChart />
          </div>
          <div className="carousel-item">
            <GenderChart />
          </div>
             <div className="carousel-item">
            <AgeGroupChart />
          </div>
          
             <div className="carousel-item">
            <MedicineDistributionChart />
          </div>

        </div>
      </div>

      {/* RIGHT ARROW */}
      <button className="carousel-arrow right" onClick={nextSlide}>
        ›
      </button>

      {/* DOTS */}
     <div className="carousel-dots">
  {Array.from({ length: totalSlides }).map((_, i) => (
    <span
      key={i}
      className={`carousel-dot ${index === i ? "active" : ""}`}
      onClick={() => setIndex(i)}
    />
  ))}
</div>

    </div>
  );
}
