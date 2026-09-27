import React, { useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { pipelineSteps } from '../../data/pipelineSteps';
import {
  Cpu,
  Filter,
  Layers,
  Split,
  Network,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Info,
} from 'lucide-react';

interface PipelineSectionProps {
  onViewCodeSection?: (sectionId: string) => void;
}

export const PipelineSection: React.FC<PipelineSectionProps> = ({ onViewCodeSection }) => {
  const [selectedStepId, setSelectedStepId] = useState<string>(pipelineSteps[0].id);

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Filter':
        return <Filter className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'Split':
        return <Split className="w-4 h-4" />;
      case 'Network':
        return <Network className="w-4 h-4" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const selectedStep = pipelineSteps.find((s) => s.id === selectedStepId) || pipelineSteps[0];

  return (
    <section id="section-pipeline" className="py-12 sm:py-16 md:py-20 border-t border-[#E6E1D8] w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="04"
          badge="Machine Learning Pipeline"
          title="From Raw Ingestion to 24-Hour Forecasting"
          description="The complete end-to-end data transformation pipeline. Each phase addresses a specific engineering necessity—from datetime parsing and diurnal feature extraction to ensemble regression and synthetic horizon forecasting."
          badgeColor="teal"
        />

        {/* Pipeline Navigator (Horizontal scroll on desktop, vertical on mobile) */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-3.5 sm:p-4 md:p-6 shadow-[0_2px_12px_rgba(30,40,35,0.03)] mb-6 sm:mb-8">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#738077] mb-3 sm:mb-4">
            Pipeline Progression Flow — Select a Phase to Inspect
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2">
            {pipelineSteps.map((step) => {
              const isSelected = step.id === selectedStepId;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#2F4D3E] text-white border-[#2F4D3E] shadow-sm'
                      : 'bg-[#FAF8F5] text-[#19221C] border-[#EDE8DF] hover:bg-[#EBF1ED]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5 sm:mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isSelected ? 'text-[#D8E6DE]' : 'text-[#738077]'
                      }`}
                    >
                      {step.number}
                    </span>
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#2F4D3E]'
                      }`}
                    >
                      {getStepIcon(step.iconName)}
                    </div>
                  </div>

                  <div>
                    <div
                      className={`text-[11px] sm:text-xs font-bold leading-snug line-clamp-2 ${
                        isSelected ? 'text-white' : 'text-[#19221C]'
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detailed View Card */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-4 sm:p-6 md:p-8 shadow-[0_2px_12px_rgba(30,40,35,0.03)]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-[#F0ECE3]">
            <div className="flex items-start gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#2F4D3E] text-white flex items-center justify-center shrink-0 shadow-xs">
                {getStepIcon(selectedStep.iconName)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-[#5F7F6C]">
                    STAGE {selectedStep.number} OF 07
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#19221C] truncate">
                  {selectedStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#48544D] mt-0.5 sm:mt-1">{selectedStep.shortDesc}</p>
              </div>
            </div>

            <div className="bg-[#FAF8F5] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#EDE8DF] shrink-0 self-start md:self-auto">
              <span className="text-[10px] uppercase font-semibold text-[#738077] block">
                Colab / Python Stack
              </span>
              <span className="font-mono text-xs text-[#2F4D3E] font-medium">
                {selectedStep.techDetail}
              </span>
            </div>
          </div>

          <div className="pt-5 sm:pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#738077]">
                Technical Implementation Description
              </h4>
              <p className="text-xs sm:text-sm text-[#19221C] leading-relaxed">
                {selectedStep.details}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-xl border border-[#EDE8DF] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F4D3E] flex items-center gap-1.5 mb-2">
                  <Info className="w-3.5 h-3.5" />
                  Code Mapping
                </span>
                <p className="text-xs text-[#48544D] leading-relaxed">
                  Inspect the precise execution code corresponding to this phase in our interactive Python notebook workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onViewCodeSection) {
                    const stepCodeMap: Record<string, string> = {
                      'step-sensor': 'sec-02',
                      'step-cleaning': 'sec-03',
                      'step-features': 'sec-07',
                      'step-split': 'sec-08',
                      'step-model': 'sec-08',
                      'step-eval': 'sec-09',
                      'step-predict': 'sec-10',
                    };
                    onViewCodeSection(stepCodeMap[selectedStep.id] || 'sec-01');
                  }
                }}
                className="mt-4 inline-flex items-center justify-between w-full px-3.5 py-2 text-xs font-bold text-[#19221C] bg-white hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-lg transition-colors cursor-pointer"
              >
                <span>Jump to Code Section</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#5F7F6C]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
