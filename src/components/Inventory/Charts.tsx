import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Product, stockPct, stockStatus } from './mockData';

export function Sparkline({ data, color }: { data: { units: number }[]; color: string }) {
  const id = `sg-${color.replace('#', '')}`;
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="units" stroke={color} strokeWidth={2}
          fill={`url(#${id})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StockGauge({ product, language }: { product: Product; language?: { code: string } }) {
  // simple local translation fallback for the gauge labels
  const isAm = language?.code === 'am';
  
  const pct = stockPct(product);
  const status = stockStatus(product);
  const color = status === 'out' ? '#ef4444' : status === 'low' ? '#f59e0b' : '#6366f1';
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={r} fill="none" stroke="var(--border-subtle, #f3f4f6)" strokeWidth={10} />
        <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        <text x={50} y={47} textAnchor="middle" className="text-base font-semibold" style={{ fontSize: 16, fill: 'var(--text-core, #111)' }}>{product.stock}</text>
        <text x={50} y={62} textAnchor="middle" style={{ fontSize: 10, fill: 'var(--text-sec, #6b7280)' }}>{product.unit}</text>
      </svg>
      <span className={`text-xs mt-1 font-medium ${status === 'out' ? 'text-red-500' : status === 'low' ? 'text-amber-500' : 'text-indigo-500'}`}>
        {status === 'out' ? (isAm ? 'ክምችት አልቋል' : 'Out of stock') 
         : status === 'low' ? (isAm ? 'አነስተኛ ክምችት' : 'Low stock') 
         : (isAm ? 'በክምችት ውስጥ ያለ' : 'In stock')}
      </span>
    </div>
  );
}
