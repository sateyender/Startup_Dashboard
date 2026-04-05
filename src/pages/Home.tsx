import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Rocket, DollarSign, Users, TrendingUp } from 'lucide-react';
import { startupData } from '../data';

export default function Home() {
  const totalFunding = startupData.reduce((acc, curr) => acc + curr.Total_Funding_MUSD, 0);
  const totalValuation = startupData.reduce((acc, curr) => acc + curr.Valuation_MUSD, 0);
  const totalEmployees = startupData.reduce((acc, curr) => acc + curr.Employee_Count, 0);
  const profitableCount = startupData.filter(s => s.Is_Profitable === 1).length;
  const profitabilityRate = ((profitableCount / startupData.length) * 100).toFixed(1);

  // Industry distribution
  const industryMap = startupData.reduce((acc: any, curr) => {
    acc[curr.Industry] = (acc[curr.Industry] || 0) + 1;
    return acc;
  }, {});
  const industryData = Object.keys(industryMap).map(name => ({ name, value: industryMap[name] }));

  // Funding by Stage
  const stageMap = startupData.reduce((acc: any, curr) => {
    acc[curr.Funding_Stage] = (acc[curr.Funding_Stage] || 0) + curr.Total_Funding_MUSD;
    return acc;
  }, {});
  const stageData = Object.keys(stageMap).map(name => ({ name, value: parseFloat(stageMap[name].toFixed(2)) }));

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Startup Ecosystem Overview</h1>
        <p className="text-slate-500 text-lg">Global insights into funding, valuation, and industry trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Funding', value: `$${(totalFunding / 1000).toFixed(2)}B`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Valuation', value: `$${(totalValuation / 1000).toFixed(2)}B`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Employees', value: totalEmployees.toLocaleString(), icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Profitability Rate', value: `${profitabilityRate}%`, icon: Rocket, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={stat.bg + " p-3 rounded-xl group-hover:scale-110 transition-transform"}>
                <stat.icon className={"w-6 h-6 " + stat.color} />
              </div>
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Industry Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Funding by Stage (MUSD)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
