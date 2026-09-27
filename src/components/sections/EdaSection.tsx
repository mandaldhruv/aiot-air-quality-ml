import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { DailyAqiChart } from '../charts/DailyAqiChart';
import { HourlyAqiChart } from '../charts/HourlyAqiChart';
import { PollutionChart } from '../charts/PollutionChart';

interface EdaSectionProps {
  onViewCode: (sectionId: string) => void;
}

export const EdaSection: React.FC<EdaSectionProps> = ({ onViewCode }) => {
  return (
    <section id="section-eda" className="py-16 md:py-20 border-t border-[#E6E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="05"
          badge="Exploratory Data Analysis"
          title="Historical AQI Dynamics & Patterns"
          description="Before training our machine learning model, we analyze multi-day variations, diurnal 24-hour cycles, and categorical pollution frequency across 1,967 logged intervals. Each visualization is backed by the actual Colab notebook outputs."
          badgeColor="sage"
        />

        {/* Graph 01: Average AQI per Day (Large full-width) */}
        <div className="mb-8">
          <DailyAqiChart onViewCode={onViewCode} />
        </div>

        {/* Graphs 02 & 03: Two-Column Analytical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graph 02: Average AQI by Hour */}
          <div className="flex flex-col">
            <HourlyAqiChart onViewCode={onViewCode} />
          </div>

          {/* Graph 03: Pollution Level Distribution */}
          <div className="flex flex-col">
            <PollutionChart onViewCode={onViewCode} />
          </div>
        </div>
      </div>
    </section>
  );
};
