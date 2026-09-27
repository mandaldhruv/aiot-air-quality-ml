import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import {
  Cpu,
  Wifi,
  Eye,
  Radio,
  Maximize2,
  X,
  ArrowRight,
} from 'lucide-react';

interface PhysicalSystemSectionProps {
  onExplorePipeline?: () => void;
}

export const PhysicalSystemSection: React.FC<PhysicalSystemSectionProps> = ({
  onExplorePipeline,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Keyboard accessibility: Escape key closes lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false);
      }
    };
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen]);

  const hardwareHighlights = [
    {
      icon: <Cpu className="w-4 h-4 text-[#2F4D3E]" />,
      title: 'ESP32 Microcontroller',
      detail: 'Core edge computing node executing periodic multi-channel sensor polling and local analog-to-digital conversions.',
    },
    {
      icon: <Eye className="w-4 h-4 text-[#366B6B]" />,
      title: 'Environmental Sensors',
      detail: 'Multi-transducer array collecting temperature, relative humidity, gaseous contaminants, and particulate concentrations.',
    },
    {
      icon: <Radio className="w-4 h-4 text-[#5F7F6C]" />,
      title: 'Local OLED & Serial Telemetry',
      detail: 'SSD1306 display provides on-device readings while the serial monitor streams continuous formatted logs to ingestion storage.',
    },
    {
      icon: <Wifi className="w-4 h-4 text-[#C4841D]" />,
      title: 'Wireless Data Transmission',
      detail: 'Integrated 2.4 GHz WiFi protocol transmitting structured environmental payloads to cloud storage for machine learning.',
    },
  ];

  return (
    <section id="section-physical" className="py-12 sm:py-16 md:py-24 border-t border-[#E6E1D8] w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          number="03"
          badge="The Physical System"
          title="Where the data begins."
          description="Before the data reaches the analytical workflow, it begins with a physical sensing system built to collect environmental readings at the edge."
          badgeColor="sage"
        />

        {/* Asymmetric 2-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
          {/* Left Column: Context, Metadata & Engineering Notes (~42% on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4 text-sm text-[#48544D] leading-relaxed">
              <p>
                Every analytical graph, feature matrix row, and machine learning prediction across this platform originates from this physical prototype. Deployed as a breadboard testbed, the unit interfaces transducers directly with an ESP32 processing node.
              </p>
              <p>
                The prototype streams continuous environmental readings to cloud storage, establishing the empirical foundation required for robust machine learning model training and 24-hour diurnal air quality forecasting.
              </p>
            </div>

            {/* Hardware Architecture Spec Points */}
            <div className="pt-2 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#738077]">
                Edge Sensing Architecture
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {hardwareHighlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-[#E6E1D8] shadow-xs flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EFEBE4] shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#19221C]">{item.title}</div>
                      <div className="text-[11px] text-[#5A6860] mt-0.5 leading-snug">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Verification Note */}
            <div className="p-4 bg-[#EBF1ED] border border-[#D6E3DB] rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#2F4D3E] shrink-0" />
              <div className="text-xs text-[#2F4D3E] font-medium leading-relaxed">
                <span className="font-bold">Laboratory Ground Truth:</span> Serial telemetry logs from this physical node verified against the 1,967-sample dataset.
              </div>
            </div>
          </div>

          {/* Right Column: Real Hardware Photograph (~58% on desktop) */}
          <div className="lg:col-span-7 w-full min-w-0">
            <div className="relative group">
              {/* Photo Frame Container */}
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative overflow-hidden rounded-2xl border border-[#D8D2C6] bg-white shadow-[0_4px_20px_rgba(25,34,28,0.06)] cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4D3E]"
                role="button"
                tabIndex={0}
                aria-label="Click to enlarge photograph of the physical hardware prototype"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightboxOpen(true);
                  }
                }}
              >
                {/* The Real Hardware Photograph */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#EAE6DE]">
                  <img
                    src="/images/hardware/air-quality-monitoring-system.webp"
                    alt="Physical prototype of the AIoT air quality monitoring system"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.018]"
                    loading="lazy"
                  />

                  {/* Gentle hover vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#19221C]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Minimal "View Prototype" Inspection Affordance */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#19221C]/85 backdrop-blur-sm text-white text-xs font-semibold rounded-lg shadow-md border border-white/20">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View full photo</span>
                    </span>
                  </div>

                  {/* Live Prototype Status Pill (Top-Left) */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[#19221C] text-[11px] font-bold rounded-lg shadow-xs border border-[#E6E1D8]">
                      <span className="w-2 h-2 rounded-full bg-[#2F4D3E] animate-pulse" />
                      <span>Live Edge Ingestion</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Caption */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#738077] px-1">
                <span className="font-mono text-[10px] sm:text-[11px] text-[#5A6860]">
                  Physical prototype — AIoT Air Quality Monitoring System
                </span>
                <span className="text-[10px] text-[#8C988F] hidden sm:inline">
                  Click to inspect full resolution
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware → Data Pipeline Connection Bridge */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-4 sm:p-6 md:p-8 shadow-[0_2px_12px_rgba(30,40,35,0.03)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#366B6B]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#366B6B]">
                  System Bridge
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#19221C]">
                Environmental readings collected by the physical system become the input for the analytical workflow.
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6860] mt-1 leading-relaxed">
                Raw voltage signals from the MQ135 and digital pulses from the DHT22 and particulate sensor are serialized, converted into standard physical units, and synchronized into time-stamped datasets ready for machine learning.
              </p>
            </div>

            {/* Right: Linear Step Progression & Exploration Affordance */}
            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[10px] sm:text-[11px] font-mono font-semibold text-[#48544D]">
                <span className="px-2 sm:px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1D8]">
                  Sensors
                </span>
                <span className="text-[#8C988F]">→</span>
                <span className="px-2 sm:px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1D8]">
                  ESP32
                </span>
                <span className="text-[#8C988F]">→</span>
                <span className="px-2 sm:px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1D8]">
                  Collected Data
                </span>
                <span className="text-[#8C988F]">→</span>
                <span className="px-2 sm:px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1D8]">
                  Data Processing
                </span>
                <span className="text-[#8C988F]">→</span>
                <span className="px-2 sm:px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1D8]">
                  Machine Learning
                </span>
                <span className="text-[#8C988F]">→</span>
                <span className="px-2 sm:px-2.5 py-1 rounded-md bg-[#2F4D3E] text-white">
                  AQI Forecast
                </span>
              </div>

              {onExplorePipeline && (
                <button
                  type="button"
                  onClick={onExplorePipeline}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F4D3E] hover:text-[#19221C] transition-colors cursor-pointer group pt-1"
                >
                  <span>Explore Machine Learning Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged view of physical prototype photograph"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#19221C]/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] w-full bg-[#FAF8F5] rounded-2xl overflow-hidden shadow-2xl border border-[#D8D2C6] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-3.5 border-b border-[#E6E1D8] bg-[#FAF8F5] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#2F4D3E] shrink-0" />
                <span className="text-xs font-bold text-[#19221C] truncate">
                  Physical Prototype — AIoT Air Quality Monitoring System
                </span>
                <span className="text-xs text-[#738077] hidden sm:inline shrink-0">— Hardware Laboratory Setup</span>
              </div>

              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 rounded-lg text-[#48544D] hover:text-[#19221C] hover:bg-[#EFEBE4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4D3E] shrink-0"
                aria-label="Close full view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative overflow-auto max-h-[calc(92vh-100px)] p-2 sm:p-4 bg-[#19221C]/5 flex items-center justify-center">
              <img
                src="/images/hardware/air-quality-monitoring-system.webp"
                alt="Physical prototype of the AIoT air quality monitoring system full resolution"
                className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-xs"
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 border-t border-[#E6E1D8] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#738077]">
              <span>
                Demonstrating edge sensor array (DHT22, MQ135, Particulate sensor, SSD1306 OLED) connected to ESP32 node with live serial telemetry.
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] text-[#2F4D3E] shrink-0 font-semibold">
                Press Esc to close
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
