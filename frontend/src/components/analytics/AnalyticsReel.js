import React, { useEffect, useRef, useState } from "react";
import AnalyticsCards from "./AnalyticsCards";
import DiseaseChart from "./DiseaseChart";
import TrendChart from "./TrendChart";

const CARD_WIDTH = 280; // card + gap
const VISIBLE_CARDS = 4;
const AUTO_SCROLL_TIME = 10000;

export default function AnalyticsReel() {
  const trackRef = useRef(null);
  const intervalRef = useRef(null);

  const [index, setIndex] = useState(0);

  const cards = [
    <AnalyticsCards />,
    <DiseaseChart />,
    <TrendChart />,
    <AnalyticsCards />, // reuse or future cards
  ];

  const maxIndex = cards.length - VISIBLE_CARDS;

  const startAutoScroll = () => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_SCROLL_TIME);
  };

  const stopAutoScroll = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  return (
    <>
      <div
        className="analytics-reel"
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        <button className="nav left" onClick={() => setIndex(Math.max(index - 1, 0))}>
          ‹
        </button>

        <div className="reel-viewport">
          <div
            className="reel-track"
            ref={trackRef}
            style={{
              transform: `translateX(-${index * CARD_WIDTH}px)`
            }}
          >
            {cards.map((card, i) => (
              <div className="reel-card" key={i}>
                {card}
              </div>
            ))}
          </div>
        </div>

        <button
          className="nav right"
          onClick={() => setIndex(index >= maxIndex ? 0 : index + 1)}
        >
          ›
        </button>
      </div>

      {/* DOTS */}
      <div className="reel-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </>
  );
}
