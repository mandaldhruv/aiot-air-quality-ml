import React from 'react';
import { Activity, ArrowUp } from 'lucide-react';

interface FooterProps {
  onScrollTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTop }) => {
  return (
    <footer className="bg-[#19221C] text-[#D8D2C6] border-t border-[#2A3830] pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-12 border-b border-[#2A3830]">
          {/* Brand & Project Identity */}
          <div className="max-w-md space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2F4D3E] flex items-center justify-center text-white">
                <Activity className="w-4 h-4 text-[#D8E6DE]" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                AIoT Air Quality Monitoring Network
              </span>
            </div>
            <p className="text-xs text-[#9DAAA0] leading-relaxed">
              Predicting Pollution Levels Using IoT Environmental Sensors. Documenting the complete pipeline from physical sensor ingestion and temporal feature engineering to Random Forest AQI forecasting.
            </p>
            <div className="text-xs text-[#738077] italic">
              “From environmental sensing to intelligent AQI forecasting.”
            </div>
          </div>

          {/* Technical Scope Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-2.5">
                Hardware Node
              </div>
              <ul className="space-y-1.5 text-[#9DAAA0]">
                <li>ESP32 Microcontroller</li>
                <li>DHT22 Temp & Humidity</li>
                <li>MQ135 Gas Sensor</li>
                <li>Particulate Matter Sensor</li>
                <li>0.96" OLED & Buzzer</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-2.5">
                ML Pipeline
              </div>
              <ul className="space-y-1.5 text-[#9DAAA0]">
                <li>Pandas & Scikit-Learn</li>
                <li>Datetime Normalization</li>
                <li>RandomForestRegressor</li>
                <li>200 Estimators (Seed 42)</li>
                <li>24-Hour Diurnal Horizon</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-2.5">
                Data Ground Truth
              </div>
              <ul className="space-y-1.5 text-[#9DAAA0]">
                <li>1,967 Valid Records</li>
                <li>20 Daily Aggregations</li>
                <li>24-Hour Diurnal Bins</li>
                <li>3 Pollution Categories</li>
                <li>Colab Verified Outputs</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#738077]">
          <div>
            AIoT Air Quality Monitoring Network • Academic & Engineering Project Documentation
          </div>

          <button
            onClick={onScrollTop}
            className="inline-flex items-center gap-1.5 text-[#9DAAA0] hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>


      </div>
    </footer>
  );
};
