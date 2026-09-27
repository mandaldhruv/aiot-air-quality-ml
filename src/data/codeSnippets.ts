import type { CodeSection } from '../types';

export const codeSections: CodeSection[] = [
  {
    id: 'sec-01',
    sectionNumber: '01',
    title: 'Environment & Libraries',
    summary: 'Installing prerequisite scientific computing and machine learning packages and setting Seaborn aesthetics.',
    language: 'python',
    code: `!pip install scikit-learn pandas matplotlib seaborn -q

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt 
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

sns.set_style("whitegrid")`,
    keyOutputs: [
      'scikit-learn, pandas, matplotlib, seaborn installed',
      'Plot aesthetic configured to whitegrid',
    ],
  },
  {
    id: 'sec-02',
    sectionNumber: '02',
    title: 'Dataset Upload & Loading',
    summary: 'Ingesting the exported CSV log and standardizing column naming headers for downstream consistency.',
    language: 'python',
    code: `from google.colab import files
uploaded = files.upload()   # select your CSV file

filename = list(uploaded.keys())[0]
df = pd.read_csv(filename)

print("Original columns:", df.columns.tolist())

df = df.rename(columns={
    'Date': 'date',
    'Time': 'time',
    'Day': 'day',
    'Week': 'week',
    'Month': 'month',
    'Area': 'area',
    'Temp': 'temp',
    'Humidity': 'humidity',
    'AQI': 'AQI',
    'PM2.5': 'PM2.5',
    'Pollution Level': 'Pollution Level'
})

df.columns = df.columns.str.strip()
print("Standardized columns:", df.columns.tolist())
df.head()`,
    keyOutputs: [
      'Original headers mapped to normalized lower/snake_case tokens',
      'Leading/trailing whitespace stripped from header strings',
    ],
  },
  {
    id: 'sec-03',
    sectionNumber: '03',
    title: 'Data Cleaning & Datetime Parsing',
    summary: 'Parsing date and time fields, validating formats with fallbacks, and dropping records with missing critical values.',
    language: 'python',
    code: `print("Sample date values:")
print(df['date'].head())
print("\\nSample time values:")
print(df['time'].head())
print("\\nDtypes:")
print(df.dtypes)

# Parse date with dayfirst format
df['date'] = pd.to_datetime(df['date'], errors='coerce', dayfirst=True)

# Parse hour with fallback format check
df['time'] = df['time'].astype(str).str.strip()
df['hour'] = pd.to_datetime(df['time'], errors='coerce', format='%H:%M:%S').dt.hour

if df['hour'].isna().mean() > 0.5:
    df['hour'] = pd.to_datetime(df['time'], errors='coerce', format='%H:%M').dt.hour

df['day_only'] = df['date'].dt.date

print("Rows total:", len(df))
print("date failed to parse:", df['date'].isna().sum())
print("hour failed to parse:", df['hour'].isna().sum())

# Drop invalid records
df = df.dropna(subset=['date', 'hour', 'AQI']).copy()
print("Rows remaining after cleanup:", len(df))

df[['date', 'day_only', 'hour', 'AQI', 'PM2.5', 'Pollution Level']].head()`,
    keyOutputs: [
      'Datetime conversion with error coercion',
      'Hour extraction fallback (%H:%M:%S -> %H:%M)',
      'Subset dropna on [date, hour, AQI]',
    ],
  },
  {
    id: 'sec-04',
    sectionNumber: '04',
    title: 'Daily AQI Aggregation & Plotting',
    summary: 'Computing mean AQI per calendar date and visualizing chronological trends across monitoring dates.',
    language: 'python',
    associatedGraphId: 'graph-01',
    code: `daily_avg = df.groupby('day_only')['AQI'].mean().reset_index()

plt.figure(figsize=(12,5))
plt.plot(daily_avg['day_only'], daily_avg['AQI'], marker='o', color='crimson')
plt.title('Average AQI per Day')
plt.xlabel('Date')
plt.ylabel('Average AQI')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()`,
    keyOutputs: [
      'Aggregated 20 monitoring days from 2026-08-12 to 2026-08-31',
      'Visualized multi-day air quality fluctuation',
    ],
  },
  {
    id: 'sec-05',
    sectionNumber: '05',
    title: 'Hourly AQI Diurnal Aggregation',
    summary: 'Aggregating AQI across all 24 hours of the day to identify recurring intraday pollution cycles.',
    language: 'python',
    associatedGraphId: 'graph-02',
    code: `hourly_avg = df.groupby('hour')['AQI'].mean().reindex(range(24)).reset_index()
hourly_avg.columns = ['hour', 'AQI']
hourly_avg['hour_label'] = hourly_avg['hour'].apply(lambda h: f"{h:02d}:00")

plt.figure(figsize=(12,5))
sns.barplot(data=hourly_avg, x='hour_label', y='AQI', palette='viridis')
plt.title('Average AQI by Hour of Day')
plt.xlabel('Time')
plt.ylabel('Average AQI')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()`,
    keyOutputs: [
      'Full 24-hour diurnal profile mapped (00:00 - 23:00)',
      'Peak pollution observed in midday window (12:00-15:00)',
    ],
  },
  {
    id: 'sec-06',
    sectionNumber: '06',
    title: 'Pollution Level Categorical Distribution',
    summary: 'Counting records per discrete pollution severity category and rendering annotated bar visualization.',
    language: 'python',
    associatedGraphId: 'graph-03',
    code: `print(df['Pollution Level'].unique())

level_counts = df['Pollution Level'].value_counts()

colors = {'Good': 'green', 'Poor': 'orange', 'Severe': 'red'}
plot_colors = [colors.get(lvl, 'gray') for lvl in level_counts.index]

plt.figure(figsize=(8,5))
plt.bar(level_counts.index, level_counts.values, color=plot_colors)
plt.title('Pollution Level Distribution')
plt.xlabel('Pollution Level')
plt.ylabel('Count')

for i, v in enumerate(level_counts.values):
    plt.text(i, v + max(level_counts.values)*0.01, str(v), ha='center', fontweight='bold')

plt.tight_layout()
plt.show()`,
    keyOutputs: [
      'Poor: 1,202 samples (61.11%)',
      'Good: 712 samples (36.20%)',
      'Severe: 53 samples (2.69%)',
    ],
  },
  {
    id: 'sec-07',
    sectionNumber: '07',
    title: 'Feature Engineering & Preparation',
    summary: 'Deriving calendar temporal features and assembling feature matrix X and target vector y.',
    language: 'python',
    code: `from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Feature engineering
df['day_of_week'] = df['date'].dt.dayofweek
df['month_num'] = df['date'].dt.month

# Features and target
# Implementation note: Ensure column name matches 'Temperature' or adjust to 'temp'
features = ['hour', 'day_of_week', 'month_num', 'Temperature', 'humidity']
target = 'AQI'

# Drop rows with missing values in relevant columns
model_df = df.dropna(subset=features + [target])
X = model_df[features]
y = model_df[target]`,
    keyOutputs: [
      'day_of_week: int 0–6 extracted',
      'month_num: int 1–12 extracted',
      'Feature matrix X (5 dimensions) & Target y (AQI) created',
    ],
  },
  {
    id: 'sec-08',
    sectionNumber: '08',
    title: 'Random Forest Regressor Training',
    summary: 'Partitioning dataset into 80/20 train/test subsets and training 200 bagging decision trees.',
    language: 'python',
    code: `# Train/test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Initialize and fit Random Forest Regressor
model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)`,
    keyOutputs: [
      'Train split: 80% of rows (~1,574 samples)',
      'Test split: 20% holdout (~393 samples)',
      'RandomForestRegressor fitted with n_estimators=200, random_state=42',
    ],
  },
  {
    id: 'sec-09',
    sectionNumber: '09',
    title: 'Model Evaluation on Holdout Test Set',
    summary: 'Predicting test samples and quantifying error metrics using Mean Absolute Error and R² determination.',
    language: 'python',
    code: `# Predictions and evaluation
preds = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, preds))
print("R²:", r2_score(y_test, preds))`,
    keyOutputs: [
      'MAE evaluated on test holdout set',
      'R² coefficient of determination computed against unseen test samples',
    ],
  },
  {
    id: 'sec-10',
    sectionNumber: '10',
    title: 'Next-Day Future Feature Frame Synthesis',
    summary: 'Generating synthetic 24-hour feature set for the day following the latest recorded timestamp.',
    language: 'python',
    code: `last_date = df['date'].max()
next_day = last_date + pd.Timedelta(days=1)

# Compute diurnal profile of weather parameters
hourly_weather = df.groupby('hour')[['Temperature', 'humidity']].mean()

future_rows = []
for h in range(24):
    future_rows.append({
        'hour': h,
        'hour_label': f"{h:02d}:00",
        'day_of_week': next_day.dayofweek,
        'month_num': next_day.month,
        'Temperature': hourly_weather.loc[h, 'Temperature'] if h in hourly_weather.index else df['Temperature'].mean(),
        'humidity': hourly_weather.loc[h, 'humidity'] if h in hourly_weather.index else df['humidity'].mean()
    })

future_df = pd.DataFrame(future_rows)
future_df['predicted_AQI'] = model.predict(future_df[features])
future_df.head()`,
    keyOutputs: [
      'Target forecast date: 28-09-2026 (next_day)',
      '24 synthetic hourly vectors populated with mean diurnal Temperature and humidity',
      'Hourly AQI predictions inferred through trained Random Forest',
    ],
  },
  {
    id: 'sec-11',
    sectionNumber: '11',
    title: '24-Hour Forecast Curve Visualization',
    summary: 'Plotting the continuous 24-hour predicted AQI trajectory for the upcoming calendar day.',
    language: 'python',
    associatedGraphId: 'graph-04',
    code: `plt.figure(figsize=(12,5))
plt.plot(future_df['hour_label'], future_df['predicted_AQI'], marker='o', color='purple')
plt.title(f'Predicted AQI for Next 24 Hours ({next_day.date()})')
plt.xlabel('Time')
plt.ylabel('Predicted AQI')
plt.xticks(rotation=45)
plt.grid(True)
plt.tight_layout()
plt.show()`,
    keyOutputs: [
      'Title: Predicted AQI for Next 24 Hours (28-09-2026)',
      'Hourly trajectory plotted from 00:00 to 23:00',
    ],
  },
];
