import React, { useState, useEffect, useRef } from 'react';
import { forecastData, forecastMeta } from '../../data/forecastData';
import { ArrowUpRight } from 'lucide-react';

interface HeroDataVisualizationProps {
  onExploreForecast?: () => void;
}

export const HeroDataVisualization: React.FC<HeroDataVisualizationProps> = ({
  onExploreForecast,
}) => {
  const [animStage, setAnimStage] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG Geometry Dimensions
  const width = 520;
  const height = 260;
  const leftX = 36;
  const rightX = 492;
  const topY = 46;
  const bottomY = 210;
  const minAQI = 55;
  const maxAQI = 190;

  const getY = (aqi: number) => {
    const clamped = Math.max(minAQI, Math.min(maxAQI, aqi));
    return bottomY - ((clamped - minAQI) / (maxAQI - minAQI)) * (bottomY - topY);
  };

  const getX = (hour: number) => {
    return leftX + (hour / 23) * (rightX - leftX);
  };

  // Map all 24 real forecast points from forecastData
  const points = forecastData.map((pt) => ({
    ...pt,
    x: Number(getX(pt.hour).toFixed(1)),
    y: Number(getY(pt.predictedAqi).toFixed(1)),
  }));

  // Build smooth curve path for the 24 forecast points
  const buildSmoothPath = () => {
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return path;
  };

  const forecastLinePath = buildSmoothPath();
  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const forecastAreaPath = `${forecastLinePath} L ${lastPt.x} ${bottomY} L ${firstPt.x} ${bottomY} Z`;

  // Animation sequence on mount
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimStage(4);
      return;
    }

    const t1 = setTimeout(() => setAnimStage(1), 80);   // Grid & labels fade in
    const t2 = setTimeout(() => setAnimStage(2), 250);  // Forecast line starts drawing
    const t3 = setTimeout(() => setAnimStage(3), 1100); // Points reveal progressively
    const t4 = setTimeout(() => setAnimStage(4), 1600); // Final settlement & gentle pulse

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Pointer interaction
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const clientX = (e.clientX - rect.left) * scaleX;

    // Find closest hourly point by X
    let closestIdx = 0;
    let minDiff = Infinity;
    points.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - clientX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (minDiff < 32) {
      setHoveredIndex(closestIdx);
    } else {
      setHoveredIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div className="w-full relative select-none">
      {/* Top Editorial Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#738077] mb-2 px-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#7E22CE]" />
          <span className="text-[#19221C] font-bold">Predicted AQI</span>
          <span className="text-[#D8D2C6]">—</span>
          <span>Next 24 Hours</span>
        </div>
        <div className="text-[10px] font-mono text-[#5F7F6C]">
          TARGET: {forecastMeta.forecastDate}
        </div>
      </div>

      {/* SVG Canvas (Breathes directly in whitespace, no heavy card) */}
      <div className="relative w-full aspect-[520/260] max-h-[340px] overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Area gradient under actual forecast curve */}
            <linearGradient id="heroForecastArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7E22CE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
            </linearGradient>

            {/* Line gradient for forecast trajectory */}
            <linearGradient id="heroForecastStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6B21A8" />
              <stop offset="40%" stopColor="#7E22CE" />
              <stop offset="85%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#6B21A8" />
            </linearGradient>
          </defs>

          {/* Reference Grid & Threshold Guidelines */}
          <g
            className="transition-opacity duration-700"
            style={{ opacity: animStage >= 1 ? 1 : 0 }}
          >
            {/* 100 AQI Threshold */}
            <line
              x1={leftX}
              y1={getY(100)}
              x2={rightX}
              y2={getY(100)}
              stroke="#E8E3D9"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <text
              x={leftX}
              y={getY(100) - 4}
              fill="#A29C91"
              fontSize="9"
              fontFamily="Manrope"
              fontWeight="600"
            >
              100 AQI Threshold
            </text>

            {/* 150 AQI Threshold */}
            <line
              x1={leftX}
              y1={getY(150)}
              x2={rightX}
              y2={getY(150)}
              stroke="#E8E3D9"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <text
              x={leftX}
              y={getY(150) - 4}
              fill="#A29C91"
              fontSize="9"
              fontFamily="Manrope"
              fontWeight="600"
            >
              150 AQI
            </text>

            {/* Baseline axis */}
            <line
              x1={leftX}
              y1={bottomY}
              x2={rightX}
              y2={bottomY}
              stroke="#DDD7CC"
              strokeWidth="1"
            />

            {/* Subtle Mean Indicator Line */}
            <line
              x1={leftX}
              y1={getY(forecastMeta.averagePredictedAqi)}
              x2={rightX}
              y2={getY(forecastMeta.averagePredictedAqi)}
              stroke="#7E22CE"
              strokeWidth="1"
              strokeDasharray="2 4"
              opacity="0.35"
            />
            <text
              x={rightX}
              y={getY(forecastMeta.averagePredictedAqi) - 4}
              fill="#7E22CE"
              fontSize="9"
              fontFamily="Manrope"
              fontWeight="600"
              textAnchor="end"
              opacity="0.8"
            >
              24h Mean: {forecastMeta.averagePredictedAqi.toFixed(1)}
            </text>
          </g>

          {/* Area Fill */}
          <path
            d={forecastAreaPath}
            fill="url(#heroForecastArea)"
            className="transition-opacity duration-1000"
            style={{ opacity: animStage >= 2 ? 1 : 0 }}
          />

          {/* Real Forecast Line Drawing Animation */}
          <path
            d={forecastLinePath}
            fill="none"
            stroke="url(#heroForecastStroke)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 750,
              strokeDashoffset: animStage >= 2 ? 0 : 750,
              transition: animStage >= 2 ? 'stroke-dashoffset 1200ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
          />

          {/* Individual Real Forecast Points (All 24 hours) */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            const isMilestone = idx === 8 || idx === 20 || idx === 23; // 08:00 Trough, 20:00 Peak, 23:00 Horizon
            const isLast = idx === 23;

            return (
              <g
                key={`hero-pt-${pt.hour}`}
                className="transition-all duration-300"
                style={{
                  opacity: animStage >= 3 ? 1 : 0,
                  transitionDelay: `${idx * 25}ms`,
                }}
              >
                {/* Subtle pulse ring on final prediction horizon point */}
                {isLast && animStage >= 4 && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8.5"
                    fill="none"
                    stroke="#7E22CE"
                    strokeWidth="1.4"
                    className="animate-hero-pulse"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : isMilestone ? 4 : 2.5}
                  fill={isHovered ? '#4C1D95' : '#7E22CE'}
                  stroke="#FAF8F5"
                  strokeWidth={isHovered ? 2 : 1.5}
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* Vertical Guide Hairline on Hover */}
          {activePoint && (
            <g className="transition-opacity duration-150">
              <line
                x1={activePoint.x}
                y1={topY}
                x2={activePoint.x}
                y2={bottomY}
                stroke="#7E22CE"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.4"
              />
            </g>
          )}

          {/* Time Axis Labels */}
          <g
            className="transition-opacity duration-700"
            style={{ opacity: animStage >= 1 ? 1 : 0 }}
          >
            <text x={getX(0)} y={bottomY + 16} fill="#8A847A" fontSize="9.5" fontFamily="Manrope" fontWeight="600">
              00:00
            </text>
            <text x={getX(6)} y={bottomY + 16} textAnchor="middle" fill="#8A847A" fontSize="9.5" fontFamily="Manrope" fontWeight="600">
              06:00
            </text>
            <text x={getX(12)} y={bottomY + 16} textAnchor="middle" fill="#8A847A" fontSize="9.5" fontFamily="Manrope" fontWeight="600">
              12:00
            </text>
            <text x={getX(18)} y={bottomY + 16} textAnchor="middle" fill="#8A847A" fontSize="9.5" fontFamily="Manrope" fontWeight="600">
              18:00
            </text>
            <text x={getX(23)} y={bottomY + 16} textAnchor="end" fill="#7E22CE" fontSize="9.5" fontFamily="Manrope" fontWeight="700">
              23:00
            </text>
          </g>
        </svg>

        {/* Refined Minimal Tooltip on Hover */}
        {activePoint && (
          <div
            className="absolute pointer-events-none z-20 bg-[#19221C] text-white px-3 py-1.5 rounded-lg shadow-xl text-[11px] font-sans border border-[#3B284C] transition-all duration-150 -translate-x-1/2 -translate-y-full mb-2"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              top: `${(activePoint.y / height) * 100}%`,
            }}
          >
            <div className="flex items-center gap-1.5 text-[9.5px] uppercase font-bold text-[#D8B4FE]">
              <span>Time: {activePoint.timeLabel}</span>
              <span>•</span>
              <span>{activePoint.level}</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              Predicted AQI: {activePoint.predictedAqi.toFixed(1)}
              {activePoint.hour === 8 && (
                <span className="ml-1 text-[9.5px] text-[#A7F3D0]">(Trough)</span>
              )}
              {activePoint.hour === 20 && (
                <span className="ml-1 text-[9.5px] text-[#FDE68A]">(Peak)</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subtle Link to Full Analysis Section */}
      <div className="mt-3 pt-2.5 border-t border-[#EDE8DF] flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-[#738077] px-1">
        <span>From the project's Random Forest forecast</span>
        {onExploreForecast && (
          <button
            type="button"
            onClick={onExploreForecast}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F4D3E] hover:text-[#19221C] transition-colors group cursor-pointer"
          >
            <span>Explore full 24h analysis</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
