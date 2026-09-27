import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { dailyAqiData, dailyStats } from '../../data/dailyAqiData';
import { Code2, Image as ImageIcon } from 'lucide-react';

interface DailyAqiChartProps {
  onViewCode?: (sectionId: string) => void;
}

export const DailyAqiChart: React.FC<DailyAqiChartProps> = ({ onViewCode }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E6E1D8] shadow-[0_2px_12px_rgba(30,40,35,0.03)] overflow-hidden transition-all duration-300">
      {/* Card Header */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-[#F0ECE3] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5F7F6C] bg-[#EBF1ED] px-2.5 py-0.5 rounded-full">
              Historical Analysis • 20 Days
            </span>
            <span className="text-[11px] font-medium text-[#738077]">2026-08-12 to 2026-08-31</span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#19221C] tracking-tight">
            Average AQI per Day
          </h3>
          <p className="text-xs md:text-sm text-[#48544D] mt-1 max-w-2xl">
            This view aggregates AQI readings by day to reveal temporal variation in overall air-quality conditions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${
              showOriginal
                ? 'bg-[#2F4D3E] text-white border-[#2F4D3E]'
                : 'bg-[#FAF8F5] text-[#2F4D3E] border-[#D8D2C6] hover:bg-[#EBF1ED]'
            }`}
            title="Compare with Colab plot output"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {showOriginal ? 'Show Interactive Chart' : 'View Colab Plot'}
          </button>

          <button
            type="button"
            onClick={() => onViewCode && onViewCode('sec-04')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#19221C] bg-[#FAF8F5] hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-lg transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-[#5F7F6C]" />
            View Analysis Code
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 md:p-8">
        {showOriginal ? (
          <div className="space-y-4">
            <div className="bg-[#FAF8F5] rounded-xl p-3 sm:p-4 border border-[#E6E1D8] flex flex-col items-center">
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#738077] mb-3 gap-1">
                <span className="font-semibold text-[#19221C]">Matplotlib Output from Google Colab</span>
                <span className="font-mono text-[11px] truncate">daily_avg = df.groupby('day_only')['AQI'].mean()</span>
              </div>
              <img
                src="/graph-images/average_aqi_per_day.png"
                alt="Original Average AQI per Day plot output from Google Colab"
                className="w-full max-h-[420px] object-contain rounded-lg shadow-xs"
              />
            </div>
            <p className="text-xs text-[#738077] italic text-center">
              Exact plot output generated using <code className="font-mono text-[#2F4D3E] break-all">plt.plot(daily_avg['day_only'], daily_avg['AQI'], marker='o', color='crimson')</code>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-[280px] sm:h-[340px] md:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyAqiData}
                  margin={{ top: 15, right: 15, left: -15, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" vertical={false} />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{ fill: '#738077', fontSize: 10, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                    dy={8}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[80, 240]}
                    tick={{ fill: '#738077', fontSize: 10, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                    dx={-4}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as typeof dailyAqiData[0];
                        return (
                          <div className="bg-[#19221C] text-white p-3 rounded-xl shadow-lg border border-[#2F4D3E] text-xs font-sans">
                            <div className="text-[10px] text-[#A6B8AC] uppercase font-semibold">
                              {data.date} • {data.dayOfWeek}
                            </div>
                            <div className="text-base font-bold text-white mt-0.5">
                              AQI: {data.aqi.toFixed(1)}
                            </div>
                            <div className="text-[10px] text-[#D8D2C6] mt-1">
                              {data.aqi > 200
                                ? 'Very Unhealthy (>200)'
                                : data.aqi > 150
                                ? 'Unhealthy (>150)'
                                : data.aqi > 100
                                ? 'Moderate (>100)'
                                : 'Satisfactory (≤100)'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={dailyStats.meanAqi}
                    stroke="#5F7F6C"
                    strokeDasharray="4 4"
                    label={{
                      value: `Mean AQI: ${dailyStats.meanAqi.toFixed(1)}`,
                      position: 'insideBottomRight',
                      fill: '#5F7F6C',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    stroke="#D93848"
                    strokeWidth={2.4}
                    dot={{ fill: '#D93848', r: 4, strokeWidth: 1, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6, fill: '#B82332', stroke: '#FFFFFF', strokeWidth: 2 }}
                    animationDuration={900}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Analytical Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F0ECE3]">
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EDE8DF]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#738077]">
                  Peak Day
                </div>
                <div className="text-lg md:text-xl font-bold text-[#D93848] mt-0.5">
                  {dailyStats.maxAqi} AQI
                </div>
                <div className="text-[11px] text-[#738077]">Aug 16 (Sunday)</div>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EDE8DF]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#738077]">
                  Trough Day
                </div>
                <div className="text-lg md:text-xl font-bold text-[#5F7F6C] mt-0.5">
                  {dailyStats.minAqi} AQI
                </div>
                <div className="text-[11px] text-[#738077]">Aug 18 (Tuesday)</div>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EDE8DF]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#738077]">
                  Dataset Mean
                </div>
                <div className="text-lg md:text-xl font-bold text-[#19221C] mt-0.5">
                  {dailyStats.meanAqi.toFixed(1)} AQI
                </div>
                <div className="text-[11px] text-[#738077]">20-Day Baseline</div>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EDE8DF]">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#738077]">
                  Span Monitored
                </div>
                <div className="text-lg md:text-xl font-bold text-[#19221C] mt-0.5">
                  {dailyStats.totalDays} Days
                </div>
                <div className="text-[11px] text-[#738077]">Continuous logging</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
