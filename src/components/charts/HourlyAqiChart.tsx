import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { hourlyAqiData, hourlyStats } from '../../data/hourlyAqiData';
import { Code2, Image as ImageIcon } from 'lucide-react';

interface HourlyAqiChartProps {
  onViewCode?: (sectionId: string) => void;
}

// Viridis-inspired environmental gradient colors across 24 hours
const getBarColor = (index: number) => {
  // Smooth gradient mapping from deep forest teal to eucalyptus to sage-gold
  const colors = [
    '#2E1E3B', '#37204A', '#3C2652', '#3C3058', '#383B5E', '#324864',
    '#2B546A', '#24616F', '#1F6D72', '#1C7A73', '#208772', '#2B946F',
    '#3DA06A', '#53AC63', '#6DB75A', '#89C150', '#A7CB45', '#C5D33D',
    '#E2DA39', '#C2C942', '#A1B74C', '#84A657', '#6A9560', '#548566'
  ];
  return colors[index] || '#3A6D6C';
};

export const HourlyAqiChart: React.FC<HourlyAqiChartProps> = ({ onViewCode }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#E6E1D8] shadow-[0_2px_12px_rgba(30,40,35,0.03)] overflow-hidden transition-all duration-300 h-full flex flex-col justify-between w-full min-w-0">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#F0ECE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#366B6B] bg-[#E3EFEF] px-2.5 py-0.5 rounded-full">
              Diurnal Cycle • 24 Hours
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-[#19221C] tracking-tight">
            Average AQI by Hour of Day
          </h3>
          <p className="text-xs text-[#48544D] mt-0.5">
            Aggregates sensor records by hour of day (00:00–23:00) to expose recurring intraday air pollution dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${
              showOriginal
                ? 'bg-[#2F4D3E] text-white border-[#2F4D3E]'
                : 'bg-[#FAF8F5] text-[#2F4D3E] border-[#D8D2C6] hover:bg-[#EBF1ED]'
            }`}
            title="Compare with Seaborn plot output"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {showOriginal ? 'Interactive' : 'Seaborn Plot'}
          </button>

          <button
            type="button"
            onClick={() => onViewCode && onViewCode('sec-05')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#19221C] bg-[#FAF8F5] hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-lg transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-[#5F7F6C]" />
            Code
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        {showOriginal ? (
          <div className="space-y-3">
            <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#E6E1D8] flex flex-col items-center">
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#738077] mb-2 gap-1">
                <span className="font-semibold text-[#19221C]">Seaborn Barplot Output</span>
                <span className="font-mono text-[10px]">palette='viridis'</span>
              </div>
              <img
                src="/graph-images/average_aqi_by_hour.png"
                alt="Original Average AQI by Hour of Day plot output from Google Colab"
                className="w-full max-h-[300px] object-contain rounded-lg shadow-xs"
              />
            </div>
            <p className="text-[11px] text-[#738077] italic text-center">
              Generated using <code className="font-mono text-[#2F4D3E] break-all">sns.barplot(data=hourly_avg, x='hour_label', y='AQI', palette='viridis')</code>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hourlyAqiData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" vertical={false} />
                  <XAxis
                    dataKey="timeLabel"
                    tick={{ fill: '#738077', fontSize: 10, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                    interval={isMobile ? 3 : 1}
                    angle={-45}
                    textAnchor="end"
                    height={35}
                  />
                  <YAxis
                    domain={[0, 200]}
                    tick={{ fill: '#738077', fontSize: 10, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as typeof hourlyAqiData[0];
                        return (
                          <div className="bg-[#19221C] text-white p-2.5 rounded-lg shadow-lg border border-[#2F4D3E] text-xs font-sans">
                            <div className="text-[10px] text-[#A6B8AC] uppercase font-semibold">
                              Hour: {data.timeLabel}
                            </div>
                            <div className="text-sm font-bold text-white mt-0.5">
                              Average AQI: {data.aqi.toFixed(1)}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="aqi" radius={[3, 3, 0, 0]} animationDuration={800}>
                    {hourlyAqiData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Micro stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#F0ECE3] text-xs">
              <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EDE8DF]">
                <span className="text-[#738077] block text-[10px] uppercase font-semibold">
                  Diurnal Peak
                </span>
                <span className="font-bold text-[#19221C]">
                  {hourlyStats.peakHour} ({hourlyStats.peakAqi} AQI)
                </span>
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EDE8DF]">
                <span className="text-[#738077] block text-[10px] uppercase font-semibold">
                  Diurnal Low
                </span>
                <span className="font-bold text-[#19221C]">
                  {hourlyStats.troughHour} ({hourlyStats.troughAqi} AQI)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
