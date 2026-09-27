import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts';
import { pollutionDistData } from '../../data/pollutionDistData';
import { Code2, Image as ImageIcon } from 'lucide-react';

interface PollutionChartProps {
  onViewCode?: (sectionId: string) => void;
}

export const PollutionChart: React.FC<PollutionChartProps> = ({ onViewCode }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E6E1D8] shadow-[0_2px_12px_rgba(30,40,35,0.03)] overflow-hidden transition-all duration-300 h-full flex flex-col justify-between w-full min-w-0">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#F0ECE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CF8630] bg-[#FDF3E7] px-2.5 py-0.5 rounded-full">
              Classification • 1,967 Records
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-[#19221C] tracking-tight">
            Pollution Level Distribution
          </h3>
          <p className="text-xs text-[#48544D] mt-0.5">
            Breakdown of categorized environmental air states across all logged dataset intervals.
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
            title="Compare with Matplotlib plot output"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {showOriginal ? 'Interactive' : 'Colab Plot'}
          </button>

          <button
            type="button"
            onClick={() => onViewCode && onViewCode('sec-06')}
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
                <span className="font-semibold text-[#19221C]">Matplotlib Categorical Output</span>
                <span className="font-mono text-[10px]">df['Pollution Level'].value_counts()</span>
              </div>
              <img
                src="/graph-images/pollution_level_distribution.webp"
                alt="Original Pollution Level Distribution plot output from Google Colab"
                className="w-full max-h-[300px] object-contain rounded-lg shadow-xs"
                loading="lazy"
              />
            </div>
            <p className="text-[11px] text-[#738077] italic text-center">
              Rendered using <code className="font-mono text-[#2F4D3E] break-all">plt.bar(level_counts.index, level_counts.values)</code> with count labels
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pollutionDistData}
                  margin={{ top: 25, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" vertical={false} />
                  <XAxis
                    dataKey="level"
                    tick={{ fill: '#19221C', fontSize: 12, fontWeight: 600, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                  />
                  <YAxis
                    domain={[0, 1350]}
                    tick={{ fill: '#738077', fontSize: 10, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as typeof pollutionDistData[0];
                        return (
                          <div className="bg-[#19221C] text-white p-2.5 rounded-lg shadow-lg border border-[#2F4D3E] text-xs font-sans">
                            <div className="text-[10px] text-[#A6B8AC] uppercase font-semibold">
                              Category: {item.level}
                            </div>
                            <div className="text-sm font-bold text-white mt-0.5">
                              Count: {item.count.toLocaleString()} samples
                            </div>
                            <div className="text-[11px] text-[#D8D2C6] mt-0.5">
                              Share: {item.percentage.toFixed(2)}% of dataset
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
                    <LabelList
                      dataKey="count"
                      position="top"
                      fill="#19221C"
                      fontSize={12}
                      fontWeight={700}
                      fontFamily="Manrope"
                      offset={6}
                    />
                    {pollutionDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category breakdown pills */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F0ECE3]">
              {pollutionDistData.map((item) => (
                <div
                  key={item.level}
                  className="p-2 rounded-lg border text-center transition-all"
                  style={{
                    backgroundColor: item.badgeBg,
                    borderColor: `${item.color}40`,
                  }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#738077]">
                    {item.level}
                  </div>
                  <div className="text-sm md:text-base font-extrabold text-[#19221C]">
                    {item.count.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-semibold text-[#48544D]">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
