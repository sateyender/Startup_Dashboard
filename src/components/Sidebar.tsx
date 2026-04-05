import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, TrendingUp, Database, Filter, Globe } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useFilters } from '../context/FilterContext';

const navItems = [
  { name: 'India Analysis', path: '/', icon: LayoutDashboard },
  { name: 'World Analysis', path: '/world', icon: Globe },
  { name: 'Final Result', path: '/comparison', icon: TrendingUp },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2">
        <Database className="w-6 h-6 text-teal-600" />
        <span className="font-bold text-xl tracking-tight text-slate-900">StartupLab</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="pb-4 mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Dashboard</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-teal-50 text-teal-700 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dataset Status</p>
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Analysis
          </div>
        </div>
      </div>
    </div>
  );
}
