import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Day1Section, Day2Section, Day3Section, Day4Section } from './components/TimelineSections';


// Helper component for the expandable contacts list
function PocsDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const handleToggle = () => setIsOpen(window.showPocsExplicit);
    window.addEventListener('toggle-pocs', handleToggle);
    return () => window.removeEventListener('toggle-pocs', handleToggle);
  }, []);

  // 📝 UPDATE YOUR ACTUAL TEAM POC DETAILS HERE
  const pocList = [
    { name: "Purushotham", phone: "+91 91774 29619"},
    { name: "Dhanushkumar", phone: "+91 96291 15654"},
    { name: "Senthilkumar", phone: "+91 98840 85652"},
    { name: "Srinath", phone: "+91 96000 80801"}
  ];

  if (!isOpen) return null;

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 space-y-1.5 animate-fadeIn max-h-40 overflow-y-auto shadow-inner">
      {pocList.map((poc, idx) => (
        <div key={idx} className="flex items-center justify-between bg-white border border-stone-200/60 p-2 rounded-lg text-xs">
          <div>
            <p className="font-extrabold text-stone-900">{poc.name}</p>
            <p className="text-[10px] text-stone-500 italic font-medium">{poc.role}</p>
          </div>
          <a 
            href={`tel:${poc.phone}`}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono font-bold text-[11px] px-2.5 py-1 rounded"
          >
            <i className="fa-solid fa-phone text-[9px]"></i>
            {poc.phone}
          </a>
        </div>
      ))}
    </div>
  );
}

export default function ItineraryApp() {
  const [activeDay, setActiveDay] = useState('all');
  const [passengerDataOnward, setPassengerDataOnward] = useState([]);
  const [passengerDataReturn, setPassengerDataReturn] = useState([]);
  const [carpoolData, setCarpoolData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. HELPER FOR TRAIN DATA
    const fetchAndParseExcel = (filePath) => {
      return fetch(filePath)
        .then((res) => {
          if (!res.ok) throw new Error(`Asset not resolved at path: ${filePath}`);
          return res.arrayBuffer();
        })
        .then((buffer) => {
          const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawJson = XLSX.utils.sheet_to_json(worksheet);
          
          return rawJson.map(row => {
            let parsedName = '';
            let parsedSeatDetails = '';

            Object.keys(row).forEach(key => {
              const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, '');
              if (normalizedKey === 'name') {
                parsedName = row[key];
              } else if (normalizedKey.includes('seat') || normalizedKey.includes('birth')) {
                parsedSeatDetails = row[key];
              }
            });

            return {
              name: parsedName || '',
              seatDetails: parsedSeatDetails || '-'
            };
          });
        });
    };

    // 2. HELPER SPECIFICALLY FOR CARPOOL DATA
    const fetchCarpoolData = (filePath) => {
      return fetch(filePath)
        .then((res) => {
          if (!res.ok) throw new Error(`Asset not resolved at path: ${filePath}`);
          return res.arrayBuffer();
        })
        .then((buffer) => {
          const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { 
            defval: "", 
            blankrows: true 
          });

          let processedGroups = [];
          let currentGroupIndex = 0;
          let isNextPersonLeader = true;

          rawRows.forEach((row) => {
            let name = '';
            let location = '';
            let mobile = '';

            Object.keys(row).forEach(key => {
              const normKey = key.trim().toLowerCase();
              if (normKey === 'name') name = String(row[key]).trim();
              if (normKey === 'location') location = String(row[key]).trim();
              if (normKey === 'mobile') mobile = String(row[key]).trim();
            });

            const isRowBlank = name.replace(/\s+/g, '') === '' && 
                               location.replace(/\s+/g, '') === '' && 
                               mobile.replace(/\s+/g, '') === '';

            if (isRowBlank) {
              if (!isNextPersonLeader) { 
                currentGroupIndex++;     
                isNextPersonLeader = true; 
              }
              return; 
            }

            processedGroups.push({
              name,
              location: location || 'N/A',
              mobile: mobile || '-',
              groupIndex: currentGroupIndex,    
              isGroupLeader: isNextPersonLeader 
            });

            isNextPersonLeader = false;
          });

          return processedGroups;
        });
    };

    // 3. FIRE ALL REQUESTS CONCURRENTLY
    Promise.all([
      fetchAndParseExcel('/files/ChennaiToMysore.xlsx'),
      fetchAndParseExcel('/files/MysoreToChennai.xlsx'),
      fetchCarpoolData('/files/TransitGroups.xlsx').catch(() => [])
    ])
      .then(([onwardData, returnData, carpoolDataResult]) => {
        setPassengerDataOnward(onwardData);
        setPassengerDataReturn(returnData);
        setCarpoolData(carpoolDataResult); 
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Parallel Excel mapping failure:", err);
        setIsLoading(false);
      });
  }, []);

  const navigationTabs = [
    { id: 'all', label: 'All Days' },
    { id: 'day1', label: 'Jul 15', sub: 'Wed' },
    { id: 'day2', label: 'Jul 16', sub: 'Thu' },
    { id: 'day3', label: 'Jul 17', sub: 'Fri' },
    { id: 'day4', label: 'Jul 18', sub: 'Sat' },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-800 font-sans pb-24 selection:bg-emerald-600/20 selection:text-emerald-50">

      {/* Sticky Navigation Tabs Header */}
      <header className="sticky top-0 z-50 bg-[#f7f5f0]/90 backdrop-blur-md border-b border-stone-200 p-4 mt-4 shadow-sm">
        <div className="max-w-md mx-auto flex bg-stone-200/50 p-1 rounded-xl border border-stone-200/40">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDay(tab.id)}
              className={`flex-1 py-2 rounded-lg text-center transition-all duration-200 cursor-pointer focus:outline-none ${
                activeDay === tab.id
                  ? 'bg-white border border-stone-200 text-emerald-900 font-extrabold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <div className="text-xs">{tab.label}</div>
              {tab.sub && <div className="text-[9px] opacity-70 font-normal">{tab.sub}</div>}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-md mx-auto px-4 pt-6 space-y-8">
        {(activeDay === 'all' || activeDay === 'day1') && (
          <Day1Section passengers={passengerDataOnward} groups={carpoolData} loading={isLoading} />
        )}
        
        {(activeDay === 'all' || activeDay === 'day2') && <Day2Section />}
        
        {(activeDay === 'all' || activeDay === 'day3') && <Day3Section />}
        
        {(activeDay === 'all' || activeDay === 'day4') && (
          <Day4Section passengers={passengerDataReturn} loading={isLoading} />
        )}
      </main>
      {/* 🟢 PASTE THE STICKY EMERGENCY CONTACT FOOTER HERE */}
      <footer className="fixed max-w-md mx-auto bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto space-y-3">
          
          {/* Main Footer Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-rose-50 h-8 w-8 rounded-lg flex items-center justify-center border border-rose-100">
                <i className="fa-solid fa-phone-flip text-rose-600 text-xs animate-pulse"></i>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-wider text-stone-400">Emergency Support</p>
                <p className="text-xs font-bold text-stone-800">Organizing Committee</p>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => {
                // Toggles a quick local state. 
                // To use this, add: const [showPocs, setShowPocs] = useState(false); at the top of ItineraryApp()
                window.setShowPocsState ? window.setShowPocsState(!window.showPocsExplicit) : (window.showPocsExplicit = !window.showPocsExplicit);
                const event = new CustomEvent('toggle-pocs');
                window.dispatchEvent(event);
              }}
              className="bg-stone-900 hover:bg-stone-800 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-lg border border-stone-800 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <i className="fa-solid fa-address-book text-[10px]"></i>
              Call POC
            </button>
          </div>

          {/* Expandable Contacts Drawer */}
          <PocsDrawer />
        </div>
      </footer>
    </div>
  );
}