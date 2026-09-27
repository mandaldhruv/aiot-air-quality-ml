import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { hardwareComponents, systemBoundaryExplanation } from '../../data/hardwareContext';
import { Cpu, Wifi, HardDrive, Bell, Thermometer, Wind, Eye } from 'lucide-react';

export const HardwareContext: React.FC = () => {
  const getIcon = (category: string, name: string) => {
    if (name.includes('DHT22')) return <Thermometer className="w-4 h-4 text-[#366B6B]" />;
    if (name.includes('MQ135')) return <Wind className="w-4 h-4 text-[#CF8630]" />;
    if (name.includes('Particulate')) return <Eye className="w-4 h-4 text-[#C65440]" />;
    if (name.includes('OLED')) return <Bell className="w-4 h-4 text-[#5F7F6C]" />;
    if (category === 'Compute') return <Cpu className="w-4 h-4 text-[#2F4D3E]" />;
    if (category === 'Cloud') return <HardDrive className="w-4 h-4 text-[#366B6B]" />;
    return <Wifi className="w-4 h-4 text-[#5F7F6C]" />;
  };

  return (
    <section id="section-overview" className="py-12 sm:py-16 md:py-20 border-t border-[#E6E1D8] w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="02"
          badge="Hardware & System Context"
          title="Physical AIoT Sensing Node Architecture"
          description="Our air quality monitoring network integrates physical microcontrollers and multi-parameter environmental transducers at the edge. The machine learning pipeline documented on this site begins once raw sensor readings are logged to cloud storage."
          badgeColor="sage"
        />

        {/* Boundary Card */}
        <div className="mb-8 sm:mb-10 bg-[#EBF1ED] border border-[#D6E3DB] rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-center">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2F4D3E] bg-white px-2.5 py-0.5 rounded-full border border-[#D6E3DB]">
                Hardware Boundary
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#19221C] mt-2">
                Edge Ingestion Scope
              </h3>
              <p className="text-xs sm:text-sm text-[#48544D] mt-1 leading-relaxed">
                {systemBoundaryExplanation.hardwareScope}
              </p>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-[#D6E3DB] pt-4 md:pt-0 md:pl-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#366B6B] bg-white px-2.5 py-0.5 rounded-full border border-[#C8DFDF]">
                Analytics Boundary
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#19221C] mt-2">
                Post-Collection ML Workflow
              </h3>
              <p className="text-xs sm:text-sm text-[#48544D] mt-1 leading-relaxed">
                {systemBoundaryExplanation.softwareScope}
              </p>
            </div>
          </div>
        </div>

        {/* Hardware Components Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {hardwareComponents.map((comp) => (
            <div
              key={comp.name}
              className="bg-white p-4 sm:p-5 rounded-xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EDE8DF] flex items-center justify-center">
                    {getIcon(comp.category, comp.name)}
                  </div>
                  <span className="text-[10px] font-semibold text-[#738077] uppercase tracking-wider bg-[#FAF8F5] px-2 py-0.5 rounded">
                    {comp.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#19221C]">{comp.name}</h4>
                <div className="text-[11px] font-medium text-[#5F7F6C] mt-0.5">{comp.role}</div>
                <p className="text-xs text-[#738077] mt-2 leading-relaxed">{comp.specs}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0ECE3] text-[10px] sm:text-[11px] text-[#48544D] font-mono break-all sm:break-normal">
                {comp.connection}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
