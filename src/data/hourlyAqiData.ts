import type { HourlyAqiPoint } from '../types';

export const hourlyAqiData: HourlyAqiPoint[] = [
  { hour: 0, timeLabel: '00:00', aqi: 162.7 },
  { hour: 1, timeLabel: '01:00', aqi: 167.3 },
  { hour: 2, timeLabel: '02:00', aqi: 155.4 },
  { hour: 3, timeLabel: '03:00', aqi: 150.2 },
  { hour: 4, timeLabel: '04:00', aqi: 171.5 },
  { hour: 5, timeLabel: '05:00', aqi: 173.8 },
  { hour: 6, timeLabel: '06:00', aqi: 155.3 },
  { hour: 7, timeLabel: '07:00', aqi: 153.8 },
  { hour: 8, timeLabel: '08:00', aqi: 142.1 },
  { hour: 9, timeLabel: '09:00', aqi: 161.2 },
  { hour: 10, timeLabel: '10:00', aqi: 159.6 },
  { hour: 11, timeLabel: '11:00', aqi: 167.4 },
  { hour: 12, timeLabel: '12:00', aqi: 187.5 },
  { hour: 13, timeLabel: '13:00', aqi: 188.2 },
  { hour: 14, timeLabel: '14:00', aqi: 172.6 },
  { hour: 15, timeLabel: '15:00', aqi: 180.9 },
  { hour: 16, timeLabel: '16:00', aqi: 173.4 },
  { hour: 17, timeLabel: '17:00', aqi: 183.6 },
  { hour: 18, timeLabel: '18:00', aqi: 175.8 },
  { hour: 19, timeLabel: '19:00', aqi: 167.9 },
  { hour: 20, timeLabel: '20:00', aqi: 162.8 },
  { hour: 21, timeLabel: '21:00', aqi: 168.0 },
  { hour: 22, timeLabel: '22:00', aqi: 159.1 },
  { hour: 23, timeLabel: '23:00', aqi: 162.8 },
];

export const hourlyStats = {
  peakHour: '13:00',
  peakAqi: 188.2,
  troughHour: '08:00',
  troughAqi: 142.1,
  middayMean: 180.5, // 12:00 - 17:00
};
