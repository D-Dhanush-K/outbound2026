import React from 'react';

export default function QuickContactBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 max-w-md mx-auto z-50 flex justify-between items-center shadow-2xl">
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Need immediate help?</span>
        <span className="text-xs font-medium text-slate-300">Event Coordinator Desk</span>
      </div>
      <a
        href="tel:+919876543210"
        className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-98 transition-all"
      >
        <i className="fa-solid fa-phone text-[10px]"></i> Call Coordinator
      </a>
    </div>
  );
}