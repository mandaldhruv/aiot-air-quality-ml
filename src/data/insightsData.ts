import type { InsightItem } from '../types';

export const insightsData: InsightItem[] = [
  {
    id: 'ins-01',
    category: 'Daily Variation',
    title: 'Multi-Day Temporal Fluctuation Across Late August',
    observation:
      'Historical daily averages span from a low of 93.9 AQI on 2026-08-18 to a peak of 224.1 AQI on 2026-08-16 across the 20 monitored dates.',
    dataEvidence:
      'Daily AQI series (2026-08-12 to 2026-08-31) shows periodic spikes exceeding 200 AQI followed by sharp drops into double digits, reflecting variable local atmospheric dispersion.',
    technicalNote:
      'Demonstrates that static fixed thresholds are insufficient; temporal tracking is necessary to detect multi-day accumulation cycles.',
  },
  {
    id: 'ins-02',
    category: 'Hourly Diurnal Pattern',
    title: 'Midday Elevation and Morning Atmospheric Dilution',
    observation:
      'The 24-hour aggregate profile exhibits its lowest average at 08:00 (142.1 AQI) and climbs steadily to peak at 13:00 (188.2 AQI), holding high through 17:00 (183.6 AQI).',
    dataEvidence:
      'Hourly aggregation across 24 bins reveals consistent midday air-quality degradation (12:00–17:00 mean of ~180 AQI) compared to night and early morning hours.',
    technicalNote:
      'Corresponds to ambient daytime thermal dynamics and local diurnal human activity patterns captured by the MQ135 and particulate sensors.',
  },
  {
    id: 'ins-03',
    category: 'Pollution Distribution',
    title: 'Prevalence of "Poor" Ambient Category in Logged Records',
    observation:
      'Of the 1,967 validated records, 1,202 records (61.11%) fall into the "Poor" category, 712 records (36.20%) into "Good", and 53 records (2.69%) into "Severe".',
    dataEvidence:
      'Categorical distribution confirms that typical operational ambient air is predominantly categorized as Poor, with acute Severe spikes occurring selectively (2.69%).',
    technicalNote:
      'Class imbalance informs feature engineering and regression target framing, ensuring continuous regression models are evaluated across both normal and elevated regimes.',
  },
  {
    id: 'ins-04',
    category: 'Forecast Progression',
    title: 'Predicted Late-Day Accumulation on 2026-09-01',
    observation:
      'The Random Forest model forecasts low-to-moderate AQI through the morning (trough of 75.4 at 08:00) before predicting an upward trend that peaks at 174.1 at 20:00.',
    dataEvidence:
      'Model trajectory for next_day shows values staying below 105 AQI until 15:00, followed by a steep climb into Poor territory from 17:00 to 23:00.',
    technicalNote:
      'Synthesized using diurnal mean temperature and humidity profiles coupled with date-derived calendar features (Tuesday, Month 9).',
  },
];
