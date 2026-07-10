import React from 'react';

export default function DayLayout({ date, subtitle, indicatorColor = 'bg-indigo-500', children }) {
  return (
    <section className="space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-2 w-2 rounded-full ${indicatorColor}`}></span>
        <h2 className="text-lg font-bold text-slate-200">{date} <span className="text-xs font-normal text-slate-400">({subtitle})</span></h2>
      </div>
      {children}
    </section>
  );
}