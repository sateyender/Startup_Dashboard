import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);
import { useFilters } from '../context/FilterContext';
import { DollarSign, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function OverviewDashboard() {
  const { filteredData } = useFilters();

  // KPI Calculations
  const totalFunding = filteredData.reduce((acc, curr) => acc + curr.Total_Funding_MUSD, 0);
  const totalValuation = filteredData.reduce((acc, curr) => acc + curr.Valuation_MUSD, 0);
  const avgGrowth = filteredData.length > 0 
    ? filteredData.reduce((acc, curr) => acc + curr.Revenue_Growth_Percent, 0) / filteredData.length 
    : 0;
  const profitableCount = filteredData.filter(s => s.Is_Profitable === 1).length;
  const profitabilityRate = filteredData.length > 0 ? (profitableCount / filteredData.length) * 100 : 0;

  // 1. World Map Data (Funding by Country)
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
    colorscale: 'Blues',
    autocolorscale: false,
    reversescale: true,
    marker: { line: { color: 'rgb(255,255,255)', width: 0.5 } },
    colorbar: { title: 'MUSD', thickness: 15 }
  }];

  // 2. Bar Chart (Funding by Industry)
  const industryFunding = filteredData.reduce((acc: any, curr) => {
    acc[curr.Industry] = (acc[curr.Industry] || 0) + curr.Total_Funding_MUSD;
    return acc;
  }, {});
  const barData = [{
    x: Object.keys(industryFunding),
    y: Object.values(industryFunding),
    type: 'bar',
    marker: { color: '#3b82f6' }
  }];

  // 3. Line Chart (Revenue Trend - Sampled)
  const lineData = [{
    x: filteredData.slice(0, 20).map(s => s.Startup_ID),
    y: filteredData.slice(0, 20).map(s => s.Annual_Revenue_MUSD),
    type: 'scatter',
    mode: 'lines+markers',
    line: { color: '#6366f1', width: 3 },
    marker: { size: 8 }
  }];

  // 4. Donut Chart (Funding Stage Distribution)
  const stageCounts = filteredData.reduce((acc: any, curr) => {
    acc[curr.Funding_Stage] = (acc[curr.Funding_Stage] || 0) + 1;
    return acc;
  }, {});
  const donutData = [{
    values: Object.values(stageCounts),
    labels: Object.keys(stageCounts),
    type: 'pie',
    hole: 0.6,
    marker: { colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'] }
  }];

  const chartLayout = (title: string) => ({
    title: { text: title, font: { size: 16, color: '#1e293b', family: 'Inter' } },
    autosize: true,
    margin: { l: 40, r: 20, t: 60, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter', color: '#64748b' }
  });

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Overview Dashboard</h1>
        <p className="text-slate-500 text-lg mt-2 font-medium">Strategic summary of the global startup ecosystem.</p>
      </header>

      {filteredData.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Data Found</h2>
          <p className="text-slate-500">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <>
          {/* KPI Section - Max 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Funding', value: `$${(totalFunding / 1000).toFixed(2)}B`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Valuation', value: `$${(totalValuation / 1000).toFixed(2)}B`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Avg Growth', value: `${avgGrowth.toFixed(1)}%`, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Profitability', value: `${profitabilityRate.toFixed(1)}%`, icon: CheckCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
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

          {/* Charts Section - Max 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <Plot
                data={mapData}
                layout={{
                  ...chartLayout('Global Funding Distribution (MUSD)'),
                  geo: {
                    showframe: false,
                    showcoastlines: false,
                    projection: { type: 'mercator' },
                    bgcolor: 'rgba(0,0,0,0)'
                  },
                  height: 500
                }}
                useResizeHandler={true}
                className="w-full"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <Plot
                data={barData}
                layout={{ ...chartLayout('Funding by Industry Sector'), height: 400 }}
                useResizeHandler={true}
                className="w-full"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <Plot
                data={donutData}
                layout={{ ...chartLayout('Funding Stage Distribution'), height: 400, showlegend: true }}
                useResizeHandler={true}
                className="w-full"
              />
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <Plot
                data={lineData}
                layout={{ ...chartLayout('Annual Revenue Trend (Top 20 Startups)'), height: 400 }}
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
