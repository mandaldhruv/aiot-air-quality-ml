import React from 'react';

interface SectionHeaderProps {
  number: string;
  badge: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
  badgeColor?: 'sage' | 'amber' | 'teal' | 'coral' | 'purple';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  number,
  badge,
  title,
  description,
  align = 'left',
  badgeColor = 'sage',
}) => {
  const badgeClasses = {
    sage: 'text-[#2F4D3E] bg-[#EBF1ED] border-[#D6E3DB]',
    amber: 'text-[#9A5B15] bg-[#FDF3E7] border-[#F4DCB9]',
    teal: 'text-[#215454] bg-[#E3EFEF] border-[#C8DFDF]',
    coral: 'text-[#A03825] bg-[#FCECE9] border-[#F5CAC3]',
    purple: 'text-[#581C87] bg-[#F3E8FF] border-[#E9D5FF]',
  };

  return (
    <div className={`mb-8 sm:mb-10 md:mb-14 w-full min-w-0 ${align === 'center' ? 'text-center mx-auto max-w-3xl' : 'max-w-3xl'}`}>
      <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="font-mono text-xs font-bold text-[#738077] tracking-wider">
          {number}
        </span>
        <span className="text-[#D8D2C6]">—</span>
        <span
          className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badgeClasses[badgeColor]}`}
        >
          {badge}
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#19221C] tracking-tight leading-[1.18] sm:leading-[1.15]">
        {title}
      </h2>

      <p className="text-xs sm:text-sm md:text-base text-[#48544D] mt-2 sm:mt-3 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
