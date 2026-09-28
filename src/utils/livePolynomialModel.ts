/**
 * Degree-6 Polynomial Regression Engine with StandardScaler & Linear Regression
 * Matches Python Scikit-Learn:
 * make_pipeline(PolynomialFeatures(6, include_bias=False), StandardScaler(), LinearRegression())
 */

export const GOOD_MAX = 150;
export const SEVERE_MIN = 260;

export interface AqiClassification {
  level: 'Good' | 'Poor' | 'Severe';
  color: string;
  bgLight: string;
  borderColor: string;
  textColor: string;
  emoji: string;
}

export function classifyAqi(aqi: number): AqiClassification {
  if (aqi <= GOOD_MAX) {
    return {
      level: 'Good',
      color: '#16A34A',
      bgLight: '#F0FDF4',
      borderColor: '#BBF7D0',
      textColor: '#166534',
      emoji: '🟢',
    };
  }
  if (aqi <= SEVERE_MIN) {
    return {
      level: 'Poor',
      color: '#F59E0B',
      bgLight: '#FFFBEB',
      borderColor: '#FDE68A',
      textColor: '#B45309',
      emoji: '🟠',
    };
  }
  return {
    level: 'Severe',
    color: '#DC2626',
    bgLight: '#FEF2F2',
    borderColor: '#FECACA',
    textColor: '#991B1B',
    emoji: '🔴',
  };
}

export interface TrainedModel {
  degree: number;
  means: Float64Array;
  stds: Float64Array;
  weights: Float64Array;
  intercept: number;
  predict: (hod: number) => number;
}

/**
 * Fits a degree-d polynomial regression with standard scaling and OLS regression.
 */
export function fitPolynomialRegression(
  hods: number[],
  targets: number[],
  degree = 6
): TrainedModel {
  const N = hods.length;
  if (N === 0) {
    return {
      degree,
      means: new Float64Array(degree),
      stds: new Float64Array(degree).fill(1),
      weights: new Float64Array(degree),
      intercept: 0,
      predict: () => 0,
    };
  }

  // 1. Build Polynomial Feature Matrix (powers 1..degree)
  const X = new Array<Float64Array>(N);
  for (let i = 0; i < N; i++) {
    const h = hods[i];
    const feats = new Float64Array(degree);
    let p = 1;
    for (let d = 0; d < degree; d++) {
      p *= h;
      feats[d] = p;
    }
    X[i] = feats;
  }

  // 2. StandardScaler: mean and standard deviation (population std as in sklearn)
  const means = new Float64Array(degree);
  for (let i = 0; i < N; i++) {
    for (let d = 0; d < degree; d++) {
      means[d] += X[i][d];
    }
  }
  for (let d = 0; d < degree; d++) means[d] /= N;

  const stds = new Float64Array(degree);
  for (let i = 0; i < N; i++) {
    for (let d = 0; d < degree; d++) {
      const diff = X[i][d] - means[d];
      stds[d] += diff * diff;
    }
  }
  for (let d = 0; d < degree; d++) {
    stds[d] = Math.sqrt(stds[d] / N) || 1;
  }

  // 3. Normalized Feature Matrix Z
  const Z = new Array<Float64Array>(N);
  for (let i = 0; i < N; i++) {
    const z = new Float64Array(degree);
    for (let d = 0; d < degree; d++) {
      z[d] = (X[i][d] - means[d]) / stds[d];
    }
    Z[i] = z;
  }

  // 4. Center target y
  let yMean = 0;
  for (let i = 0; i < N; i++) yMean += targets[i];
  yMean /= N;

  // 5. Normal equations: (Z^T Z + ridge * I) w = Z^T (y - yMean)
  const A = Array.from({ length: degree }, () => new Float64Array(degree));
  const bVec = new Float64Array(degree);

  // Tiny ridge penalty for perfect numerical stability in floating-point operations
  const ridge = 1e-11;

  for (let i = 0; i < N; i++) {
    const z = Z[i];
    const yDiff = targets[i] - yMean;
    for (let r = 0; r < degree; r++) {
      bVec[r] += z[r] * yDiff;
      for (let c = 0; c < degree; c++) {
        A[r][c] += z[r] * z[c];
      }
    }
  }

  for (let d = 0; d < degree; d++) {
    A[d][d] += ridge;
  }

  // 6. Gaussian elimination with partial pivoting
  const M = Array.from({ length: degree }, (_, r) => {
    const row = new Float64Array(degree + 1);
    row.set(A[r]);
    row[degree] = bVec[r];
    return row;
  });

  for (let i = 0; i < degree; i++) {
    let maxRow = i;
    for (let k = i + 1; k < degree; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
    }
    const tmp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = tmp;

    const pivot = M[i][i];
    if (Math.abs(pivot) > 1e-14) {
      for (let k = i + 1; k < degree; k++) {
        const factor = M[k][i] / pivot;
        for (let j = i; j <= degree; j++) {
          M[k][j] -= factor * M[i][j];
        }
      }
    }
  }

  const weights = new Float64Array(degree);
  for (let i = degree - 1; i >= 0; i--) {
    let sum = M[i][degree];
    for (let j = i + 1; j < degree; j++) {
      sum -= M[i][j] * weights[j];
    }
    weights[i] = Math.abs(M[i][i]) > 1e-14 ? sum / M[i][i] : 0;
  }

  const intercept = yMean;

  const predict = (hod: number): number => {
    let p = 1;
    let sum = 0;
    for (let d = 0; d < degree; d++) {
      p *= hod;
      const z = (p - means[d]) / stds[d];
      sum += weights[d] * z;
    }
    return sum + intercept;
  };

  return { degree, means, stds, weights, intercept, predict };
}

/**
 * Calculates validation MAE and R² for AQI on the last 24-hour test window.
 */
export function calculateValidationMetrics(
  trainHods: number[],
  trainTargets: number[],
  testHods: number[],
  testTargets: number[]
): { mae: number; r2: number } {
  if (testHods.length === 0 || trainHods.length === 0) {
    return { mae: 0, r2: 0 };
  }

  const valModel = fitPolynomialRegression(trainHods, trainTargets, 6);
  let mae = 0;
  let ssRes = 0;
  let ssTot = 0;
  const testYMean = testTargets.reduce((a, b) => a + b, 0) / testTargets.length;

  for (let i = 0; i < testHods.length; i++) {
    const pred = valModel.predict(testHods[i]);
    const err = testTargets[i] - pred;
    mae += Math.abs(err);
    ssRes += err * err;
    const totErr = testTargets[i] - testYMean;
    ssTot += totErr * totErr;
  }

  mae /= testHods.length;
  const r2 = ssTot > 1e-6 ? 1 - ssRes / ssTot : 0;

  return { mae, r2 };
}
