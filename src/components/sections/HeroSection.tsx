import React from 'react';
import { ArrowRight, Cpu, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';
import { HeroDataVisualization } from './HeroDataVisualization';

interface HeroSectionProps {
  onExploreClick: () => void;
  onForecastClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onForecastClick,
}) => {
  return (
    <section id="section-hero" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-16 md:pb-24 overflow-hidden w-full max-w-full">
      {/* Subtle Background Ambient Texture (~2.5% opacity, faint architectural texture) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
        <svg
          viewBox="0 0 1440 600"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full opacity-[0.024]"
        >
          <path
            d="M -50 320 Q 80 300, 180 340 T 360 280 T 520 330 T 700 240 T 880 310 Q 1050 200, 1220 220 T 1500 160"
            stroke="#2F4D3E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M -50 420 C 120 400, 240 460, 420 390 C 600 320, 720 440, 940 360 C 1120 290, 1300 350, 1500 290"
            stroke="#5F7F6C"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric Two-Column Composition on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: ~58% width (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Subtle Project Metadata Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#2F4D3E] bg-[#EBF1ED] border border-[#D6E3DB] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                AIoT Architecture
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#366B6B] bg-[#E3EFEF] border border-[#C8DFDF] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                Machine Learning
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#9A5B15] bg-[#FDF3E7] border-[#F4DCB9] border px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                AQI Forecasting
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#48544D] bg-[#F2EFE9] border border-[#E0DACE] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                Environmental Data
              </span>
            </div>

            {/* Editorial Headline & Subtitle */}
            <div className="space-y-2.5 sm:space-y-3.5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#19221C] tracking-tight leading-[1.12] sm:leading-[1.08]">
                From Sensor Data to AQI Prediction
              </h1>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#48544D] tracking-tight">
                Predicting Pollution Levels Using IoT Environmental Sensors
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-[#48544D] max-w-2xl leading-relaxed pt-1">
                This interactive technical workspace documents the machine learning and analytical layer of our AIoT air-quality monitoring system. Follow the progression from real edge sensor telemetry through data cleaning and feature engineering to Random Forest model evaluation and next-day AQI forecasting.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onForecastClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 min-h-[44px] text-xs sm:text-sm font-bold text-white bg-[#2F4D3E] hover:bg-[#1E362A] rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Explore 24-Hour Forecast</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 min-h-[44px] text-xs sm:text-sm font-bold text-[#19221C] bg-white hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-xl transition-all cursor-pointer"
              >
                <span>Inspect ML Pipeline</span>
              </button>
            </div>
          </div>

          {/* Right Column: ~42% width (lg:col-span-5) — Real 24h Forecast Preview */}
          <div className="lg:col-span-5 w-full min-w-0 mt-6 lg:mt-0">
            <HeroDataVisualization onExploreForecast={onForecastClick} />
          </div>
        </div>

        {/* Visual Pipeline Progression (Sensor Data → ML Model → AQI Forecast) */}
        <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[#E6E1D8]">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#738077] mb-4">
            System Transformation Progression
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {/* Step 1: Sensor Data */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)] relative group hover:border-[#2F4D3E]/40 transition-colors">
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <span className="text-[10px] font-mono font-bold text-[#738077] uppercase tracking-wider bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8DF]">
                  Phase 01
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#EBF1ED] flex items-center justify-center text-[#2F4D3E]">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#19221C] mb-1">
                Sensor Data
              </h3>
              <p className="text-xs text-[#48544D] leading-relaxed">
                ESP32 hardware polls DHT22, MQ135, and optical PM2.5 sensors, logging continuous readings via Google Apps Script.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0ECE3] text-[11px] font-semibold text-[#2F4D3E] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1,967 Valid Records Ingested</span>
              </div>
            </div>

            {/* Step 2: ML Model */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)] relative group hover:border-[#2F4D3E]/40 transition-colors">
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <span className="text-[10px] font-mono font-bold text-[#738077] uppercase tracking-wider bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8DF]">
                  Phase 02
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#E3EFEF] flex items-center justify-center text-[#366B6B]">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#19221C] mb-1">
                ML Model
              </h3>
              <p className="text-xs text-[#48544D] leading-relaxed">
                Feature engineering extracts hour, day of week, and month. RandomForestRegressor fits 200 bagging trees on 80% train split.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0ECE3] text-[11px] font-semibold text-[#366B6B] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>RandomForestRegressor(200 trees)</span>
              </div>
            </div>

            {/* Step 3: AQI Forecast */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)] relative group hover:border-[#2F4D3E]/40 transition-colors">
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <span className="text-[10px] font-mono font-bold text-[#738077] uppercase tracking-wider bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8DF]">
                  Phase 03
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center text-[#7E22CE]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#19221C] mb-1">
                AQI Forecast
              </h3>
              <p className="text-xs text-[#48544D] leading-relaxed">
                Predicts next 24-hour diurnal profile for 28-09-2026 using synthesized feature vectors based on diurnal weather baselines.
              </p>
              <div className="mt-4 pt-3 border-t border-[#F0ECE3] text-[11px] font-semibold text-[#7E22CE] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>24 Hourly Forecast Points Output</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
