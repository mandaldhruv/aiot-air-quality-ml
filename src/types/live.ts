export interface LiveSensorReading {
  timestamp: string;
  time: Date;
  aqi: number;
  pm25: number;
  temp: number;
  hum: number;
  pollutionLevel?: string;
}

export interface ModelPrediction {
  aqi: number;
  pm25: number;
  temp: number;
  hum: number;
}

export interface ForecastPointItem {
  time: Date;
  timeLabel: string;
  hod: number;
  predictedAqi: number;
}

export interface LiveHistoryPoint {
  timestamp: string;
  time: Date;
  timeLabel: string;
  aqi: number;
  pm25: number;
  temp: number;
  hum: number;
}

export interface CombinedChartPoint {
  timeLabel: string;
  timestamp: string;
  fullTimeStr: string;
  liveAqi?: number;
  forecastAqi?: number;
  type: 'live' | 'forecast' | 'now';
}

export interface LiveDashboardData {
  status: 'connecting' | 'live' | 'offline';
  lastUpdated: Date | null;
  lastSuccessfulUpdate: Date | null;
  sensor: LiveSensorReading | null;
  prediction: ModelPrediction | null;
  p1Aqi: number | null;
  p3Aqi: number | null;
  forecast: ForecastPointItem[];
  peakAqi: number;
  peakTime: Date | null;
  history: LiveHistoryPoint[];
  combinedChartData: CombinedChartPoint[];
  validationMae: number | null;
  validationR2: number | null;
  totalRecordsLoaded: number;
  severeCount: number;
  errorMessage?: string;
}
