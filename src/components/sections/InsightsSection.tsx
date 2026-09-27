import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { insightsData } from '../../data/insightsData';
import { Lightbulb, Calendar, Clock, BarChart3, TrendingUp } from 'lucide-react';

export const InsightsSection: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Daily Variation':
        return <Calendar className="w-4 h-4 text-[#C65440]" />;
      case 'Hourly Diurnal Pattern':
        return <Clock className="w-4 h-4 text-[#366B6B]" />;
      case 'Pollution Distribution':
        return <BarChart3 className="w-4 h-4 text-[#CF8630]" />;
      case 'Forecast Progression':
        return <TrendingUp className="w-4 h-4 text-[#7E22CE]" />;
      default:
        return <Lightbulb className="w-4 h-4 text-[#5F7F6C]" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Daily Variation':
        return 'text-[#C65440] bg-[#FCECE9] border-[#F5CAC3]';
      case 'Hourly Diurnal Pattern':
        return 'text-[#215454] bg-[#E3EFEF] border-[#C8DFDF]';
      case 'Pollution Distribution':
        return 'text-[#9A5B15] bg-[#FDF3E7] border-[#F4DCB9]';
      case 'Forecast Progression':
        return 'text-[#581C87] bg-[#F3E8FF] border-[#E9D5FF]';
      default:
        return 'text-[#2F4D3E] bg-[#EBF1ED] border-[#D6E3DB]';
    }
  };

  return (
    <section id="section-insights" className="py-16 md:py-20 border-t border-[#E6E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="10"
          badge="Empirical Findings"
          title="What the Data Shows"
          description="Strictly descriptive findings derived directly from our 1,967 logged records and verified Colab visualizations. We document observed environmental patterns without unverified causal speculation."
          badgeColor="sage"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insightsData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E6E1D8] p-6 md:p-8 shadow-[0_2px_8px_rgba(30,40,35,0.02)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EDE8DF] flex items-center justify-center">
                    {getCategoryIcon(item.category)}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#19221C] mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#48544D] leading-relaxed mb-4">
                  {item.observation}
                </p>

                {/* Ground Truth Data Evidence */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EDE8DF] mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#738077] mb-1">
                    Supporting Data Evidence
                  </div>
                  <div className="text-xs text-[#19221C] leading-relaxed">
                    {item.dataEvidence}
                  </div>
                </div>
              </div>

              {item.technicalNote && (
                <div className="pt-3 border-t border-[#F0ECE3] text-[11px] text-[#738077] italic">
                  <strong>Engineering Significance:</strong> {item.technicalNote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
