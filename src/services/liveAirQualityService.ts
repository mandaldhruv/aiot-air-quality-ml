import type {
  LiveDashboardData,
  LiveSensorReading,
  ModelPrediction,
  ForecastPointItem,
  LiveHistoryPoint,
  CombinedChartPoint,
} from '../types/live';
import {
  fitPolynomialRegression,
  calculateValidationMetrics,
  SEVERE_MIN,
} from '../utils/livePolynomialModel';

export const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1ZMllvmi1a5X7rm-8n-PtagNYRcKB3Ur3ks7ayE8ZHjY/export?format=csv&gid=0';

export const LIVE_REFRESH_INTERVAL = 10000; // 10 seconds

/**
 * Robust date parser supporting DD-MM-YYYY, DD/MM/YYYY, ISO formats
 */
function parseSheetTimestamp(str: string): Date | null {
  if (!str) return null;
  const trimmed = str.trim();
  const m = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (m) {
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1;
    const year = parseInt(m[3], 10);
    const hour = m[4] ? parseInt(m[4], 10) : 0;
    const min = m[5] ? parseInt(m[5], 10) : 0;
    const sec = m[6] ? parseInt(m[6], 10) : 0;
    const d = new Date(year, month, day, hour, min, sec);
    return isNaN(d.getTime()) ? null : d;
  }
  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function formatTime(d: Date): string {
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function formatFullTime(d: Date): string {
  const day = d.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  return `${day} ${month}, ${formatTime(d)}`;
}

interface ParsedRow {
  timestamp: string;
  time: Date;
  hod: number;
  aqi: number;
  pm25: number;
  temp: number;
  hum: number;
  pollutionLevel?: string;
}

export async function fetchLiveAirQualityData(
  signal?: AbortSignal
): Promise<LiveDashboardData> {
  const urlWithCacheBuster = `${SHEET_CSV_URL}&_cb=${Date.now()}`;
  const response = await fetch(urlWithCacheBuster, {
    method: 'GET',
    signal,
    headers: {
      Accept: 'text/csv, text/plain, */*',
    },
  });

  if (!response.ok) {
    throw new Error(`Google Sheet returned HTTP ${response.status}: ${response.statusText}`);
  }

  const csvText = await response.text();
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('Google Sheet returned empty or invalid CSV data');
  }

  const header = lines[0].split(',').map((s) => s.trim());
  const colMap = {
    time: header.indexOf('Timestamp'),
    aqi: header.indexOf('AQI'),
    pm25: header.indexOf('PM2.5'),
    temp: header.indexOf('Temperature'),
    hum: header.indexOf('Humidity'),
    level: header.indexOf('Pollution Level'),
  };

  if (colMap.time === -1 || colMap.aqi === -1) {
    throw new Error('Required columns ("Timestamp", "AQI") missing in Google Sheet');
  }

  const parsedRows: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',').map((s) => s.trim());
    if (parts.length <= Math.max(colMap.time, colMap.aqi)) continue;

    const timeStr = parts[colMap.time];
    const parsedDate = parseSheetTimestamp(timeStr);
    if (!parsedDate) continue;

    const aqi = parseFloat(parts[colMap.aqi]);
    const pm25 = colMap.pm25 !== -1 ? parseFloat(parts[colMap.pm25]) : 0;
    const temp = colMap.temp !== -1 ? parseFloat(parts[colMap.temp]) : 0;
    const hum = colMap.hum !== -1 ? parseFloat(parts[colMap.hum]) : 0;
    const pollutionLevel = colMap.level !== -1 ? parts[colMap.level] : undefined;

    if (isNaN(aqi)) continue;

    const hod = parsedDate.getHours() + parsedDate.getMinutes() / 60;

    parsedRows.push({
      timestamp: timeStr,
      time: parsedDate,
      hod,
      aqi,
      pm25: isNaN(pm25) ? 0 : pm25,
      temp: isNaN(temp) ? 0 : temp,
      hum: isNaN(hum) ? 0 : hum,
      pollutionLevel,
    });
  }

  if (parsedRows.length === 0) {
    throw new Error('No valid telemetry rows could be parsed from the Google Sheet');
  }

  // Sort rows chronologically
  parsedRows.sort((a, b) => a.time.getTime() - b.time.getTime());

  // Latest row is the real physical sensor reading
  const latestRaw = parsedRows[parsedRows.length - 1];
  const sensor: LiveSensorReading = {
    timestamp: latestRaw.timestamp,
    time: latestRaw.time,
    aqi: latestRaw.aqi,
    pm25: latestRaw.pm25,
    temp: latestRaw.temp,
    hum: latestRaw.hum,
    pollutionLevel: latestRaw.pollutionLevel,
  };

  // 1. Train Degree-6 Polynomial Regression models
  const hods = parsedRows.map((r) => r.hod);
  const aqiVals = parsedRows.map((r) => r.aqi);
  const pm25Vals = parsedRows.map((r) => r.pm25);
  const tempVals = parsedRows.map((r) => r.temp);
  const humVals = parsedRows.map((r) => r.hum);

  // Validation on last 24 hours (as done in Python notebook)
  const lastTimestamp = latestRaw.time.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const trainIndices: number[] = [];
  const testIndices: number[] = [];

  for (let i = 0; i < parsedRows.length; i++) {
    if (parsedRows[i].time.getTime() <= lastTimestamp - oneDayMs) {
      trainIndices.push(i);
    } else {
      testIndices.push(i);
    }
  }

  let validationMae: number | null = null;
  let validationR2: number | null = null;

  if (trainIndices.length > 10 && testIndices.length > 0) {
    const trainHods = trainIndices.map((i) => hods[i]);
    const trainAqi = trainIndices.map((i) => aqiVals[i]);
    const testHods = testIndices.map((i) => hods[i]);
    const testAqi = testIndices.map((i) => aqiVals[i]);

    const metrics = calculateValidationMetrics(trainHods, trainAqi, testHods, testAqi);
    validationMae = Number(metrics.mae.toFixed(1));
    validationR2 = Number(metrics.r2.toFixed(2));
  }

  // Final models trained on all historical records
  const modelAqi = fitPolynomialRegression(hods, aqiVals, 6);
  const modelPm25 = fitPolynomialRegression(hods, pm25Vals, 6);
  const modelTemp = fitPolynomialRegression(hods, tempVals, 6);
  const modelHum = fitPolynomialRegression(hods, humVals, 6);

  // Current model prediction for "now"
  const currentHod = latestRaw.hod;
  const prediction: ModelPrediction = {
    aqi: Math.round(modelAqi.predict(currentHod) * 10) / 10,
    pm25: Math.round(modelPm25.predict(currentHod) * 10) / 10,
    temp: Math.round(modelTemp.predict(currentHod) * 10) / 10,
    hum: Math.round(modelHum.predict(currentHod) * 10) / 10,
  };

  // +1 hour and +3 hour AQI predictions
  const p1Hod = (currentHod + 1) % 24;
  const p3Hod = (currentHod + 3) % 24;
  const p1Aqi = Math.round(modelAqi.predict(p1Hod) * 10) / 10;
  const p3Aqi = Math.round(modelAqi.predict(p3Hod) * 10) / 10;

  // 24-Hour Horizon Forecast (49 points at 30-minute intervals from latest sensor time)
  const forecast: ForecastPointItem[] = [];
  const baseTime = latestRaw.time.getTime();

  let maxAqi = -Infinity;
  let peakTime: Date | null = null;

  for (let k = 0; k < 49; k++) {
    const pointTime = new Date(baseTime + k * 30 * 60 * 1000);
    const pointHod = pointTime.getHours() + pointTime.getMinutes() / 60;
    const predAqi = Math.round(modelAqi.predict(pointHod) * 10) / 10;

    forecast.push({
      time: pointTime,
      timeLabel: formatTime(pointTime),
      hod: pointHod,
      predictedAqi: predAqi,
    });

    if (predAqi > maxAqi) {
      maxAqi = predAqi;
      peakTime = pointTime;
    }
  }

  // Rolling live history (last 72 records from sheet, matching notebook)
  const historySlice = parsedRows.slice(-72);
  const history: LiveHistoryPoint[] = historySlice.map((r) => ({
    timestamp: r.timestamp,
    time: r.time,
    timeLabel: formatTime(r.time),
    aqi: r.aqi,
    pm25: r.pm25,
    temp: r.temp,
    hum: r.hum,
  }));

  // Build combined trend chart points: Live readings + 24h Model Forecast
  const combinedChartData: CombinedChartPoint[] = [];

  // Add historical points
  history.forEach((pt, idx) => {
    const isLatest = idx === history.length - 1;
    combinedChartData.push({
      timeLabel: pt.timeLabel,
      timestamp: pt.timestamp,
      fullTimeStr: formatFullTime(pt.time),
      liveAqi: pt.aqi,
      // If latest, also connect with initial forecast point to avoid line gap
      forecastAqi: isLatest ? prediction.aqi : undefined,
      type: isLatest ? 'now' : 'live',
    });
  });

  // Add future forecast points (from k=1 to 48)
  for (let k = 1; k < forecast.length; k++) {
    const fc = forecast[k];
    combinedChartData.push({
      timeLabel: fc.timeLabel,
      timestamp: formatTime(fc.time),
      fullTimeStr: formatFullTime(fc.time),
      forecastAqi: fc.predictedAqi,
      type: 'forecast',
    });
  }

  // Count severe occurrences across all records
  let severeCount = 0;
  for (const r of parsedRows) {
    if (r.aqi > SEVERE_MIN) severeCount++;
  }

  return {
    status: 'live',
    lastUpdated: new Date(),
    lastSuccessfulUpdate: new Date(),
    sensor,
    prediction,
    p1Aqi,
    p3Aqi,
    forecast,
    peakAqi: maxAqi,
    peakTime: peakTime || new Date(),
    history,
    combinedChartData,
    validationMae,
    validationR2,
    totalRecordsLoaded: parsedRows.length,
    severeCount,
  };
}
