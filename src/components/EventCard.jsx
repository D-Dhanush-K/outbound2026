import React from 'react';

export default function EventCard({ time, title, description, badgeColor = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400', children }) {
  return (
    <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5">
      <div className={`text-xs font-bold ${badgeColor} border px-2.5 py-1 rounded-md inline-block`}>
        {time}
      </div>
      <h3 className="font-bold text-base text-white">{title}</h3>
      {description && <p className="text-xs text-slate-400 leading-relaxed">{description}</p>}
      {children}
    </div>
  );
}