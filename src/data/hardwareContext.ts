export interface HardwareComponent {
  name: string;
  role: string;
  specs: string;
  connection: string;
  category: 'Compute' | 'Sensing' | 'Feedback' | 'Cloud';
}

export const hardwareComponents: HardwareComponent[] = [
  {
    name: 'ESP32 Microcontroller',
    role: 'Edge Processing & Telemetry Node',
    specs: 'Dual-core Tensilica Xtensa 32-bit LX6 @ 240MHz, integrated 2.4 GHz 802.11 b/g/n Wi-Fi',
    connection: 'Central System Controller',
    category: 'Compute',
  },
  {
    name: 'DHT22 Digital Sensor',
    role: 'Ambient Temperature & Humidity Sensing',
    specs: '-40 to 80°C range (±0.5°C accuracy), 0–100% RH (±2% accuracy)',
    connection: 'Single-bus Digital GPIO',
    category: 'Sensing',
  },
  {
    name: 'MQ135 Gas Sensor',
    role: 'Air Quality & Hazardous Gas Detection',
    specs: 'SnO2 semiconductor surface detecting NH3, NOx, alcohol, benzene, smoke, CO2',
    connection: 'Analog ADC Pin',
    category: 'Sensing',
  },
  {
    name: 'Particulate Matter Sensor',
    role: 'Fine Suspended Dust & PM2.5 Counting',
    specs: 'Laser optical scattering mechanism measuring PM2.5 mass density in μg/m³',
    connection: 'UART Serial Communication',
    category: 'Sensing',
  },
  {
    name: 'OLED Display (0.96")',
    role: 'Local Visual Readout at Node',
    specs: '128x64 monochrome pixels displaying real-time AQI and network state',
    connection: 'I2C Interface (SDA / SCL)',
    category: 'Feedback',
  },
  {
    name: 'RGB LED & Active Buzzer',
    role: 'Multisensory Alert Subsystem',
    specs: 'Color-coded states (Green: Good, Amber: Poor, Red: Severe) + acoustic threshold alarm',
    connection: 'PWM GPIO Pins',
    category: 'Feedback',
  },
  {
    name: 'Google Apps Script & Sheets',
    role: 'Cloud Ingestion & Historical Storage',
    specs: 'HTTPS POST REST webhook endpoint appending rows into structured tabular sheet storage',
    connection: 'Cloud Telemetry Link',
    category: 'Cloud',
  },
];

export const systemBoundaryExplanation = {
  hardwareScope:
    'The physical sensing node operates at the edge, continuously logging microclimatic parameters into a cloud spreadsheet via Google Apps Script.',
  softwareScope:
    'This analytical workspace documents the downstream data science pipeline: transforming historical sensor logs into clean feature matrices, training the Random Forest Regressor, evaluating prediction accuracy, and generating the next 24-hour AQI forecast.',
};
