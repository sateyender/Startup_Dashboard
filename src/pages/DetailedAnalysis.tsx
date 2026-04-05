import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import { useFilters } from '../context/FilterContext';
import { BarChart3 } from 'lucide-react';

export default function DetailedAnalysis() {
  const { filteredData } = useFilters();

  // 1. Scatter Plot: Valuation vs Total Funding
  const scatterData = [{
    x: filteredData.map(s => s.Total_Funding_MUSD),
    y: filteredData.map(s => s.Valuation_MUSD),
    text: filteredData.map(s => s.Industry),
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 10,
      color: filteredData.map(s => s.Is_Profitable),
      colorscale: 'Portland',
      opacity: 0.6
    }
  }];

  // 2. Bar Chart: Avg Employee Count by Industry
  const industryEmployees = filteredData.reduce((acc: any, curr) => {
    if (!acc[curr.Industry]) acc[curr.Industry] = { total: 0, count: 0 };
    acc[curr.Industry].total += curr.Employee_Count;
    acc[curr.Industry].count += 1;
    return acc;
  }, {});
  const avgEmployeeData = [{
    x: Object.keys(industryEmployees),
    y: Object.keys(industryEmployees).map(k => industryEmployees[k].total / industryEmployees[k].count),
    type: 'bar',
    marker: { color: '#6366f1' }
  }];

  // 3. Heatmap: Correlation (Mocked for visualization)
  const heatmapData = [{
    z: [[1, 0.8, 0.4, 0.2], [0.8, 1, 0.5, 0.3], [0.4, 0.5, 1, 0.6], [0.2, 0.3, 0.6, 1]],
    x: ['Funding', 'Valuation', 'Revenue', 'Employees'],
    y: ['Funding', 'Valuation', 'Revenue', 'Employees'],
    type: 'heatmap',
    colorscale: 'Blues'
  }];

  // 4. Box Plot: Revenue Distribution by Industry
  const industries = Array.from(new Set(filteredData.map(s => s.Industry)));
  const boxData = industries.map(ind => ({
    y: filteredData.filter(s => s.Industry === ind).map(s => s.Annual_Revenue_MUSD),
    type: 'box',
    name: ind,
    marker: { color: '#8b5cf6' }
  }));

  const chartLayout = (title: string) => ({
    title: { text: title, font: { size: 16, color: '#1e293b', family: 'Inter' } },
    autosize: true,
    margin: { l: 50, r: 20, t: 60, b: 60 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter', color: '#64748b' }
  });

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Detailed Analysis</h1>
        <p className="text-slate-500 text-lg mt-2 font-medium">In-depth exploration of correlations and distributions.</p>
      </header>

      {filteredData.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Data Found</h2>
          <p className="text-slate-500">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Plot
              data={scatterData}
              layout={{ 
                ...chartLayout('Valuation vs. Funding Correlation'), 
                height: 400,
                xaxis: { title: 'Total Funding (MUSD)' },
                yaxis: { title: 'Valuation (MUSD)' }
              }}
              useResizeHandler={true}
              className="w-full"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Plot
              data={avgEmployeeData}
              layout={{ ...chartLayout('Average Workforce by Industry'), height: 400 }}
              useResizeHandler={true}
              className="w-full"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Plot
              data={heatmapData}
              layout={{ ...chartLayout('Metric Correlation Matrix'), height: 400 }}
              useResizeHandler={true}
              className="w-full"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Plot
              data={boxData as any}
              layout={{ ...chartLayout('Revenue Distribution by Industry'), height: 400, showlegend: false }}
              useResizeHandler={true}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
