import React, { useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import { startupData } from '../data';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function Comparison() {
  const indiaData = useMemo(() => startupData.filter(s => s.Country === 'India'), []);
  const globalData = startupData;

  // KPIs
  const avgRevenueIndia = indiaData.length > 0 
    ? indiaData.reduce((acc, curr) => acc + curr.Annual_Revenue_MUSD, 0) / indiaData.length 
    : 0;
  const avgRevenueGlobal = globalData.length > 0 
    ? globalData.reduce((acc, curr) => acc + curr.Annual_Revenue_MUSD, 0) / globalData.length 
    : 0;
  const avgGrowthIndia = indiaData.length > 0 
    ? indiaData.reduce((acc, curr) => acc + curr.Revenue_Growth_Percent, 0) / indiaData.length 
    : 0;
  const avgGrowthGlobal = globalData.length > 0 
    ? globalData.reduce((acc, curr) => acc + curr.Revenue_Growth_Percent, 0) / globalData.length 
    : 0;

  const chartLayout = (title: string) => ({
    title: { text: title, font: { size: 14, color: '#0f172a', family: 'Inter, sans-serif', weight: 'bold' } },
    autosize: true,
    margin: { l: 40, r: 20, t: 50, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, sans-serif', color: '#64748b' },
    showlegend: true,
    legend: { orientation: 'h', y: -0.2 }
  });

  // 1. Top Industry in India (Bar)
  const indiaIndustryCounts = indiaData.reduce((acc: any, curr) => {
    acc[curr.Industry] = (acc[curr.Industry] || 0) + 1;
    return acc;
  }, {});
  const topIndiaIndustries = Object.entries(indiaIndustryCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);
  const barIndiaData = [{
    x: topIndiaIndustries.map(s => s[0]),
    y: topIndiaIndustries.map(s => s[1]),
    text: topIndiaIndustries.map(s => s[1]),
    textposition: 'auto',
    type: 'bar',
    marker: { color: '#2dd4bf' }
  }];

  // 2. Funding Stage in India (Donut)
  const indiaStageCounts = indiaData.reduce((acc: any, curr) => {
    acc[curr.Funding_Stage] = (acc[curr.Funding_Stage] || 0) + 1;
    return acc;
  }, {});
  const donutIndiaData = [{
    values: Object.values(indiaStageCounts),
    labels: Object.keys(indiaStageCounts),
    type: 'pie',
    hole: 0.6,
    textinfo: 'label+value+percent',
    textposition: 'outside',
    marker: { colors: ['#2dd4bf', '#0d9488', '#14b8a6', '#5eead4', '#99f6e4'] }
  }];

  // 3. Funding Stage Globally (Bar)
  const globalStageCounts = globalData.reduce((acc: any, curr) => {
    acc[curr.Funding_Stage] = (acc[curr.Funding_Stage] || 0) + 1;
    return acc;
  }, {});
  const barGlobalStageData = [{
    x: Object.keys(globalStageCounts),
    y: Object.values(globalStageCounts),
    text: Object.values(globalStageCounts),
    textposition: 'auto',
    type: 'bar',
    marker: { color: '#0d9488' }
  }];

  // 4. Top Industry Globally (Bar)
  const globalIndustryCounts = globalData.reduce((acc: any, curr) => {
    acc[curr.Industry] = (acc[curr.Industry] || 0) + 1;
    return acc;
  }, {});
  const topGlobalIndustries = Object.entries(globalIndustryCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);
  const barGlobalIndustryData = [{
    x: topGlobalIndustries.map(s => s[0]),
    y: topGlobalIndustries.map(s => s[1]),
    text: topGlobalIndustries.map(s => s[1]),
    textposition: 'auto',
    type: 'bar',
    marker: { color: '#14b8a6' }
  }];

  return (
    <div className="space-y-6 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">India vs World Startup Comparison Dashboard</h1>
        <p className="text-slate-500 font-medium">Benchmarking Indian startups against global standards</p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Revenue (India)', value: avgRevenueIndia.toFixed(1), icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Avg Revenue (Global)', value: avgRevenueGlobal.toFixed(1), icon: DollarSign, color: 'text-teal-700', bg: 'bg-teal-100' },
          { label: 'Avg Growth (India)', value: avgGrowthIndia.toFixed(1), icon: TrendingUp, color: 'text-teal-800', bg: 'bg-teal-200' },
          { label: 'Avg Growth (Global)', value: avgGrowthGlobal.toFixed(1), icon: TrendingUp, color: 'text-teal-900', bg: 'bg-teal-300' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${kpi.bg} p-3 rounded-xl`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <p className="text-xl font-black text-slate-900">{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={barIndiaData as any}
            layout={{ ...chartLayout('Top Industry in India'), height: 350 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={donutIndiaData as any}
            layout={{ ...chartLayout('Funding Stage in India'), height: 350 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={barGlobalStageData as any}
            layout={{ ...chartLayout('Funding Stage Globally'), height: 350 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={barGlobalIndustryData as any}
            layout={{ ...chartLayout('Top Industry Globally'), height: 350 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
