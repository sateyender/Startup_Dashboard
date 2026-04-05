import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, Cell, ComposedChart, Line, Area 
} from 'recharts';
import { Globe, TrendingUp, Award, BarChart2 } from 'lucide-react';
import { startupData } from '../data';

export default function WorldComparison() {
  // Aggregate data by country
  const countryMap = startupData.reduce((acc: any, curr) => {
    if (!acc[curr.Country]) {
      acc[curr.Country] = { 
        name: curr.Country, 
        totalFunding: 0, 
        avgGrowth: 0, 
        count: 0,
        totalValuation: 0
      };
    }
    acc[curr.Country].totalFunding += curr.Total_Funding_MUSD;
    acc[curr.Country].avgGrowth += curr.Revenue_Growth_Percent;
    acc[curr.Country].totalValuation += curr.Valuation_MUSD;
    acc[curr.Country].count += 1;
    return acc;
  }, {});

  const countryData = Object.keys(countryMap).map(key => ({
    ...countryMap[key],
    avgGrowth: parseFloat((countryMap[key].avgGrowth / countryMap[key].count).toFixed(1)),
    totalFunding: parseFloat(countryMap[key].totalFunding.toFixed(2)),
    totalValuation: parseFloat(countryMap[key].totalValuation.toFixed(2))
  })).sort((a, b) => b.totalFunding - a.totalFunding);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6'];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-2xl">
          <Globe className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">World Comparison</h1>
          <p className="text-slate-500 text-lg">Benchmarking countries across key startup metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">Total Funding by Country (MUSD)</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="totalFunding" radius={[4, 4, 0, 0]}>
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-900">Avg. Revenue Growth % by Country</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="avgGrowth" fill="#ecfdf5" stroke="#10b981" />
                <Line type="monotone" dataKey="avgGrowth" stroke="#059669" strokeWidth={3} dot={{ r: 4, fill: '#059669' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-5 h-5 text-slate-600" />
          <h3 className="text-xl font-bold text-slate-900">Country Performance Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-4 font-semibold text-slate-600">Country</th>
                <th className="py-4 px-4 font-semibold text-slate-600">Startups</th>
                <th className="py-4 px-4 font-semibold text-slate-600 text-right">Total Funding</th>
                <th className="py-4 px-4 font-semibold text-slate-600 text-right">Total Valuation</th>
                <th className="py-4 px-4 font-semibold text-slate-600 text-right">Avg Growth</th>
              </tr>
            </thead>
            <tbody>
              {countryData.map((country, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-4 font-bold text-slate-900">{country.name}</td>
                  <td className="py-4 px-4 text-slate-500">{country.count}</td>
                  <td className="py-4 px-4 text-right font-medium text-indigo-600">${country.totalFunding}M</td>
                  <td className="py-4 px-4 text-right font-medium text-emerald-600">${country.totalValuation}M</td>
                  <td className="py-4 px-4 text-right">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">
                      {country.avgGrowth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
