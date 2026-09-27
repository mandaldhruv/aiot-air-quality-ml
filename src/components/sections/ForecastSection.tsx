import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { ForecastChart } from '../charts/ForecastChart';
import { Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';

interface ForecastSectionProps {
  onViewCode: (sectionId: string) => void;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ onViewCode }) => {
  return (
    <section id="section-forecast" className="py-16 md:py-20 border-t border-[#E6E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="08"
          badge="Inference & Culmination"
          title="24-Hour Predictive AQI Horizon"
          description="The culmination of our machine learning pipeline. Using the fitted 200-tree Random Forest Regressor and synthesized diurnal environmental conditions, we forecast the complete 24-hour AQI profile for the upcoming day (2026-09-01)."
          badgeColor="purple"
        />

        {/* Featured Large Forecast Chart */}
        <div className="mb-10">
          <ForecastChart onViewCode={onViewCode} />
        </div>

        {/* Technical Synthesis Workflow Box */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 md:p-8 shadow-[0_2px_12px_rgba(30,40,35,0.03)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7E22CE] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full border border-[#E9D5FF]">
              Feature Synthesis Methodology
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#19221C] mb-2">
            How Next-Day Features Are Generated for 2026-09-01
          </h3>

          <p className="text-xs sm:text-sm text-[#48544D] leading-relaxed mb-6">
            Future continuous prediction requires input features for timestamps that have not yet occurred. Our Python script constructs an hourly synthetic feature matrix across 00:00 to 23:00 through the following deterministic steps:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EDE8DF]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#19221C] mb-1">
                <Calendar className="w-4 h-4 text-[#5F7F6C]" />
                1. Calendar Projections
              </div>
              <p className="text-xs text-[#738077] leading-relaxed">
                Determines <code className="font-mono text-[#2F4D3E]">next_day = last_date + 1 day</code> (2026-09-01), computing its day of week (<code className="font-mono">1</code> for Tuesday) and month number (<code className="font-mono">9</code> for September).
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EDE8DF]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#19221C] mb-1">
                <Clock className="w-4 h-4 text-[#366B6B]" />
                2. Weather Diurnal Means
              </div>
              <p className="text-xs text-[#738077] leading-relaxed">
                Groups historical dataset records by hour (0–23) to compute the typical diurnal temperature and humidity profile: <code className="font-mono text-[#2F4D3E]">df.groupby('hour')[['Temperature', 'humidity']].mean()</code>.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EDE8DF]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#19221C] mb-1">
                <Sparkles className="w-4 h-4 text-[#7E22CE]" />
                3. Ensemble Forward Pass
              </div>
              <p className="text-xs text-[#738077] leading-relaxed">
                Feeds the 24 synthesized rows through <code className="font-mono text-[#7E22CE]">model.predict(future_df[features])</code>, obtaining predicted AQI scalars across each hour of the day.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0ECE3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-[#738077]">
              Inspect feature synthesis code in Section 10 of the ML Workflow.
            </span>
            <button
              type="button"
              onClick={() => onViewCode('sec-10')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F4D3E] hover:text-[#19221C] transition-colors"
            >
              <span>View Next-Day Synthesis Script</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
