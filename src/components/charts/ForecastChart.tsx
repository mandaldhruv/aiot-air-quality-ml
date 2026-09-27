import React, { useState, useEffect } from 'react';
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
import { forecastData, forecastMeta } from '../../data/forecastData';
import { Code2, Image as ImageIcon, Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ForecastChartProps {
  onViewCode?: (sectionId: string) => void;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ onViewCode }) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : false));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#E6E1D8] shadow-[0_4px_24px_rgba(30,40,35,0.05)] overflow-hidden transition-all duration-300 w-full min-w-0">
      {/* Header */}
      <div className="p-4 sm:p-6 md:p-8 border-b border-[#F0ECE3] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6B21A8] bg-[#F3E8FF] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-[#7E22CE]" />
              ML Model Output • 24-Hour Horizon
            </span>
            <span className="text-[11px] font-mono font-medium text-[#738077]">
              TARGET: {forecastMeta.forecastDate}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#19221C] tracking-tight">
            Predicted AQI for Next 24 Hours ({forecastMeta.forecastDate})
          </h3>
          <p className="text-xs md:text-sm text-[#48544D] mt-1 max-w-2xl leading-relaxed">
            Synthesized hourly feature vectors inferred through the trained Random Forest Regressor (200 estimators).
            Reveals projected air quality across 00:00 to 23:00.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${
              showOriginal
                ? 'bg-[#2F4D3E] text-white border-[#2F4D3E]'
                : 'bg-[#FAF8F5] text-[#2F4D3E] border-[#D8D2C6] hover:bg-[#EBF1ED]'
            }`}
            title="Compare with Matplotlib plot output"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            {showOriginal ? 'Show Interactive Chart' : 'View Colab Plot'}
          </button>

          <button
            type="button"
            onClick={() => onViewCode && onViewCode('sec-11')}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-[#19221C] bg-[#FAF8F5] hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-lg transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-[#5F7F6C]" />
            View Model & Forecast Code
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="p-4 sm:p-6 md:p-8">
        {showOriginal ? (
          <div className="space-y-4">
            <div className="bg-[#FAF8F5] rounded-xl p-3 sm:p-4 border border-[#E6E1D8] flex flex-col items-center">
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#738077] mb-3 gap-1">
                <span className="font-semibold text-[#19221C]">Matplotlib Output from Google Colab</span>
                <span className="font-mono text-[10px] sm:text-[11px] truncate">plt.plot(future_df['hour_label'], future_df['predicted_AQI'], color='purple')</span>
              </div>
              <img
                src="/graph-images/predicted_aqi_next_24h.webp"
                alt="Original Predicted AQI for Next 24 Hours plot output from Google Colab"
                className="w-full max-h-[420px] object-contain rounded-lg shadow-xs"
                loading="lazy"
              />
            </div>
            <p className="text-xs text-[#738077] italic text-center">
              TARGET: 28-09-2026. Purple line chart with circle markers plotted across 24 hourly steps.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-[280px] sm:h-[360px] md:h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 20, right: 15, left: -15, bottom: 25 }}
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
                    height={40}
                  />
                  <YAxis
                    domain={[60, 190]}
                    tick={{ fill: '#738077', fontSize: 11, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                    dx={-4}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as typeof forecastData[0];
                        return (
                          <div className="bg-[#19221C] text-white p-3.5 rounded-xl shadow-xl border border-[#3B284C] text-xs font-sans">
                            <div className="text-[10px] text-[#D8B4FE] uppercase font-semibold">
                              Forecast Horizon • {forecastMeta.forecastDate}
                            </div>
                            <div className="text-sm text-white font-medium mt-0.5">
                              Hour: <span className="font-bold">{item.timeLabel}</span>
                            </div>
                            <div className="text-lg font-extrabold text-[#F3E8FF] mt-1">
                              Predicted AQI: {item.predictedAqi.toFixed(1)}
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  item.predictedAqi > 150
                                    ? 'bg-[#E39B42]'
                                    : item.predictedAqi > 100
                                    ? 'bg-[#CF8630]'
                                    : 'bg-[#5F7F6C]'
                                }`}
                              />
                              <span className="text-[11px] text-[#D8D2C6]">
                                Category: {item.level}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine
                    y={100}
                    stroke="#CF8630"
                    strokeDasharray="3 3"
                    label={{
                      value: '100 AQI Threshold',
                      position: 'insideTopLeft',
                      fill: '#CF8630',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <ReferenceLine
                    y={forecastMeta.averagePredictedAqi}
                    stroke="#7E22CE"
                    strokeDasharray="4 4"
                    label={{
                      value: `Day Mean: ${forecastMeta.averagePredictedAqi.toFixed(1)}`,
                      position: 'insideBottomRight',
                      fill: '#7E22CE',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predictedAqi"
                    stroke="#7E22CE"
                    strokeWidth={2.6}
                    dot={{ fill: '#7E22CE', r: 4.5, strokeWidth: 1.5, stroke: '#FFFFFF' }}
                    activeDot={{ r: 7, fill: '#6B21A8', stroke: '#FFFFFF', strokeWidth: 2 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Diagnostic Forecast Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-[#F0ECE3]">
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EDE8DF]">
                <div className="flex items-center justify-between text-[#738077] mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Morning Trough
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5F7F6C]" />
                </div>
                <div className="text-xl font-extrabold text-[#5F7F6C]">
                  {forecastMeta.minPredictedAqi} AQI
                </div>
                <div className="text-xs text-[#738077] mt-0.5">
                  At {forecastMeta.minHour} (Optimal dispersion window)
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EDE8DF]">
                <div className="flex items-center justify-between text-[#738077] mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Evening Peak
                  </span>
                  <AlertTriangle className="w-3.5 h-3.5 text-[#CF8630]" />
                </div>
                <div className="text-xl font-extrabold text-[#CF8630]">
                  {forecastMeta.maxPredictedAqi} AQI
                </div>
                <div className="text-xs text-[#738077] mt-0.5">
                  At {forecastMeta.maxHour} (Post-sunset accumulation)
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EDE8DF]">
                <div className="flex items-center justify-between text-[#738077] mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Forecast 24h Mean
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#7E22CE]" />
                </div>
                <div className="text-xl font-extrabold text-[#19221C]">
                  {forecastMeta.averagePredictedAqi.toFixed(1)} AQI
                </div>
                <div className="text-xs text-[#738077] mt-0.5">
                  Integrated 24h diurnal average
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EDE8DF]">
                <div className="flex items-center justify-between text-[#738077] mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">
                    Model Architecture
                  </span>
                  <span className="text-[10px] font-semibold text-[#7E22CE] bg-[#F3E8FF] px-1.5 py-0.5 rounded">
                    Bagging
                  </span>
                </div>
                <div className="text-base font-bold text-[#19221C]">
                  Random Forest
                </div>
                <div className="text-xs text-[#738077] mt-0.5">
                  200 Trees • 5 Feature dimensions
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
