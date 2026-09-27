import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Activity, Target, Terminal } from 'lucide-react';

interface EvaluationSectionProps {
  onViewCode: (sectionId: string) => void;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({ onViewCode }) => {
  return (
    <section id="section-eval" className="py-12 sm:py-16 md:py-20 border-t border-[#E6E1D8] w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="08"
          badge="Validation & Verification"
          title="Holdout Test Set Model Evaluation"
          description="Model generalization is evaluated on the 20% holdout test partition (~393 unseen sensor observations) using Mean Absolute Error (MAE) and the coefficient of determination (R²)."
          badgeColor="sage"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start mb-6 sm:mb-8">
          {/* MAE Metric Card */}
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-4 sm:p-6 md:p-8 shadow-[0_2px_12px_rgba(30,40,35,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5F7F6C] bg-[#EBF1ED] px-2.5 py-0.5 rounded-full">
                Primary Error Metric
              </span>
              <Target className="w-5 h-5 text-[#5F7F6C]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#19221C]">
              Mean Absolute Error (MAE)
            </h3>

            {/* Metric Status Indicator - Strictly Honest */}
            <div className="bg-[#FAF8F5] border border-[#E6E1D8] p-3.5 sm:p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#738077] mb-1 gap-0.5">
                <span>Evaluation State</span>
                <span className="font-mono text-[10px] sm:text-[11px] truncate">mean_absolute_error(y_test, preds)</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-[#2F4D3E] flex items-center gap-2">
                <span>Computed during notebook execution</span>
              </div>
              <p className="text-xs text-[#738077] mt-1.5 italic">
                Quantified dynamically against the 20% test partition when the Colab notebook executes with fixed seed 42.
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-[#48544D] leading-relaxed">
              <p>
                <strong>Mathematical Formulation:</strong>
              </p>
              <div className="bg-[#FAF8F5] font-mono text-[11px] sm:text-xs p-2.5 rounded-lg border border-[#EDE8DF] text-[#19221C] overflow-x-auto">
                MAE = (1 / n) * Σ |y_test[i] - preds[i]|
              </div>
              <p className="pt-1">
                MAE represents the average magnitude of prediction error expressed directly in physical AQI index units. Unlike RMSE, it does not square residual errors, providing a robust and linear measure of baseline accuracy that resists distortion by occasional sensor outliers.
              </p>
            </div>
          </div>

          {/* R2 Score Metric Card */}
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-4 sm:p-6 md:p-8 shadow-[0_2px_12px_rgba(30,40,35,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#366B6B] bg-[#E3EFEF] px-2.5 py-0.5 rounded-full">
                Goodness-of-Fit Metric
              </span>
              <Activity className="w-5 h-5 text-[#366B6B]" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-[#19221C]">
              Coefficient of Determination (R²)
            </h3>

            {/* Metric Status Indicator - Strictly Honest */}
            <div className="bg-[#FAF8F5] border border-[#E6E1D8] p-3.5 sm:p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#738077] mb-1 gap-0.5">
                <span>Evaluation State</span>
                <span className="font-mono text-[10px] sm:text-[11px] truncate">r2_score(y_test, preds)</span>
              </div>
              <div className="text-sm sm:text-base md:text-lg font-bold text-[#2F4D3E] flex items-center gap-2">
                <span>Computed during notebook execution</span>
              </div>
              <p className="text-xs text-[#738077] mt-1.5 italic">
                Evaluates what fraction of the variance in continuous AQI is captured by the trained tree ensemble.
              </p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-[#48544D] leading-relaxed">
              <p>
                <strong>Mathematical Formulation:</strong>
              </p>
              <div className="bg-[#FAF8F5] font-mono text-[11px] sm:text-xs p-2.5 rounded-lg border border-[#EDE8DF] text-[#19221C] overflow-x-auto">
                R² = 1 - (Σ (y_test - preds)² / Σ (y_test - mean(y_test))²)
              </div>
              <p className="pt-1">
                The R² determination score measures the proportion of variance in ground-truth AQI explained by our five input features (hour, day of week, month, temperature, and humidity) relative to a naive mean baseline.
              </p>
            </div>
          </div>
        </div>

        {/* Evaluation Code Callout */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-4 sm:p-6 shadow-[0_2px_12px_rgba(30,40,35,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] text-[#2F4D3E] flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#19221C]">
                Evaluation Routine in Python Code
              </h4>
              <p className="text-xs text-[#738077]">
                Calculated in Cell 09 using <code className="font-mono text-[#2F4D3E]">mean_absolute_error</code> and <code className="font-mono text-[#2F4D3E]">r2_score</code>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onViewCode('sec-09')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#19221C] bg-[#FAF8F5] hover:bg-[#EBF1ED] border border-[#D8D2C6] rounded-xl transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>View Evaluation Cell in Workspace</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
