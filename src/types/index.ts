export interface DailyAqiPoint {
  date: string;
  formattedDate: string;
  dayOfWeek: string;
  aqi: number;
}

export interface HourlyAqiPoint {
  hour: number;
  timeLabel: string;
  aqi: number;
}

export interface PollutionDistributionItem {
  level: 'Good' | 'Poor' | 'Severe';
  count: number;
  percentage: number;
  color: string;
  badgeBg: string;
  description: string;
}

export interface ForecastPoint {
  hour: number;
  timeLabel: string;
  predictedAqi: number;
  level: 'Good' | 'Moderate' | 'Poor' | 'Severe';
}

export interface PipelineStep {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  details: string;
  iconName: string;
  techDetail: string;
}

export interface DatasetField {
  name: string;
  originalName: string;
  type: string;
  role: 'Model Feature' | 'Preprocessed' | 'Target' | 'Metadata';
  description: string;
  sampleValue: string;
}

export interface CodeSection {
  id: string;
  sectionNumber: string;
  title: string;
  summary: string;
  code: string;
  language: string;
  highlightLines?: number[];
  associatedGraphId?: string;
  keyOutputs?: string[];
}

export interface InsightItem {
  id: string;
  category: 'Daily Variation' | 'Hourly Diurnal Pattern' | 'Pollution Distribution' | 'Forecast Progression';
  title: string;
  observation: string;
  dataEvidence: string;
  technicalNote?: string;
}
