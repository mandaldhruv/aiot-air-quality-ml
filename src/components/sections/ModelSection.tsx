import React from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { Network, Sliders, Split, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';

interface ModelSectionProps {
  onViewCode: (sectionId: string) => void;
}

export const ModelSection: React.FC<ModelSectionProps> = ({ onViewCode }) => {
  return (
    <section id="section-model" className="py-16 md:py-20 border-t border-[#E6E1D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          number="06"
          badge="Machine Learning Architecture"
          title="Random Forest Regressor Specification"
          description="The actual machine learning model in our Colab notebook is an ensemble Random Forest Regressor with 200 decision trees. It maps temporal indices and microclimatic factors to continuous Air Quality Index values."
          badgeColor="teal"
        />

        {/* Hyperparameter & Architecture Specification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#738077]">
                Algorithm
              </span>
              <Network className="w-4 h-4 text-[#366B6B]" />
            </div>
            <div className="text-xl font-bold text-[#19221C]">
              Random Forest
            </div>
            <p className="text-xs text-[#738077] mt-1 font-mono">
              sklearn.ensemble.RandomForestRegressor
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#738077]">
                Ensemble Size
              </span>
              <Sliders className="w-4 h-4 text-[#5F7F6C]" />
            </div>
            <div className="text-xl font-bold text-[#19221C]">
              200 Estimators
            </div>
            <p className="text-xs text-[#738077] mt-1 font-mono">
              n_estimators = 200
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#738077]">
                Partitioning
              </span>
              <Split className="w-4 h-4 text-[#CF8630]" />
            </div>
            <div className="text-xl font-bold text-[#19221C]">
              80 / 20 Split
            </div>
            <p className="text-xs text-[#738077] mt-1 font-mono">
              test_size=0.2, seed=42
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D8] shadow-[0_2px_8px_rgba(30,40,35,0.02)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#738077]">
                Feature Matrix
              </span>
              <Layers className="w-4 h-4 text-[#2F4D3E]" />
            </div>
            <div className="text-xl font-bold text-[#19221C]">
              5 Dimensions
            </div>
            <p className="text-xs text-[#738077] mt-1 font-mono">
              X: 5 cols → y: 1 target
            </p>
          </div>
        </div>

        {/* Detailed Specification Card */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 md:p-8 shadow-[0_2px_12px_rgba(30,40,35,0.03)] space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-lg font-bold text-[#19221C] mb-2">
                Why Random Forest Regression?
              </h3>
              <p className="text-xs sm:text-sm text-[#48544D] leading-relaxed mb-4">
                Environmental time-series data exhibits complex non-linear relationships. Tree bagging was selected for the primary implementation because:
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-[#19221C]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5F7F6C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Non-linear diurnal boundary fitting:</strong> Captures sharp afternoon pollution spikes without assuming a smooth polynomial shape.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5F7F6C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Feature interaction resilience:</strong> Effectively cross-partitions temperature and relative humidity thresholds without requiring manual interaction terms.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5F7F6C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Reduced variance through bagging:</strong> Averaging 200 de-correlated decision trees dampens localized noise from individual low-cost sensor fluctuations.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-5 rounded-xl border border-[#EDE8DF] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#738077]">
                  Code Snippet • Model Instantiation
                </span>
                <button
                  type="button"
                  onClick={() => onViewCode('sec-08')}
                  className="text-xs text-[#2F4D3E] font-bold hover:underline"
                >
                  View in Workspace →
                </button>
              </div>

              <CodeBlock
                code={`# Train/test split (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model initialization
model = RandomForestRegressor(
    n_estimators=200, 
    random_state=42
)
model.fit(X_train, y_train)`}
                language="python"
                title="Sklearn Model Training"
                showLineNumbers={false}
              />
            </div>
          </div>

          {/* Implementation Note regarding PPT comparison */}
          <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl p-4 flex items-start gap-3 text-xs">
            <AlertCircle className="w-4 h-4 text-[#CF8630] shrink-0 mt-0.5" />
            <div className="text-[#48544D] leading-relaxed">
              <strong className="text-[#19221C]">Implementation Note:</strong> While earlier exploratory concepts in project presentation slides referenced polynomial regression (degree-6), the actual Python source code executes <strong>Random Forest Regression</strong> (<code className="font-mono text-[#2F4D3E]">RandomForestRegressor(n_estimators=200, random_state=42)</code>). This documentation strictly reflects the operational code.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
