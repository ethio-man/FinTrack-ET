import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { buildChartData, fmt } from './mockData';
import { LanguageOpt } from '../../types';

interface MultiRingDonutProps {
  data: ReturnType<typeof buildChartData>;
  language: LanguageOpt;
}

const translations = {
  en: {
    categoryBreakdown: 'Category Breakdown',
    expenseDistribution: 'Expense distribution this period',
    total: 'total'
  },
  am: {
    categoryBreakdown: 'የምድብ ዝርዝር',
    expenseDistribution: 'የዚህ ጊዜ ወጪ ስርጭት',
    total: 'ጠቅላላ'
  }
};

export default function MultiRingDonut({ data, language }: MultiRingDonutProps) {
  const t = translations[language.code as keyof typeof translations] || translations.en;
  const grand = data.reduce((a, d) => a + d.rawAmount, 0);
  const largest = [...data].sort((a, b) => b.value - a.value)[0];

  return (
    <div
      className="rounded-2xl p-6 flex flex-col shadow-sm border border-[var(--border-subtle)] transition-colors"
      style={{ background: 'linear-gradient(135deg, #1a2744 0%, #0f1b35 100%)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white text-sm font-semibold" style={{ opacity: 0.95 }}>{t.categoryBreakdown}</h3>
          <p className="text-xs mt-0.5" style={{ color: '#14b8a6' }}>{t.expenseDistribution}</p>
        </div>
        {/* Decorative icons */}
        <div className="flex gap-2" style={{ opacity: 0.6 }}>
          {['▦','↗','↺','◉'].map((s, i) => (
            <span key={i} className="text-teal-400 text-xs">{s}</span>
          ))}
        </div>
      </div>

      {/* Legend counts row */}
      <div className="flex gap-4 mb-2">
        {data.map(d => (
          <span key={d.name} className="text-xs font-medium" style={{ color: d.fill }}>
            {d.value}%
          </span>
        ))}
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={175}
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={6}
              background={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <RechartsTooltip
              formatter={(val: number, name: string) => {
                const d = data.find(x => x.name === name);
                return [d ? fmt(d.rawAmount) : '', name];
              }}
              contentStyle={{ background: '#1e2d45', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 12 }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-white leading-none">{largest?.value}<sup className="text-lg font-medium">%</sup></span>
          <span className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            ETB {(grand / 1000).toFixed(0)}K {t.total}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
