import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Menu, X, ArrowUpRight, Activity, Check } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  number: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('section-overview');
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const isManualScrollRef = useRef(false);
  const manualScrollTimerRef = useRef<number | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const navButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const navLinks: NavItem[] = [
    { label: 'Overview', id: 'section-overview', number: '01' },
    { label: 'Pipeline', id: 'section-pipeline', number: '02' },
    { label: 'Features', id: 'section-features', number: '03' },
    { label: 'EDA & Analysis', id: 'section-eda', number: '04' },
    { label: 'ML Model', id: 'section-model', number: '05' },
    { label: '24h Forecast', id: 'section-forecast', number: '06' },
    { label: 'Code Workspace', id: 'section-code', number: '07' },
    { label: 'Insights', id: 'section-insights', number: '08' },
  ];

  // Helper mapping: map internal sub-sections to their primary nav link
  const normalizeSectionId = (id: string): string => {
    if (id === 'section-eval') return 'section-model';
    return id;
  };

  // 1. Scroll-Spy implementation using IntersectionObserver + Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);

      // If user is currently smooth-scrolling due to a click, do not override
      if (isManualScrollRef.current) return;

      // Bottom of page detection (ensures the last section becomes active)
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        setActiveSection('section-insights');
        return;
      }

      // Check section bounding rects relative to top reading threshold (~140px)
      const sections = [
        'section-overview',
        'section-pipeline',
        'section-features',
        'section-eda',
        'section-model',
        'section-eval',
        'section-forecast',
        'section-code',
        'section-insights',
      ];

      const thresholdY = 160;
      let currentActive = 'section-overview';

      // If above overview (in hero area), keep Overview as pending or hero
      const overviewEl = document.getElementById('section-overview');
      if (overviewEl && overviewEl.getBoundingClientRect().top > thresholdY + 200) {
        // In Hero region
        currentActive = 'section-overview';
      } else {
        for (const secId of sections) {
          const el = document.getElementById(secId);
          if (el) {
            const rect = el.getBoundingClientRect();
            // If top of section has crossed or is just above threshold
            if (rect.top <= thresholdY) {
              currentActive = normalizeSectionId(secId);
            }
          }
        }
      }

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Update active moving underline indicator position on desktop
  const updateIndicator = () => {
    const activeBtn = navButtonRefs.current.get(activeSection);
    const container = navContainerRef.current;

    if (activeBtn && container) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();

      setIndicatorStyle({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useLayoutEffect(() => {
    updateIndicator();
  }, [activeSection]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeSection]);

  // 3. Navigation Click Handler
  const handleLinkClick = (id: string) => {
    // If clicking brand to hero, scroll to top
    if (id === 'section-hero') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      setActiveSection('section-overview');
      setMobileMenuOpen(false);
      return;
    }

    // Set immediate active state
    setActiveSection(normalizeSectionId(id));

    // Lock scroll-spy temporarily so it doesn't flicker while traveling
    isManualScrollRef.current = true;
    if (manualScrollTimerRef.current) {
      window.clearTimeout(manualScrollTimerRef.current);
    }
    manualScrollTimerRef.current = window.setTimeout(() => {
      isManualScrollRef.current = false;
    }, 700);

    onNavigate(id);
    setMobileMenuOpen(false);
  };

  // Keyboard accessibility: Escape key closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const activeItemObj = navLinks.find((item) => item.id === activeSection) || navLinks[0];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1D8] shadow-[0_2px_12px_rgba(25,34,28,0.04)]'
          : 'bg-[#FAF8F5] border-b border-[#EFEBE4]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <div
          onClick={() => handleLinkClick('section-hero')}
          className="cursor-pointer group flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4D3E] rounded-lg"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleLinkClick('section-hero')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#2F4D3E] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1E362A] transition-colors">
            <Activity className="w-4 h-4 text-[#D8E6DE]" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[#19221C] tracking-tight group-hover:text-[#2F4D3E] transition-colors leading-tight">
              AIoT Air Quality Network
            </div>
            <div className="text-[10px] font-semibold text-[#738077] uppercase tracking-wider hidden sm:block">
              ML & Environmental Data Workspace
            </div>
          </div>
        </div>

        {/* Desktop Navigation (>= 1024px) */}
        <nav
          ref={navContainerRef}
          aria-label="Main Section Navigation"
          className="hidden lg:flex items-center gap-0.5 xl:gap-1 relative py-1 px-1"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                ref={(el) => {
                  if (el) navButtonRefs.current.set(link.id, el);
                  else navButtonRefs.current.delete(link.id);
                }}
                onClick={() => handleLinkClick(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-2 xl:px-2.5 py-1.5 text-xs tracking-tight rounded-md transition-all duration-200 select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4D3E] ${
                  isActive
                    ? 'font-bold text-[#19221C] bg-[#2F4D3E]/[0.05]'
                    : 'font-medium text-[#526458] hover:text-[#19221C] hover:bg-[#2F4D3E]/[0.03]'
                }`}
              >
                <span>{link.label}</span>

                {/* Subtle Hover Underline cue for Inactive items */}
                {!isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-[#5F7F6C]/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </button>
            );
          })}

          {/* Persistent Shared Moving Active Underline Indicator */}
          <div
            className="absolute bottom-0 h-[2.5px] bg-[#2F4D3E] rounded-full transition-all duration-300 ease-out pointer-events-none"
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
              opacity: indicatorStyle.opacity,
            }}
          />
        </nav>

        {/* Right CTA Button (Desktop) & Active Pill (Tablet/Mobile) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Tablet/Mobile Active Section Chip (< 1024px) */}
          <div className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF1ED] border border-[#D6E3DB] rounded-full text-[11px] font-semibold text-[#2F4D3E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F4D3E] animate-pulse" />
            <span className="truncate max-w-[120px] sm:max-w-[160px]">
              {activeItemObj.label}
            </span>
          </div>

          {/* Forecast CTA Button (Desktop >= 1024px) */}
          <div className="hidden lg:block">
            <button
              onClick={() => handleLinkClick('section-forecast')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#2F4D3E] hover:bg-[#1F352A] rounded-lg shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4D3E]"
            >
              <span>View 24h Forecast</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hamburger Menu Button (< 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#19221C] hover:bg-[#EBF1ED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F4D3E]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer (< 1024px) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-b border-[#E6E1D8] bg-[#FAF8F5]/98 backdrop-blur-md px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
          role="dialog"
          aria-label="Mobile Navigation"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#EFEBE4] mb-3">
            <span className="text-[10px] font-bold text-[#738077] uppercase tracking-wider">
              Jump to Section
            </span>
            <span className="text-[10px] font-mono text-[#5F7F6C]">
              Active: {activeItemObj.label}
            </span>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#EBF1ED] text-[#2F4D3E] font-bold border border-[#D6E3DB] shadow-xs'
                      : 'text-[#48544D] hover:bg-[#F3EFE9] hover:text-[#19221C]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-[#2F4D3E] text-white' : 'bg-[#EFEBE4] text-[#738077]'
                      }`}
                    >
                      {link.number}
                    </span>
                    <span>{link.label}</span>
                  </div>

                  {isActive && (
                    <div className="flex items-center gap-1 text-[#2F4D3E]">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#EFEBE4] mt-3">
            <button
              onClick={() => handleLinkClick('section-forecast')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2F4D3E] hover:bg-[#1F352A] rounded-xl shadow-xs transition-colors"
            >
              <span>Explore 24h Forecast</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
