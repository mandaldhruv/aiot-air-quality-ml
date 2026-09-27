import React, { useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import {
  availableDatasetFields,
  modelFeatureNames,
  implementationNote,
} from '../../data/featureDefinitions';
import { AlertCircle, Database, Sparkles, Filter } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

export const FeaturesSection: React.FC = () => {
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredFields = availableDatasetFields.filter((field) => {
    if (filterRole === 'all') return true;
    if (filterRole === 'model') return field.role === 'Model Feature';
    if (filterRole === 'target') return field.role === 'Target';
    return field.role === 'Preprocessed' || field.role === 'Metadata';
  });

  return (
    <section id="section-features" className="py-12 sm:py-16 md:py-20 border-t border-[#E6E1D8] w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="05"
          badge="Data Schema & Feature Engineering"
          title="Dataset Fields vs. Model Feature Matrix"
          description="In our Python workflow, raw logging headers are transformed into a disciplined numerical matrix. We clearly distinguish between general dataset fields recorded by the nodes and the specific five features supplied to the Random Forest Regressor."
          badgeColor="amber"
        />

        {/* High-level Feature vs Target Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#366B6B] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Model Feature Vector (X)
            </div>
            <div className="text-lg sm:text-xl font-bold text-[#19221C] mb-2">
              5 Input Dimensions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {modelFeatureNames.map((feat) => (
                <span
                  key={feat}
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#E3EFEF] text-[#215454] border border-[#C8DFDF]"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#CF8630] mb-2 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Regression Target (y)
            </div>
            <div className="text-lg sm:text-xl font-bold text-[#19221C] mb-2">
              Continuous AQI
            </div>
            <p className="text-xs text-[#48544D]">
              Calculated Air Quality Index based on gas (MQ135) and particulate sensor responses, evaluated as a scalar float value.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5F7F6C] mb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Dataset Ingestion
            </div>
            <div className="text-lg sm:text-xl font-bold text-[#19221C] mb-2">
              11 Raw Fields Logged
            </div>
            <p className="text-xs text-[#48544D]">
              Parsed datetime components, environmental metrics, spatial metadata, and discrete pollution severity categories.
            </p>
          </div>
        </div>

        {/* Mandatory Implementation Note Box */}
        <div className="mb-10 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-3 flex-1 min-w-0 max-w-full">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                  {implementationNote.badge}
                </span>
                <h3 className="text-base md:text-lg font-bold text-[#92400E]">
                  {implementationNote.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#78350F] leading-relaxed">
                {implementationNote.description}
              </p>
              <div className="mt-3 min-w-0 max-w-full overflow-hidden">
                <CodeBlock
                  code={implementationNote.codeSnippet}
                  language="python"
                  title="Code Consistency Solution"
                  showLineNumbers={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Field Details Filter & Table */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] shadow-[0_2px_12px_rgba(30,40,35,0.03)] overflow-hidden min-w-0 max-w-full">
          <div className="p-4 sm:p-6 border-b border-[#F0ECE3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#19221C]">
                Schema Breakdown
              </h3>
              <p className="text-xs text-[#738077] mt-0.5">
                Inspect how each logged sensor and derived column behaves across data cleaning and training.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { label: 'All Fields (11)', value: 'all' },
                { label: 'Model Features (5)', value: 'model' },
                { label: 'Target Variable (1)', value: 'target' },
                { label: 'Context / Metadata (5)', value: 'other' },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilterRole(btn.value)}
                  className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                    filterRole === btn.value
                      ? 'bg-[#2F4D3E] text-white border-[#2F4D3E]'
                      : 'bg-[#FAF8F5] text-[#48544D] border-[#D8D2C6] hover:bg-[#EBF1ED]'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-w-full">
            <table className="w-full min-w-[620px] text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-[11px] font-bold text-[#738077] uppercase tracking-wider border-b border-[#E6E1D8]">
                  <th className="py-3 px-6">Field Name</th>
                  <th className="py-3 px-4">Raw Header</th>
                  <th className="py-3 px-4">Data Type</th>
                  <th className="py-3 px-4">Pipeline Role</th>
                  <th className="py-3 px-6">Sample Value</th>
                  <th className="py-3 px-6">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE3] text-xs">
                {filteredFields.map((field) => (
                  <tr key={field.name} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#19221C]">
                      {field.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#738077]">
                      {field.originalName}
                    </td>
                    <td className="py-3.5 px-4 text-[#48544D]">
                      <span className="font-mono text-[11px] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EDE8DF]">
                        {field.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          field.role === 'Model Feature'
                            ? 'bg-[#E3EFEF] text-[#215454] border-[#C8DFDF]'
                            : field.role === 'Target'
                            ? 'bg-[#FDF3E7] text-[#9A5B15] border-[#F4DCB9]'
                            : 'bg-[#F2EFE9] text-[#48544D] border-[#E0DACE]'
                        }`}
                      >
                        {field.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-[#19221C] font-semibold">
                      {field.sampleValue}
                    </td>
                    <td className="py-3.5 px-6 text-[#48544D] max-w-xs leading-relaxed">
                      {field.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
