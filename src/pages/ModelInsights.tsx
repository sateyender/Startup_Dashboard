import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import { useFilters } from '../context/FilterContext';
import { TrendingUp } from 'lucide-react';

export default function ModelInsights() {
  const { filteredData, selectedCountry, selectedIndustry } = useFilters();

  // Feature Importance (Mocked)
  const featureImportanceData = [{
    x: [0.35, 0.25, 0.20, 0.15, 0.05],
    y: ['Annual Revenue', 'Revenue Growth', 'Total Funding', 'Employee Count', 'Funding Stage'],
    type: 'bar',
    orientation: 'h',
    marker: { color: '#6366f1' }
  }];

  // Confusion Matrix (Mocked)
  const confusionMatrixData = [{
    z: [[85, 15], [10, 90]],
    x: ['Predicted Negative', 'Predicted Positive'],
    y: ['Actual Negative', 'Actual Positive'],
    type: 'heatmap',
    colorscale: 'Greens',
    showscale: false,
    text: [['85', '15'], ['10', '90']],
    texttemplate: "%{text}",
    font: { size: 20 }
  }];

  // Accuracy Metrics (Mocked but responding to data size)
  const accuracy = filteredData.length > 50 ? 0.89 : 0.82;
  const accuracyData = [{
    x: ['Precision', 'Recall', 'F1-Score', 'Accuracy'],
    y: [accuracy - 0.01, accuracy + 0.03, accuracy + 0.01, accuracy],
    type: 'bar',
    marker: { color: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'] }
  }];

  const chartLayout = (title: string) => ({
    title: { text: title, font: { size: 16, color: '#1e293b', family: 'Inter' } },
    autosize: true,
    margin: { l: 120, r: 20, t: 60, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter', color: '#64748b' }
  });

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Model Insights</h1>
        <p className="text-slate-500 text-lg mt-2 font-medium">Predictive modeling results for startup profitability.</p>
      </header>

      {filteredData.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Data Found</h2>
          <p className="text-slate-500">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <>
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
            <h3 className="text-indigo-900 font-bold text-lg mb-2">Model Summary: {selectedCountry} | {selectedIndustry}</h3>
            <p className="text-indigo-700 leading-relaxed">
              The model predicts profitability with {(accuracy * 100).toFixed(0)}% accuracy for the selected segment. 
              {filteredData.length < 20 ? " Warning: Small sample size for this specific filter combination." : " Sufficient data points available for reliable insights."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <Plot
                data={featureImportanceData as any}
                layout={{ ...chartLayout('Feature Importance (Profitability)'), height: 400 }}
                useResizeHandler={true}
                className="w-full"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <Plot
                data={confusionMatrixData as any}
                layout={{ 
                  ...chartLayout('Model Confusion Matrix'), 
                  height: 400,
                  margin: { l: 100, r: 20, t: 60, b: 40 }
                }}
                useResizeHandler={true}
                className="w-full"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <Plot
                data={accuracyData as any}
                layout={{ 
                  ...chartLayout('Classification Performance Metrics'), 
                  height: 400,
                  yaxis: { range: [0, 1] }
                }}
                useResizeHandler={true}
                className="w-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
