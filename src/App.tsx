import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { HardwareContext } from './components/sections/HardwareContext';
import { PhysicalSystemSection } from './components/sections/PhysicalSystemSection';
import { PipelineSection } from './components/sections/PipelineSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { EdaSection } from './components/sections/EdaSection';
import { ModelSection } from './components/sections/ModelSection';
import { EvaluationSection } from './components/sections/EvaluationSection';
import { ForecastSection } from './components/sections/ForecastSection';
import { CodeWorkspace } from './components/sections/CodeWorkspace';
import { InsightsSection } from './components/sections/InsightsSection';

export const App: React.FC = () => {
  const [activeCodeSectionId, setActiveCodeSectionId] = useState<string | undefined>();

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const handleViewCode = (sectionId: string) => {
    setActiveCodeSectionId(sectionId);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Smooth scroll to the code workspace
    const codeEl = document.getElementById('section-code');
    if (codeEl) {
      codeEl.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
    // Also scroll down to the specific cell after a tiny delay
    setTimeout(() => {
      const cellEl = document.getElementById(`code-${sectionId}`);
      if (cellEl) {
        cellEl.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    }, prefersReducedMotion ? 50 : 350);
  };

  const handleScrollTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAF8F5] text-[#19221C] flex flex-col font-sans selection:bg-[#D7E3DC] selection:text-[#182B21]">
      {/* Sticky Editorial Header */}
      <Navbar onNavigate={scrollToSection} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full min-w-0">
        {/* 01: Hero Section */}
        <HeroSection
          onExploreClick={() => scrollToSection('section-pipeline')}
          onForecastClick={() => scrollToSection('section-forecast')}
        />

        {/* 02: Hardware System Context */}
        <HardwareContext />

        {/* 03: The Physical System (Real Hardware Prototype Showcase) */}
        <PhysicalSystemSection onExplorePipeline={() => scrollToSection('section-pipeline')} />

        {/* 04: ML Data Pipeline */}
        <PipelineSection onViewCodeSection={handleViewCode} />

        {/* 04: Dataset & Feature Matrix */}
        <FeaturesSection />

        {/* 05: Exploratory Data Analysis (EDA) */}
        <EdaSection onViewCode={handleViewCode} />

        {/* 06: Machine Learning Model */}
        <ModelSection onViewCode={handleViewCode} />

        {/* 07: Model Evaluation */}
        <EvaluationSection onViewCode={handleViewCode} />

        {/* 08: 24-Hour AQI Forecast */}
        <ForecastSection onViewCode={handleViewCode} />

        {/* 09: Code Workspace ("Inside the ML Workflow") */}
        <CodeWorkspace activeSectionId={activeCodeSectionId} />

        {/* 10: Empirical Insights */}
        <InsightsSection />
      </main>

      {/* 11: Project Footer */}
      <Footer onScrollTop={handleScrollTop} />
    </div>
  );
};

export default App;
