import React from 'react';
import { Files, Globe, MapPin, CheckCircle2, Send, RotateCcw, TrendingUp } from 'lucide-react';

export const AdminStatsCards = ({ stats = {} }) => {
  const cards = [
    {
      label: 'Total ATTs',
      value: stats.total || 0,
      icon: Files,
      color: 'text-blue-700',
      bgIcon: 'bg-blue-50 text-blue-700 border-blue-200/60',
      cardHover: 'hover:border-blue-300',
      barColor: 'bg-blue-600',
    },
    {
      label: 'Local Travel',
      value: stats.local || 0,
      icon: MapPin,
      color: 'text-teal-700',
      bgIcon: 'bg-teal-50 text-teal-700 border-teal-200/60',
      cardHover: 'hover:border-teal-300',
      barColor: 'bg-teal-600',
    },
    {
      label: 'Travel Abroad',
      value: stats.abroad || 0,
      icon: Globe,
      color: 'text-indigo-700',
      bgIcon: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      cardHover: 'hover:border-indigo-300',
      barColor: 'bg-indigo-600',
    },
    {
      label: 'Signed',
      value: stats.signed || 0,
      icon: CheckCircle2,
      color: 'text-emerald-700',
      bgIcon: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      cardHover: 'hover:border-emerald-300',
      barColor: 'bg-emerald-600',
    },
    {
      label: 'Submitted',
      value: stats.submitted || 0,
      icon: Send,
      color: 'text-amber-700',
      bgIcon: 'bg-amber-50 text-amber-700 border-amber-200/60',
      cardHover: 'hover:border-amber-300',
      barColor: 'bg-amber-600',
    },
    {
      label: 'Returned',
      value: stats.returned || 0,
      icon: RotateCcw,
      color: 'text-rose-700',
      bgIcon: 'bg-rose-50 text-rose-700 border-rose-200/60',
      cardHover: 'hover:border-rose-300',
      barColor: 'bg-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative ${c.cardHover}`}
          >
            <div className={`absolute top-0 inset-x-0 h-1 ${c.barColor} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
            <div className="flex items-center justify-between text-slate-500 mb-2 mt-0.5">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">
                {c.label}
              </span>
              <div className={`p-2 rounded-xl border shadow-2xs group-hover:scale-110 transition-transform ${c.bgIcon}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <h3 className={`text-2xl font-black tracking-tight ${c.color}`}>
              {c.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
};
