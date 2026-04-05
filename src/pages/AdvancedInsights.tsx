import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { Brain, TrendingUp, Target, ShieldCheck } from 'lucide-react';

const timeSeriesData = [
  { date: '2024-01', actual: 4000, predicted: 4100 },
  { date: '2024-02', actual: 3000, predicted: 3200 },
  { date: '2024-03', actual: 2000, predicted: 2100 },
  { date: '2024-04', actual: 2780, predicted: 2600 },
  { date: '2024-05', actual: 1890, predicted: 1950 },
  { date: '2024-06', actual: 2390, predicted: 2400 },
  { date: '2024-07', actual: 3490, predicted: 3300 },
];

const modelMetrics = [
  { subject: 'Accuracy', A: 120, B: 110, fullMark: 150 },
  { subject: 'Precision', A: 98, B: 130, fullMark: 150 },
  { subject: 'Recall', A: 86, B: 130, fullMark: 150 },
  { subject: 'F1-Score', A: 99, B: 100, fullMark: 150 },
  { subject: 'AUC-ROC', A: 85, B: 90, fullMark: 150 },
];

export default function AdvancedInsights() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Advanced Insights</h1>
          <p className="text-slate-500 mt-2">Predictive modeling, time-series forecasting, and model evaluation.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
            <Brain className="w-4 h-4" />
            Retrain Model
          </button>
        </div>
      </header>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Time Series Trends</h2>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Actual vs. Predicted Forecast</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="actual" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} name="Actual Value" />
                <Line type="monotone" dataKey="predicted" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Model Prediction" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Model Performance</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Radar</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={modelMetrics}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 12}} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} axisLine={false} tick={false} />
                  <Radar name="Current Model" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Radar name="Baseline" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Model Health
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">RMSE</p>
                  <p className="text-xl font-bold text-slate-900">124.5</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">MAE</p>
                  <p className="text-xl font-bold text-slate-900">89.2</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">R² Score</p>
                  <p className="text-xl font-bold text-slate-900">0.94</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Training Time</p>
                  <p className="text-xl font-bold text-slate-900">12.4s</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <h4 className="font-bold text-lg mb-2">Insight Summary</h4>
              <p className="text-indigo-100 text-sm leading-relaxed">
                The model shows strong predictive power for seasonal trends. 
                The R² score of 0.94 indicates that 94% of the variance is explained 
                by the features. Recommend increasing training data for Q4.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
