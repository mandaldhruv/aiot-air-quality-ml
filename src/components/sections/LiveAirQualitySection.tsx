import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import {
  Activity,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Thermometer,
  Droplets,
  Wind,
  Cpu,
  Bell,
} from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { fetchLiveAirQualityData, LIVE_REFRESH_INTERVAL } from '../../services/liveAirQualityService';
import { classifyAqi, GOOD_MAX, SEVERE_MIN } from '../../utils/livePolynomialModel';
import type { LiveDashboardData } from '../../types/live';

export const LiveAirQualitySection: React.FC = () => {
  const [data, setData] = useState<LiveDashboardData | null>(null);
  const [status, setStatus] = useState<'connecting' | 'live' | 'offline'>('connecting');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSuccessTime, setLastSuccessTime] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 640 : false));

  const inFlightRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Resize listener for responsive chart interval
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch function with robust in-flight and error handling
  const loadData = useCallback(async (isManual = false) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (isManual) setIsRefreshing(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const freshData = await fetchLiveAirQualityData(controller.signal);
      setData(freshData);
      setStatus('live');
      setLastSuccessTime(new Date());
      setErrorMessage(null);
      setSecondsAgo(0);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.warn('Live Google Sheet fetch error:', err);
      setStatus('offline');
      setErrorMessage(err instanceof Error ? err.message : 'Unable to refresh live data');
    } finally {
      inFlightRef.current = false;
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and periodic polling
  useEffect(() => {
    loadData();

    const pollTimer = setInterval(() => {
      loadData();
    }, LIVE_REFRESH_INTERVAL);

    const secondsTimer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(pollTimer);
      clearInterval(secondsTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  // Derived values for presentation
  const sensor = data?.sensor;
  const prediction = data?.prediction;
  const sensorClass = sensor ? classifyAqi(sensor.aqi) : null;
  const predClass = prediction ? classifyAqi(prediction.aqi) : null;

  // Severe warning check from the 24-hour forecast
  const severePoints = data?.forecast.filter((pt) => pt.predictedAqi > SEVERE_MIN) || [];
  const hasSevereForecast = severePoints.length > 0;
  const firstSeverePoint = severePoints[0];

  // Buzzer condition: ON only if prediction or sensor indicates Severe
  const isBuzzerOn = predClass?.level === 'Severe' || sensorClass?.level === 'Severe';

  return (
    <section id="section-live" className="py-12 sm:py-16 md:py-24 border-t border-[#E6E1D8] w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          number="LIVE"
          badge="Real-Time Telemetry & Inference"
          title="Current conditions, directly from the system."
          description="Live environmental sensor readings streamed from our physical sensing node via Google Sheets, evaluated on-the-fly through Degree-6 Polynomial Regression for instant 24-hour diurnal AQI forecasting."
          badgeColor="teal"
        />

        {/* Live Status Header Bar */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-3.5 sm:p-5 shadow-[0_2px_10px_rgba(30,40,35,0.03)] mb-6 sm:mb-8 transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              {status === 'live' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                  </span>
                  <span className="text-xs font-bold text-emerald-800 tracking-wider">LIVE</span>
                </div>
              )}

              {status === 'offline' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-amber-800 tracking-wider">OFFLINE</span>
                </div>
              )}

              {status === 'connecting' && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 tracking-wider">CONNECTING</span>
                </div>
              )}

              <div className="text-xs sm:text-sm text-[#19221C]">
                {status === 'live' && (
                  <span className="font-semibold text-[#2F4D3E]">
                    Google Sheet Connected
                    <span className="text-[#738077] font-normal hidden md:inline">
                      {' '}
                      • Polling every {(LIVE_REFRESH_INTERVAL / 1000).toFixed(0)}s
                    </span>
                  </span>
                )}
                {status === 'offline' && (
                  <span className="font-semibold text-amber-900">
                    Connection Unavailable
                    <span className="text-amber-700 font-normal"> • Preserving last received telemetry</span>
                  </span>
                )}
                {status === 'connecting' && (
                  <span className="font-semibold text-[#48544D]">
                    Establishing stream to live Google Sheet...
                  </span>
                )}
              </div>
            </div>

            {/* Timing & Manual Refresh Control */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-[#738077]">
              {lastSuccessTime ? (
                <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs">
                  <Clock className="w-3.5 h-3.5 text-[#5F7F6C]" />
                  <span>
                    Updated {lastSuccessTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                  <span className="text-[#A29C91]">({secondsAgo}s ago)</span>
                </div>
              ) : (
                <span className="font-mono text-[11px]">Syncing...</span>
              )}

              <button
                type="button"
                onClick={() => loadData(true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#2F4D3E] bg-[#FAF8F5] hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Fetch latest row from Google Sheet immediately"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Now</span>
              </button>
            </div>
          </div>

          {/* Stale/Error Notification Banner if offline */}
          {status === 'offline' && errorMessage && (
            <div className="mt-3 pt-3 border-t border-[#EDE8DF] text-xs text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Unable to refresh Google Sheet ({errorMessage}). Showing verified cache from{' '}
                {lastSuccessTime
                  ? lastSuccessTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : 'earlier session'}
                .
              </span>
            </div>
          )}
        </div>

        {/* Early Warning Banner (from Python Notebook logic) */}
        {data && (
          <div
            className={`mb-6 sm:mb-8 rounded-2xl p-4 sm:p-5 border transition-all ${
              hasSevereForecast
                ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
            }`}
          >
            <div className="flex items-start sm:items-center gap-3">
              {hasSevereForecast ? (
                <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5 sm:mt-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5 sm:mt-0" />
              )}
              <div className="text-xs sm:text-sm font-semibold leading-relaxed">
                {hasSevereForecast && firstSeverePoint ? (
                  <span>
                    <strong>Early Warning:</strong> AQI predicted to reach{' '}
                    <span className="font-bold underline">Severe levels (260+)</span> around{' '}
                    <span className="font-mono font-bold">{firstSeverePoint.timeLabel}</span>. Forecast diurnal peak ≈{' '}
                    <span className="font-mono font-bold">{data.peakAqi.toFixed(0)} AQI</span>.
                  </span>
                ) : (
                  <span>
                    <strong>Nominal Atmospheric Outlook:</strong> No Severe-level AQI forecast in the next 24 hours.
                    Diurnal peak projected at ≈ <span className="font-mono font-bold">{data.peakAqi.toFixed(0)} AQI</span>{' '}
                    around{' '}
                    <span className="font-mono font-bold">
                      {data.peakTime ? data.peakTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </span>
                    .
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Primary Metric Comparison Cards: Live Sensor vs Model Prediction */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-2 mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#738077]">
                Live Sensor Telemetry vs. Real-Time Model Inference
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#5F7F6C] hidden sm:inline">
              Model: Polynomial Regression · Degree 6
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Air Quality Index (AQI) */}
            <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-[0_2px_8px_rgba(30,40,35,0.03)] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#738077] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#2F4D3E]" />
                  Air Quality Index
                </span>
                {sensorClass && (
                  <span
                    className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border tracking-wider"
                    style={{
                      backgroundColor: sensorClass.bgLight,
                      color: sensorClass.textColor,
                      borderColor: sensorClass.borderColor,
                    }}
                  >
                    {sensorClass.level}
                  </span>
                )}
              </div>

              {/* Live vs Pred Comparison */}
              <div className="space-y-3 my-1">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#738077]">
                    Live Sensor Reading
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#19221C] tracking-tight">
                      {sensor ? sensor.aqi.toFixed(0) : '--'}
                    </span>
                    <span className="text-xs font-bold text-[#738077]">AQI</span>
                  </div>
                  <p className="text-[10px] text-[#738077] mt-0.5">
                    Streamed from edge node ({sensor ? sensor.timestamp : 'syncing'})
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#F0ECE3] bg-[#FAF8F5] -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#581C87] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#7E22CE]" />
                    Model Prediction (Now)
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-bold text-[#581C87]">
                      {prediction ? prediction.aqi.toFixed(1) : '--'}
                    </span>
                    <span className="text-xs font-semibold text-[#7E22CE]">AQI</span>
                    {predClass && (
                      <span className="text-[10px] font-semibold text-[#7E22CE] ml-auto">
                        {predClass.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: PM2.5 Particulate */}
            <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-[0_2px_8px_rgba(30,40,35,0.03)] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#738077] flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-[#366B6B]" />
                  PM2.5 Particulate
                </span>
                <span className="text-[10px] font-mono text-[#738077]">µg/m³</span>
              </div>

              <div className="space-y-3 my-1">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#738077]">
                    Live Sensor Reading
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#19221C] tracking-tight">
                      {sensor ? sensor.pm25.toFixed(1) : '--'}
                    </span>
                    <span className="text-xs font-bold text-[#738077]">µg/m³</span>
                  </div>
                  <p className="text-[10px] text-[#738077] mt-0.5">Laser optical dust transducer</p>
                </div>

                <div className="pt-2.5 border-t border-[#F0ECE3] bg-[#FAF8F5] -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#366B6B] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#366B6B]" />
                    Model Prediction (Now)
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-bold text-[#215454]">
                      {prediction ? prediction.pm25.toFixed(1) : '--'}
                    </span>
                    <span className="text-xs font-semibold text-[#366B6B]">µg/m³</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Ambient Temperature */}
            <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-[0_2px_8px_rgba(30,40,35,0.03)] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#738077] flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#9A5B15]" />
                  Ambient Temperature
                </span>
                <span className="text-[10px] font-mono text-[#738077]">°C</span>
              </div>

              <div className="space-y-3 my-1">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#738077]">
                    Live Sensor Reading
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#19221C] tracking-tight">
                      {sensor ? sensor.temp.toFixed(1) : '--'}
                    </span>
                    <span className="text-xs font-bold text-[#738077]">°C</span>
                  </div>
                  <p className="text-[10px] text-[#738077] mt-0.5">DHT22 environmental sensor</p>
                </div>

                <div className="pt-2.5 border-t border-[#F0ECE3] bg-[#FAF8F5] -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9A5B15] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#9A5B15]" />
                    Model Prediction (Now)
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-bold text-[#80460A]">
                      {prediction ? prediction.temp.toFixed(1) : '--'}
                    </span>
                    <span className="text-xs font-semibold text-[#9A5B15]">°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Relative Humidity */}
            <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-[0_2px_8px_rgba(30,40,35,0.03)] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#738077] flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#2563EB]" />
                  Relative Humidity
                </span>
                <span className="text-[10px] font-mono text-[#738077]">% RH</span>
              </div>

              <div className="space-y-3 my-1">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#738077]">
                    Live Sensor Reading
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#19221C] tracking-tight">
                      {sensor ? sensor.hum.toFixed(1) : '--'}
                    </span>
                    <span className="text-xs font-bold text-[#738077]">%</span>
                  </div>
                  <p className="text-[10px] text-[#738077] mt-0.5">Atmospheric water vapor fraction</p>
                </div>

                <div className="pt-2.5 border-t border-[#F0ECE3] bg-[#FAF8F5] -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#2563EB]" />
                    Model Prediction (Now)
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-bold text-[#1D4ED8]">
                      {prediction ? prediction.hum.toFixed(1) : '--'}
                    </span>
                    <span className="text-xs font-semibold text-[#2563EB]">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Diagnostics Row (3 Column layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          {/* Card 1: Model Forecast Horizon (Degree-6 Polynomial Regression) */}
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-[0_2px_8px_rgba(30,40,35,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#581C87] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#7E22CE]" />
                  Model Forecast Horizon
                </span>
                <span className="text-[10px] font-semibold text-[#7E22CE] bg-[#F3E8FF] px-2 py-0.5 rounded-full">
                  Degree-6 Poly
                </span>
              </div>
              <p className="text-xs text-[#738077] leading-relaxed mb-4">
                Short-term and 24-hour peak predictions generated by fitting diurnal polynomial features to historical telemetry.
              </p>

              {/* 4 Multi-Horizon Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="bg-[#FAF8F5] border border-[#EDE8DF] p-2.5 rounded-xl">
                  <div className="text-[10px] font-semibold text-[#738077] uppercase">Now</div>
                  <div className="text-base sm:text-lg font-extrabold text-[#19221C]">
                    {prediction ? prediction.aqi.toFixed(0) : '--'}
                  </div>
                  <div className="text-[10px] text-[#738077]">AQI</div>
                </div>
                <div className="bg-[#FAF8F5] border border-[#EDE8DF] p-2.5 rounded-xl">
                  <div className="text-[10px] font-semibold text-[#738077] uppercase">+1 Hour</div>
                  <div className="text-base sm:text-lg font-extrabold text-[#581C87]">
                    {data?.p1Aqi !== null && data?.p1Aqi !== undefined ? data.p1Aqi.toFixed(0) : '--'}
                  </div>
                  <div className="text-[10px] text-[#738077]">AQI</div>
                </div>
                <div className="bg-[#FAF8F5] border border-[#EDE8DF] p-2.5 rounded-xl">
                  <div className="text-[10px] font-semibold text-[#738077] uppercase">+3 Hours</div>
                  <div className="text-base sm:text-lg font-extrabold text-[#581C87]">
                    {data?.p3Aqi !== null && data?.p3Aqi !== undefined ? data.p3Aqi.toFixed(0) : '--'}
                  </div>
                  <div className="text-[10px] text-[#738077]">AQI</div>
                </div>
                <div className="bg-[#FAF8F5] border border-[#EDE8DF] p-2.5 rounded-xl">
                  <div className="text-[10px] font-semibold text-[#738077] uppercase">24h Peak</div>
                  <div className="text-base sm:text-lg font-extrabold text-[#CF8630]">
                    {data ? data.peakAqi.toFixed(0) : '--'}
                  </div>
                  <div className="text-[10px] text-[#738077]">
                    {data?.peakTime
                      ? data.peakTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '--:--'}
                  </div>
                </div>
              </div>
            </div>

            {/* Model Validation Note */}
            <div className="mt-4 pt-3 border-t border-[#F0ECE3] flex items-center justify-between text-[11px] text-[#738077]">
              <span>Validation Window (Last 24h):</span>
              <span className="font-mono font-semibold text-[#19221C]">
                MAE: {data?.validationMae !== null ? data?.validationMae : '--'} • R²: {data?.validationR2 !== null ? data?.validationR2 : '--'}
              </span>
            </div>
          </div>

          {/* Card 2: Device Readout ("Latest sensor readout") */}
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-[0_2px_8px_rgba(30,40,35,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#366B6B] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#366B6B]" />
                  Latest Sensor Readout
                </span>
                <span className="text-[10px] font-mono text-[#738077] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EDE8DF]">
                  ESP32 OLED Proxy
                </span>
              </div>
              <p className="text-xs text-[#738077] leading-relaxed mb-3">
                Visual representation of the physical 0.96″ I2C SSD1306 OLED display mounted on the edge prototype.
              </p>

              {/* Hardware Console Style OLED */}
              <div className="bg-[#0B1410] border-2 border-[#1E3A2B] rounded-xl p-3.5 font-mono text-xs text-[#5EEAD4] shadow-inner space-y-1 select-none">
                <div className="text-[10px] text-[#86EFAC] border-b border-[#1E3A2B] pb-1 flex justify-between">
                  <span>&gt; AIOT NODE #01</span>
                  <span>{status === 'live' ? 'WIFI: OK' : 'STATUS: DISC'}</span>
                </div>
                <div className="pt-1 flex justify-between">
                  <span>AQI:</span>
                  <span className="font-bold text-white">
                    {sensor ? sensor.aqi.toFixed(0) : '--'} ({sensorClass?.level || '--'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>PM2.5:</span>
                  <span className="font-bold text-white">{sensor ? sensor.pm25.toFixed(1) : '--'} ug/m3</span>
                </div>
                <div className="flex justify-between">
                  <span>Temp:</span>
                  <span className="font-bold text-white">{sensor ? sensor.temp.toFixed(1) : '--'} C</span>
                </div>
                <div className="flex justify-between">
                  <span>Humidity:</span>
                  <span className="font-bold text-white">{sensor ? sensor.hum.toFixed(1) : '--'} %</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-[#738077] italic text-center">
              Simulated monitor from latest telemetry row. Not a bi-directional command channel.
            </div>
          </div>

          {/* Card 3: Alert System Logic */}
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-[0_2px_8px_rgba(30,40,35,0.02)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9A5B15] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#9A5B15]" />
                  System Alert Logic
                </span>
                <span className="text-[10px] font-semibold text-[#9A5B15] bg-[#FDF3E7] px-2 py-0.5 rounded-full border border-[#F4DCB9]">
                  Edge Actuation Rule
                </span>
              </div>
              <p className="text-xs text-[#738077] leading-relaxed mb-4">
                Automated threshold escalation rules executed by the ESP32 firmware based on multi-parameter environmental hazards.
              </p>

              {/* Status List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shadow-xs"
                      style={{
                        backgroundColor: predClass?.color || '#16A34A',
                        boxShadow: `0 0 8px ${predClass?.color || '#16A34A'}`,
                      }}
                    />
                    <span className="font-semibold text-[#19221C]">RGB Indicator State</span>
                  </div>
                  <span className="font-bold" style={{ color: predClass?.color || '#16A34A' }}>
                    {predClass?.level || 'Normal'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#EDE8DF] rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Bell className={`w-3.5 h-3.5 ${isBuzzerOn ? 'text-red-600 animate-bounce' : 'text-[#738077]'}`} />
                    <span className="font-semibold text-[#19221C]">Acoustic Buzzer Rule</span>
                  </div>
                  <span
                    className={`font-bold font-mono px-2 py-0.5 rounded ${
                      isBuzzerOn
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isBuzzerOn ? 'ON 🔔 (AQI > 260)' : 'OFF (Nominal)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F0ECE3] flex items-center justify-between text-[11px] text-[#738077]">
              <span>Hazard Threshold: &gt; 260 AQI</span>
              <span>Severe Alerts in History: {data?.severeCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Live AQI History + Next 24-Hour Model Forecast Graph */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] shadow-[0_4px_24px_rgba(30,40,35,0.05)] p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F0ECE3]">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2F4D3E] bg-[#EBF1ED] px-2.5 py-0.5 rounded-full border border-[#D6E3DB]">
                  Continuous Telemetry & Horizon
                </span>
                <span className="text-[11px] font-mono text-[#738077]">
                  Rolling History (72 pts) + 24h Model Trajectory
                </span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#19221C] tracking-tight">
                Live AQI Trend & Next 24-Hour Model Forecast
              </h3>
            </div>

            {/* Restrained Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs shrink-0 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#16A34A] rounded-full inline-block" />
                <span className="text-[#19221C]">Live Sensor History</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-[#7E22CE] inline-block" />
                <span className="text-[#581C87]">Degree-6 Polynomial Forecast (24h)</span>
              </div>
            </div>
          </div>

          {/* Interactive Responsive Chart Canvas */}
          <div className="h-[300px] sm:h-[380px] md:h-[440px] w-full">
            {data && data.combinedChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.combinedChartData} margin={{ top: 15, right: 15, left: -15, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE8DF" vertical={false} />
                  <XAxis
                    dataKey="timeLabel"
                    tick={{ fill: '#738077', fontSize: 10, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                    interval={isMobile ? 8 : 4}
                    angle={-45}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis
                    domain={[40, 240]}
                    tick={{ fill: '#738077', fontSize: 11, fontFamily: 'Manrope' }}
                    tickLine={false}
                    axisLine={{ stroke: '#D8D2C6' }}
                    dx={-4}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as typeof data.combinedChartData[0];
                        const val = item.liveAqi ?? item.forecastAqi ?? 0;
                        const classification = classifyAqi(val);

                        return (
                          <div className="bg-[#19221C] text-white p-3.5 rounded-xl shadow-xl border border-[#3B284C] text-xs font-sans min-w-[200px]">
                            <div className="text-[10px] text-[#86EFAC] uppercase font-bold tracking-wider">
                              {item.type === 'forecast'
                                ? '🔮 24-Hour Model Forecast'
                                : item.type === 'now'
                                ? '📍 Present Transition Point'
                                : '📡 Ingested Sensor Reading'}
                            </div>
                            <div className="text-sm font-semibold text-[#EDE8DF] mt-1">
                              Time: <span className="font-bold text-white">{item.fullTimeStr}</span>
                            </div>
                            <div className="text-lg font-extrabold text-white mt-1">
                              AQI: {val.toFixed(1)}
                            </div>
                            <div className="mt-1.5 pt-1.5 border-t border-[#334139] flex items-center justify-between text-[11px]">
                              <span className="text-[#A29C91]">Category:</span>
                              <span
                                className="font-bold px-1.5 py-0.5 rounded text-[10px]"
                                style={{
                                  backgroundColor: classification.bgLight,
                                  color: classification.textColor,
                                }}
                              >
                                {classification.level}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Good Threshold (<= 150) */}
                  <ReferenceLine
                    y={GOOD_MAX}
                    stroke="#16A34A"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={{
                      value: '150 AQI (Good Upper Bound)',
                      position: 'insideTopLeft',
                      fill: '#16A34A',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />

                  {/* Severe Threshold (> 260) */}
                  <ReferenceLine
                    y={SEVERE_MIN}
                    stroke="#DC2626"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={{
                      value: '260 AQI (Severe Threshold)',
                      position: 'insideTopLeft',
                      fill: '#DC2626',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />

                  {/* Live Sensor History (Solid Line) */}
                  <Line
                    type="monotone"
                    dataKey="liveAqi"
                    stroke="#16A34A"
                    strokeWidth={2.4}
                    dot={{ fill: '#16A34A', r: 2.5, strokeWidth: 1, stroke: '#FFFFFF' }}
                    activeDot={{ r: 5, fill: '#16A34A', stroke: '#FFFFFF', strokeWidth: 2 }}
                    isAnimationActive={false}
                    name="Live AQI"
                  />

                  {/* 24-Hour Model Forecast (Dashed Line) */}
                  <Line
                    type="monotone"
                    dataKey="forecastAqi"
                    stroke="#7E22CE"
                    strokeWidth={2.2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 6, fill: '#6B21A8', stroke: '#FFFFFF', strokeWidth: 2 }}
                    isAnimationActive={false}
                    name="Polynomial Forecast"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 text-[#738077]">
                <RotateCw className="w-8 h-8 animate-spin text-[#2F4D3E] mb-2" />
                <span className="text-sm font-semibold text-[#19221C]">Loading live telemetry & forecast series...</span>
                <span className="text-xs text-[#738077] mt-1">Connecting to Google Sheet CSV stream</span>
              </div>
            )}
          </div>

          {/* Footnote distinguishing the two models clearly */}
          <div className="mt-4 pt-3 border-t border-[#F0ECE3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#738077]">
            <div>
              <span className="font-semibold text-[#19221C]">System Architecture Note: </span>
              This Live Air Quality section fits a{' '}
              <strong className="text-[#581C87]">Degree-6 Polynomial Regression</strong> model directly on dynamic edge
              telemetry.
            </div>
            <div className="text-[10px] text-[#5F7F6C] font-mono">
              Sections 05–09 evaluate the offline 200-tree Random Forest pipeline.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
