import React, { useState, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import { startupData } from '../data';
import { Users, DollarSign, TrendingUp } from 'lucide-react';

export default function IndiaAnalysis() {
  const [selectedSector, setSelectedSector] = useState('All');

  const indiaData = useMemo(() => startupData.filter(s => s.Country === 'India'), []);
  const sectors = useMemo(() => ['All', ...Array.from(new Set(indiaData.map(s => s.Industry))).sort()], [indiaData]);

  const filteredData = useMemo(() => {
    if (selectedSector === 'All') return indiaData;
    return indiaData.filter(s => s.Industry === selectedSector);
  }, [indiaData, selectedSector]);

  // KPIs
  const totalStartups = filteredData.length;
  const totalFunding = filteredData.reduce((acc, curr) => acc + curr.Total_Funding_MUSD, 0);
  const formattedFunding = totalFunding >= 1000 
    ? `${(totalFunding / 1000).toFixed(1)}K` 
    : totalFunding.toFixed(1);
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

  // 1. Funding Stage Distribution (Donut)
  const stageCounts = filteredData.reduce((acc: any, curr) => {
    acc[curr.Funding_Stage] = (acc[curr.Funding_Stage] || 0) + 1;
    return acc;
  }, {});
  const donutData = [{
    values: Object.values(stageCounts),
    labels: Object.keys(stageCounts),
    type: 'pie',
    hole: 0.6,
    textinfo: 'label+value+percent',
    textposition: 'outside',
    marker: { colors: ['#2dd4bf', '#0d9488', '#14b8a6', '#5eead4', '#99f6e4'] }
  }];

  // 2. Profitable Split (Donut)
  const profitCounts = filteredData.reduce((acc: any, curr) => {
    const label = curr.Is_Profitable === 1 ? 'Profitable' : 'Not Profitable';
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const profitDonutData = [{
    values: Object.values(profitCounts),
    labels: Object.keys(profitCounts),
    type: 'pie',
    hole: 0.6,
    textinfo: 'label+value+percent',
    textposition: 'outside',
    marker: { colors: ['#0d9488', '#94a3b8'] }
  }];

  // 3. Top 10 Sectors by Startups (Bar)
  const sectorCounts = filteredData.reduce((acc: any, curr) => {
    acc[curr.Industry] = (acc[curr.Industry] || 0) + 1;
    return acc;
  }, {});
  const topSectors = Object.entries(sectorCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10);
  const barData = [{
    x: topSectors.map(s => s[0]),
    y: topSectors.map(s => s[1]),
    text: topSectors.map(s => s[1]),
    textposition: 'auto',
    type: 'bar',
    marker: { color: '#2dd4bf' }
  }];

  // 4. Funding by Sector (Horizontal Bar)
  const sectorFunding = filteredData.reduce((acc: Record<string, number>, curr) => {
    acc[curr.Industry] = (acc[curr.Industry] || 0) + curr.Total_Funding_MUSD;
    return acc;
  }, {});
  const hBarData = [{
    y: Object.keys(sectorFunding),
    x: Object.values(sectorFunding),
    text: Object.values(sectorFunding).map((v: number) => `${(v / 1000).toFixed(1)}K`),
    textposition: 'auto',
    type: 'bar',
    orientation: 'h',
    marker: { color: '#0d9488' }
  }];

  // 5. Revenue Growth by Sector (Line)
  const sectorGrowth = filteredData.reduce((acc: any, curr) => {
    if (!acc[curr.Industry]) acc[curr.Industry] = { total: 0, count: 0 };
    acc[curr.Industry].total += curr.Revenue_Growth_Percent;
    acc[curr.Industry].count += 1;
    return acc;
  }, {});
  const lineData = [{
    x: Object.keys(sectorGrowth),
    y: Object.keys(sectorGrowth).map(k => sectorGrowth[k].total / sectorGrowth[k].count),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#14b8a6', width: 3 },
    marker: { size: 8, color: '#0d9488' }
  }];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">India Startup Pulse Analytics Dashboard</h1>
          <p className="text-slate-500 font-medium">Deep dive into the Indian startup ecosystem</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Sector Filter</span>
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-slate-50 border-none text-slate-900 text-sm rounded-lg focus:ring-0 block p-2 outline-none cursor-pointer"
          >
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Startup', value: totalStartups, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Total Funding (MUSD)', value: formattedFunding, icon: DollarSign, color: 'text-teal-700', bg: 'bg-teal-100' },
          { label: 'Avg Revneue Growth %', value: avgGrowth.toFixed(1), icon: TrendingUp, color: 'text-teal-800', bg: 'bg-teal-200' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={donutData as any}
            layout={{ ...chartLayout('Funding Stage Distribution'), height: 300 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={profitDonutData as any}
            layout={{ ...chartLayout('Profitable Split'), height: 300 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <Plot
            data={barData as any}
            layout={{ ...chartLayout('Top 10 Sectors by Startups'), height: 300 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2">
          <Plot
            data={hBarData as any}
            layout={{ ...chartLayout('Funding by Sector (MUSD)'), height: 350, margin: { l: 120, r: 20, t: 50, b: 40 } }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm lg:col-span-1">
          <Plot
            data={lineData as any}
            layout={{ ...chartLayout('Revenue Growth by Sector'), height: 350 }}
            useResizeHandler={true}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
