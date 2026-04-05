import React, { useState, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import { startupData } from '../data';
import { Globe, DollarSign, TrendingUp } from 'lucide-react';

export default function WorldAnalysis() {
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = useMemo(() => ['All', ...Array.from(new Set(startupData.map(s => s.Industry))).sort()], []);

  const filteredData = useMemo(() => {
    if (selectedIndustry === 'All') return startupData;
    return startupData.filter(s => s.Industry === selectedIndustry);
  }, [selectedIndustry]);

  // KPIs
  const totalGlobalStartups = filteredData.length;
  const totalGlobalFunding = filteredData.reduce((acc, curr) => acc + curr.Total_Funding_MUSD, 0) / 1000; // Billion USD
  const avgGrowth = filteredData.length > 0 
    ? filteredData.reduce((acc, curr) => acc + curr.Revenue_Growth_Percent, 0) / filteredData.length 
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

  // 1. Global Funding Map (ONLY map in entire app)
  const countryFunding = filteredData.reduce((acc: any, curr) => {
    acc[curr.Country] = (acc[curr.Country] || 0) + curr.Total_Funding_MUSD;
    return acc;
  }, {});
  const mapData = [{
    type: 'choropleth',
    locationmode: 'country names',
    locations: Object.keys(countryFunding),
    z: Object.values(countryFunding),
    text: Object.keys(countryFunding),
    colorscale: 'Tealgrn',
    autocolorscale: false,
    reversescale: true,
    marker: { line: { color: 'rgb(255,255,255)', width: 0.5 } },
    colorbar: { title: 'MUSD', thickness: 15 }
  }];

  // 2. Top 10 Countries by Startups (Bar)
  const countryCounts = filteredData.reduce((acc: any, curr) => {
    acc[curr.Country] = (acc[curr.Country] || 0) + 1;
    return acc;
  }, {});
  const topCountries = Object.entries(countryCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10);
  const barData = [{
    x: topCountries.map(s => s[0]),
    y: topCountries.map(s => s[1]),
    text: topCountries.map(s => s[1]),
    textposition: 'auto',
    type: 'bar',
    marker: { color: '#0d9488' }
  }];

  // 3. Industry Distribution (Donut)
  const industryCounts = filteredData.reduce((acc: any, curr) => {
    acc[curr.Industry] = (acc[curr.Industry] || 0) + 1;
    return acc;
  }, {});
  const donutData = [{
    values: Object.values(industryCounts),
    labels: Object.keys(industryCounts),
    type: 'pie',
    hole: 0.6,
    textinfo: 'label+value+percent',
    textposition: 'outside',
    marker: { colors: ['#2dd4bf', '#0d9488', '#14b8a6', '#5eead4', '#99f6e4', '#ccfbf1'] }
  }];

  // 4. Industry Growth Trend (Line)
  const industryGrowth = filteredData.reduce((acc: any, curr) => {
    if (!acc[curr.Industry]) acc[curr.Industry] = { total: 0, count: 0 };
    acc[curr.Industry].total += curr.Revenue_Growth_Percent;
    acc[curr.Industry].count += 1;
    return acc;
  }, {});
  const lineData = [{
    x: Object.keys(industryGrowth),
    y: Object.keys(industryGrowth).map(k => industryGrowth[k].total / industryGrowth[k].count),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#14b8a6', width: 3 },
    marker: { size: 8, color: '#0d9488' }
  }];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">World Startup Pulse Analytics Dashboard</h1>
          <p className="text-slate-500 font-medium">Global startup ecosystem overview</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Industry Filter</span>
          <select 
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-slate-50 border-none text-slate-900 text-sm rounded-lg focus:ring-0 block p-2 outline-none cursor-pointer"
          >
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Global Startups', value: totalGlobalStartups, icon: Globe, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Total Global Funding Billion (USD)', value: totalGlobalFunding.toFixed(1), icon: DollarSign, color: 'text-teal-700', bg: 'bg-teal-100' },
          { label: 'Avg Revenue growth %', value: avgGrowth.toFixed(1), icon: TrendingUp, color: 'text-teal-800', bg: 'bg-teal-200' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${kpi.bg} p-3 rounded-xl`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
          <Plot
            data={mapData as any}
            layout={{ 
              ...chartLayout('Global Funding Distribution Map'), 
              height: 500,
              geo: {
                showframe: false,
                showcoastlines: false,
                projection: { type: 'mercator' },
                bgcolor: 'rgba(0,0,0,0)'
              }
            }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={barData as any}
            layout={{ ...chartLayout('Top 10 Countries by Startups'), height: 350 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={donutData as any}
            layout={{ ...chartLayout('Industry Distribution'), height: 350 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm md:col-span-2">
          <Plot
            data={lineData as any}
            layout={{ ...chartLayout('Industry Growth Trend'), height: 350 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
