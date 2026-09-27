import type { DatasetField } from '../types';

export const availableDatasetFields: DatasetField[] = [
  {
    name: 'date',
    originalName: 'Date',
    type: 'datetime64[ns]',
    role: 'Preprocessed',
    description: 'Calendar date parsed using dayfirst=True to establish chronological sequence.',
    sampleValue: '2026-08-16',
  },
  {
    name: 'time',
    originalName: 'Time',
    type: 'string',
    role: 'Preprocessed',
    description: 'Timestamp logged in %H:%M:%S or %H:%M format, stripped of extraneous whitespace.',
    sampleValue: '13:00:00',
  },
  {
    name: 'hour',
    originalName: 'Derived from Time',
    type: 'int64 (0–23)',
    role: 'Model Feature',
    description: 'Extracted diurnal hour representing daily solar cycles and anthropogenic activity.',
    sampleValue: '13',
  },
  {
    name: 'day_of_week',
    originalName: 'Derived from Date',
    type: 'int64 (0–6)',
    role: 'Model Feature',
    description: 'Day of week index (0 = Monday, 6 = Sunday) capturing weekly traffic/work patterns.',
    sampleValue: '6 (Sunday)',
  },
  {
    name: 'month_num',
    originalName: 'Derived from Date',
    type: 'int64 (1–12)',
    role: 'Model Feature',
    description: 'Calendar month number capturing seasonal atmospheric dispersion baselines.',
    sampleValue: '8 (August)',
  },
  {
    name: 'Temperature',
    originalName: 'Temp',
    type: 'float64',
    role: 'Model Feature',
    description: 'Ambient dry-bulb temperature measured in Celsius by the calibrated DHT22 sensor.',
    sampleValue: '28.4 °C',
  },
  {
    name: 'humidity',
    originalName: 'Humidity',
    type: 'float64',
    role: 'Model Feature',
    description: 'Relative humidity percentage affecting particulate suspension and sensor baseline.',
    sampleValue: '64.2 %',
  },
  {
    name: 'AQI',
    originalName: 'AQI',
    type: 'float64',
    role: 'Target',
    description: 'Air Quality Index continuous target variable predicted by the Random Forest model.',
    sampleValue: '188.2',
  },
  {
    name: 'PM2.5',
    originalName: 'PM2.5',
    type: 'float64',
    role: 'Preprocessed',
    description: 'Fine particulate matter mass concentration (μg/m³) recorded by optical PM sensor.',
    sampleValue: '48.5 μg/m³',
  },
  {
    name: 'Pollution Level',
    originalName: 'Pollution Level',
    type: 'categorical',
    role: 'Metadata',
    description: 'Discrete qualitative category: "Good", "Poor", or "Severe" based on index thresholds.',
    sampleValue: 'Poor',
  },
  {
    name: 'area',
    originalName: 'Area',
    type: 'string',
    role: 'Metadata',
    description: 'Monitoring node location designation for spatial context.',
    sampleValue: 'Station-A',
  },
];

export const modelFeatureNames = ['hour', 'day_of_week', 'month_num', 'Temperature', 'humidity'];
export const modelTargetName = 'AQI';

export const implementationNote = {
  title: 'Column Standardization Implementation Note',
  badge: 'Notebook Execution Note',
  description:
    'In the data standardization stage of the supplied Python script, the raw column "Temp" was renamed to lowercase "temp". Later in the workflow, the model feature list specifies "Temperature" (features = [\'hour\', \'day_of_week\', \'month_num\', \'Temperature\', \'humidity\']). Before running the notebook, ensure column naming is consistent—either by retaining "Temperature" during the rename step or updating the features list to use "temp".',
  codeSnippet: `# Column consistency fix before model fitting:
df = df.rename(columns={
    'Temp': 'Temperature',   # Keep consistent with model features list
    'Humidity': 'humidity',
    # ...
})
# Alternatively:
# features = ['hour', 'day_of_week', 'month_num', 'temp', 'humidity']`,
};
