import React from 'react';

export default function PDFButton({ href, label, subtext, icon = 'fa-file-pdf', colorTheme = 'rose' }) {
  const themes = {
    rose: 'from-rose-950/40 to-red-950/40 border-rose-500/30 text-rose-300 bg-rose-500/10 border-rose-500/20 text-rose-400',
    emerald: 'from-emerald-950/40 to-teal-950/40 border-emerald-500/30 text-emerald-300 bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  };

  const selectedTheme = themes[colorTheme] || themes.rose;
  const borderColors = selectedTheme.split(' ')[2];

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center justify-between bg-gradient-to-r ${selectedTheme.split(' ').slice(0,2).join(' ')} border ${selectedTheme.split(' ')[2]} hover:brightness-110 transition-all p-3.5 rounded-xl group cursor-pointer`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${selectedTheme.split(' ').slice(4,7).join(' ')} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <i className={`fa-solid ${icon} text-lg`}></i>
        </div>
        <div className="text-left">
          <p className="font-bold text-xs uppercase tracking-wide">{label}</p>
          <p className="text-[11px] text-slate-400">{subtext}</p>
        </div>
      </div>
      <i className={`fa-solid fa-arrow-up-right-from-square text-xs opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}></i>
    </a>
  );
}