import React, { useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { codeSections } from '../../data/codeSnippets';
import { CodeBlock } from '../common/CodeBlock';
import {
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCode,
} from 'lucide-react';

interface CodeWorkspaceProps {
  activeSectionId?: string;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({ activeSectionId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sec-01': false,
    'sec-02': false,
    'sec-03': false,
    'sec-04': true,
    'sec-05': false,
    'sec-06': false,
    'sec-07': true,
    'sec-08': true,
    'sec-09': true,
    'sec-10': false,
    'sec-11': true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    codeSections.forEach((s) => (all[s.id] = true));
    setExpandedSections(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    codeSections.forEach((s) => (all[s.id] = false));
    setExpandedSections(all);
  };

  const filteredSections = codeSections.filter((section) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(query) ||
      section.summary.toLowerCase().includes(query) ||
      section.code.toLowerCase().includes(query) ||
      section.sectionNumber.includes(query)
    );
  });

  return (
    <section id="section-code" className="py-16 md:py-20 border-t border-[#E6E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="09"
          badge="Python & Colab Environment"
          title="Inside the ML Workflow"
          description="Explore the complete executable Python script partitioned into eleven logical cells. Each module documents a concrete phase of our analytical and modeling process, from package imports to final forecast rendering."
          badgeColor="teal"
        />

        {/* Toolbar & Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-4 md:p-6 shadow-[0_2px_12px_rgba(30,40,35,0.03)] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#738077] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, functions, or variables (e.g. RandomForestRegressor, dropna)..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#D8D2C6] rounded-xl text-xs text-[#19221C] placeholder:text-[#738077] focus:outline-none focus:border-[#2F4D3E] transition-colors"
            />
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-semibold text-[#19221C] bg-[#FAF8F5] hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-lg transition-colors"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs font-semibold text-[#48544D] bg-[#FAF8F5] hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-lg transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Code Blocks Accordion */}
        <div className="space-y-4">
          {filteredSections.map((sec) => {
            const isExpanded = expandedSections[sec.id] || activeSectionId === sec.id;
            const isTargeted = activeSectionId === sec.id;

            return (
              <div
                key={sec.id}
                id={`code-${sec.id}`}
                className={`bg-white rounded-2xl border transition-all duration-300 shadow-[0_2px_8px_rgba(30,40,35,0.02)] ${
                  isTargeted
                    ? 'border-[#2F4D3E] ring-2 ring-[#2F4D3E]/20'
                    : 'border-[#E6E1D8] hover:border-[#D8D2C6]'
                }`}
              >
                {/* Cell Header */}
                <div
                  onClick={() => toggleSection(sec.id)}
                  className="p-5 md:p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="font-mono text-xs font-bold text-[#5F7F6C] bg-[#EBF1ED] px-2 py-1 rounded-md border border-[#D6E3DB]">
                      CELL {sec.sectionNumber}
                    </span>

                    <div>
                      <h3 className="text-base md:text-lg font-bold text-[#19221C]">
                        {sec.title}
                      </h3>
                      <p className="text-xs text-[#738077] mt-0.5 line-clamp-1">
                        {sec.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {sec.associatedGraphId && (
                      <span className="hidden sm:inline-flex text-[10px] font-semibold text-[#366B6B] bg-[#E3EFEF] px-2 py-0.5 rounded-full border border-[#C8DFDF]">
                        Linked to Graph
                      </span>
                    )}

                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#EDE8DF] flex items-center justify-center text-[#738077]">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-5 pb-6 md:px-6 md:pb-6 pt-0 border-t border-[#F0ECE3]">
                    <div className="pt-4 space-y-4">
                      <p className="text-xs sm:text-sm text-[#48544D] leading-relaxed">
                        {sec.summary}
                      </p>

                      {/* Code Viewer */}
                      <CodeBlock
                        code={sec.code}
                        language="python"
                        title={`Python Cell ${sec.sectionNumber} • ${sec.title}`}
                        showLineNumbers={true}
                      />

                      {/* Key Outputs List */}
                      {sec.keyOutputs && sec.keyOutputs.length > 0 && (
                        <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EDE8DF]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#738077] block mb-2">
                            Key Execution Assertions & Outputs
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {sec.keyOutputs.map((out, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-[#19221C]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#5F7F6C] shrink-0 mt-0.5" />
                                <span>{out}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#E6E1D8] p-12 text-center text-[#738077]">
              <FileCode className="w-8 h-8 mx-auto mb-2 text-[#D8D2C6]" />
              <p className="text-sm font-semibold">No code sections match your search query.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-[#2F4D3E] font-bold hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
