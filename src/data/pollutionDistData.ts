import type { PollutionDistributionItem } from '../types';

export const pollutionDistData: PollutionDistributionItem[] = [
  {
    level: 'Poor',
    count: 1202,
    percentage: 61.11,
    color: '#CF8630', // warm amber
    badgeBg: '#FDF3E7',
    description: 'Elevated AQI readings reflecting typical urban ambient pollution conditions during recorded monitoring cycles.',
  },
  {
    level: 'Good',
    count: 712,
    percentage: 36.20,
    color: '#5F7F6C', // soft sage green
    badgeBg: '#EBF1ED',
    description: 'Clean air conditions with minimal particulate and pollutant sensor response, predominantly early mornings and post-precipitation.',
  },
  {
    level: 'Severe',
    count: 53,
    percentage: 2.69,
    color: '#C65440', // soft coral / red
    badgeBg: '#FCECE9',
    description: 'Acute pollution episodes exceeding standard threshold limits, occurring in focused episodic bursts.',
  },
];

export const pollutionStats = {
  totalSamples: 1967,
  predominantLevel: 'Poor',
  poorPlusSeverePercentage: 63.80,
  goodPercentage: 36.20,
};
