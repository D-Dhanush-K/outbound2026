import React, { useState } from 'react';

// =========================================================
// CORE LAYOUT COMPONENTS (BRIGHT WILD THEME)
// =========================================================

function DayLayout({ date, subtitle, indicatorColor = 'bg-emerald-600', children }) {
  return (
    <section className="space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-2 border-b border-stone-200 pb-2">
        <span className={`h-2.5 w-2.5 rounded-full ${indicatorColor}`}></span>
        <h2 className="text-base font-black text-stone-900 tracking-wide uppercase">
          {date} <span className="text-xs font-normal text-stone-500 lowercase italic">({subtitle})</span>
        </h2>
      </div>
      {children}
    </section>
  );
}

function EventCard({ time, title, description, badgeColor = 'bg-emerald-50 border-emerald-200/60 text-emerald-800', children }) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-2 hover:border-stone-300 transition-all duration-200">
      <div className={`text-[15px] font-mono font-bold ${badgeColor} border px-3 py-1 rounded inline-block tracking-wide`}>
        {time}
      </div>
      <h3 className="font-extrabold text-sm text-stone-900 tracking-wide">{title}</h3>
      {description && <p className="text-xs text-stone-600 leading-relaxed font-medium">{description}</p>}
      {children}
    </div>
  );
}

// =========================================================
// CARPOOL / TRANSIT CLUSTER DROPDOWN
// =========================================================

// 🎨 Clean, high-contrast light theme variants for structural carpool group separation
const groupBgStyles = [
  "bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50/80",
  "bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50/80",
  "bg-fuchsia-50/50 border-fuchsia-100 hover:bg-fuchsia-50/80",
  "bg-amber-50/40 border-amber-100 hover:bg-amber-50/70",
  "bg-cyan-50/50 border-cyan-100 hover:bg-cyan-50/80",
];

export function TransitGroupDropdown({ groups = [], loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = (groups || []).filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-3 space-y-2">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center justify-between w-full p-3 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/60 rounded-xl text-emerald-900 font-bold text-xs cursor-pointer focus:outline-none transition-colors shadow-sm"
      >
        <span className="flex items-center gap-3">
          <i className="fa-solid fa-users text-base text-emerald-700"></i>
          <span className="text-left">
            <p className="uppercase tracking-wide">
              {loading ? 'Analyzing Transit Clusters...' : 'View Pickup Groups & Leaders'}
            </p>
            <p className="text-[11px] text-stone-500 font-normal">Click to see coordination circles</p>
          </span>
        </span>
        <i className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs opacity-70`}></i>
      </button>

      {isOpen && (
        <div className="bg-white border border-stone-200 rounded-xl p-3 max-h-96 overflow-y-auto space-y-2.5 shadow-md animate-fadeIn">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-[11px] text-stone-400"></i>
            <input 
              type="text" 
              placeholder="Search by name or pickup location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          
          <div className="space-y-1.5">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((member, index) => {
                const clusterStyle = groupBgStyles[member.groupIndex % groupBgStyles.length];
                const leaderBorder = member.isGroupLeader ? "border-l-4 border-l-emerald-600" : "";

                return (
                  <div 
                    key={index} 
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border transition-colors text-xs gap-1.5 ${clusterStyle} ${leaderBorder}`}
                  >
                    <div className="flex items-center gap-2">
                      {member.isGroupLeader ? (
                        <span className="flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                          POC
                        </span>
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-stone-300 ml-2"></span>
                      )}
                      <span className={`tracking-wide ${member.isGroupLeader ? 'font-black text-stone-900' : 'text-stone-700 font-medium'}`}>
                        {member.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 justify-between sm:justify-end text-stone-500">
                      <span className="text-[11px] font-medium italic">📍 {member.location}</span>
                      {member.mobile && member.mobile !== '-' && (
                        <span className="text-stone-400 font-mono text-[11px]">📞 {member.mobile}</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-[11px] text-stone-400 text-center py-4 bg-stone-50 rounded-lg">
                No cluster matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// TRAIN SEAT DROPDOWN
// =========================================================

function TrainSeatDropdown({ passengers = [], loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPassengers = (passengers || []).filter(p => {
    const nameStr = p.name ? String(p.name).toLowerCase() : '';
    return nameStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="mt-3 space-y-2">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center justify-between w-full p-3 bg-rose-50 hover:bg-rose-100/70 border border-rose-200/60 rounded-xl text-rose-900 font-bold text-xs cursor-pointer focus:outline-none shadow-sm"
      >
        <span className="flex items-center gap-3">
          <i className="fa-solid fa-train text-base text-rose-700"></i>
          <span className="text-left">
            <p className="uppercase tracking-wide">
              {loading ? 'Loading Passenger Manifest...' : 'View Seats & Berths'}
            </p>
            <p className="text-[11px] text-stone-500 font-normal">Click to expand live allocation</p>
          </span>
        </span>
        <i className={`fa-solid ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs opacity-70`}></i>
      </button>

      {isOpen && (
        <div className="bg-white border border-stone-200 rounded-xl p-3 max-h-64 overflow-y-auto space-y-2.5 shadow-md animate-fadeIn">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-[11px] text-stone-400"></i>
            <input 
              type="text" 
              placeholder="Type your name to search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-rose-500/50"
            />
          </div>
          
          <div className="divide-y divide-stone-100 overflow-hidden rounded-lg border border-stone-200 shadow-sm">
            {filteredPassengers.length > 0 ? (
              filteredPassengers.map((passenger, index) => (
                <div key={index} className="flex justify-between items-center py-2.5 px-3 bg-white hover:bg-stone-50 transition-colors text-xs">
                  <span className="text-stone-700 font-semibold tracking-wide">{passenger.name}</span>
                  <span className="text-rose-800 font-mono font-black bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 text-[11px]">
                    {passenger.seatDetails}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-stone-400 text-center py-4 bg-stone-50">
                No matching team member found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================
// MAIN CHRONO-TIMELINE SECTIONS EXPORTS
// =========================================================

export function Day1Section({ passengers = [], groups = [], loading }) {
  return (
    <DayLayout date="15th July" subtitle="Wednesday" indicatorColor="bg-emerald-700">
      <EventCard time="8:00 PM" title="Home to Chennai Central" description="Coordinate with your designated car-pooling circles or arrange personal transport.">
        <TransitGroupDropdown groups={groups} loading={loading} />
      </EventCard>
      <EventCard time="9:00 PM" title="Train - Kaveri Express 🚂">
        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex gap-2.5 mb-2 shadow-sm font-medium">
          <i className="fa-solid fa-circle-exclamation text-base text-amber-700 mt-0.5"></i>
          <p><strong>Dinner:</strong> Not available on-board. Please pack your food!</p>
          
        </div>
        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex gap-2.5 mb-2 shadow-sm font-medium">
          <i className="fa-solid fa-circle-exclamation text-base text-amber-700 mt-0.5"></i>
          <p><strong>Note:</strong> Please ensure you have a valid ID proof for boarding.</p>
          
        </div>
        
        <TrainSeatDropdown passengers={passengers} loading={loading} />
      </EventCard>
    </DayLayout>
  );
}

export function Day2Section() {
  const resortActivities = [
    { name: "🪂 Zipline", detail: "₹400 per Head (3:00 PM - 6:30 PM)" },
    { name: "🏊 Swimming Pool", detail: "8:00 AM - 8:00 PM" },
    { name: "🛶 Fishing & Kayaking", detail: "3:00 PM - 6:00 PM (Weather permitting)" },
    { name: "🎮 Indoor Activities", detail: "TT, Hand Soccer, Snooker & Board Games (8:00 AM - 10:00 PM)" },
    { name: "🏸 Outdoor Sports", detail: "Badminton, Football, Cricket, Basketball (8:00 AM - 6:00 PM)" },
  ];

  return (
    <DayLayout date="16th July" subtitle="Thursday" indicatorColor="bg-emerald-600">
      <EventCard time="6:40 AM" title="Mysore Railway Station Arrival 🚂" description="Exit the station and head to the boarding point. 2 Buses (24-Seater capacity each) are ready for transit." />
      <EventCard time="7:30 AM" title="Check-in: Q Start Hotel Mysore 🏨" description="10 Rooms allocated for quick refreshment, Available strictly from 7:30 AM to 9:00 AM." />
      <EventCard time="9:00 AM - 9:45 AM" title="Buffet Breakfast 🥞" description="Served at Q Start Hotel Mysore." />
      <EventCard 
  time="9:45 AM - 10:00 AM" 
  title="Boarding Bus to Wild Planet Resort 🚌" 
  description="Assemble at the lobby, board the transit vehicles, and begin our journey to the resort." 
/>
      <EventCard 
  time="Transit Stop" 
  title="10-Minute Pit Stop " 
  description="A quick break for refreshments during our transit from Mysore to Nilgiris." 
  badgeColor="bg-stone-100 border-stone-200 text-stone-600" 
/>
      <EventCard time="1:30 PM" title="Arrival at Wild Planet Resort & Check-in 🏡" description="Standard check-in initialized. 14 rooms allocated for our group stay." />
      <EventCard time="2:00 PM - 3:00 PM" title="Grand Lunch Buffet 🍱" />
      <EventCard time="2:30 PM - 4:30 PM" title="Leisure & Resort Amenities — Slot 1 ✨" description="Time to explore the natural surroundings and available resort facilities:" badgeColor="bg-purple-50 border-purple-200 text-purple-900">
        <div className="grid grid-cols-1 gap-1.5 mt-2 bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-[11px] shadow-inner">
          {resortActivities.map((act, i) => (
            <div key={i} className="flex justify-between border-b border-stone-200/60 pb-1 last:border-0 last:pb-0">
              <span className="font-bold text-stone-700">{act.name}</span>
              <span className="text-stone-500 font-mono text-right">{act.detail}</span>
            </div>
          ))}
        </div>
      </EventCard>
      <EventCard time="4:30 PM - 5:00 PM" title="High Tea & Evening Snacks ☕" />
      <EventCard time="5:00 PM - 7:00 PM" title="Leisure & Exploration — Slot 2 🌅" description="Continue individual matches or head out for group activities before sundown." badgeColor="bg-purple-50 border-purple-200 text-purple-900" />
      <EventCard time="7:15 PM - 8:30 PM" title="Campfire Night 🔥" badgeColor="bg-amber-50 border-amber-200 text-amber-900">
  <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 flex gap-2.5 font-medium shadow-sm">
    <i className="fa-solid fa-fire-alt text-amber-700 text-sm mt-0.5"></i>
    <p>Please assemble at the campfire area for an evening of fun, music, and laughs together!</p>
  </div>
</EventCard>
      <EventCard time="8:30 PM - 10:00 PM" title="Dinner Buffet 🍽️" />
    </DayLayout>
  );
}

export function Day3Section() {
  const afternoonAmenities = [
    { name: "🏊 Swimming Pool", detail: "8:00 AM - 8:00 PM" },
    { name: "🛶 Fishing & Kayaking", detail: "3:00 PM - 6:00 PM (Weather permitting)" },
    { name: "🎮 Indoor Activities", detail: "TT, Hand Soccer, Snooker & Board Games (8:00 AM - 10:00 PM)" },
    { name: "🏸 Outdoor Sports", detail: "Badminton, Football, Cricket, Basketball (8:00 AM - 6:00 PM)" },
  ];

  return (
    <DayLayout date="17th July" subtitle="Friday" indicatorColor="bg-emerald-600">
      <EventCard time="6:30 AM - 8:00 AM" title="Mini Hiking Trek 🥾" description="Assemble at the Lobby Area for a 1-Hour trek. Required: Full Pants and Proper Shoes.">
        <div className="text-xs bg-sky-50 border border-sky-200 text-sky-900 rounded-xl p-3 flex gap-2.5 font-medium shadow-sm">
          <i className="fa-solid fa-cloud-sun text-base text-sky-700 mt-0.5"></i>
          <p>Subject to favorable weather conditions.</p>
        </div>
      </EventCard>
      <EventCard time="8:00 AM - 9:30 AM" title="Refreshment and Breakfast 🍳" />
      <EventCard time="9:30 AM - 11:30 AM" title="Team Bonding Activities — Phase 1 🎯">
  <div className="text-xs bg-sky-50 border border-sky-200 text-sky-900 rounded-xl p-3 flex flex-col gap-2 font-medium shadow-sm">
    <div className="flex gap-2.5 items-center">
      <i className="fa-solid fa-shirt text-sm text-sky-700"></i>
      <p><strong>Dress Code:</strong> Please wear the Danfoss T-shirt provided for team outbound activities.</p>
    </div>
  </div>
</EventCard>
      <EventCard time="11:30 AM - 12:00 PM" title="High Tea with Cookies 🍪" badgeColor="bg-amber-50 border-amber-200 text-amber-900" />
      <EventCard time="12:00 PM - 1:30 PM" title="Team Bonding Activities — Phase 2 🏆" />
      <EventCard time="1:30 PM - 2:00 PM" title="Refreshment Break " badgeColor="bg-stone-100 border-stone-200 text-stone-600" />
      <EventCard time="2:00 PM - 3:00 PM" title="Lunch Buffet 🍱" />
      <EventCard time="3:00 PM - 4:30 PM" title="Leisure & Resort Track 🌿" description="Relax and explore the natural surroundings or use the standard amenities:" badgeColor="bg-purple-50 border-purple-200 text-purple-900">
        <div className="grid grid-cols-1 gap-1.5 mt-2 bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-[11px] shadow-inner">
          {afternoonAmenities.map((act, i) => (
            <div key={i} className="flex justify-between border-b border-stone-200/60 pb-1 last:border-0 last:pb-0">
              <span className="font-bold text-stone-700">{act.name}</span>
              <span className="text-stone-500 font-mono text-right">{act.detail}</span>
            </div>
          ))}
        </div>
      </EventCard>
      <EventCard time="4:30 PM - 5:00 PM" title="High Tea with Snacks ☕" />
      <EventCard time="5:00 PM - 5:30 PM" title="Quick Refreshment 🍹" badgeColor="bg-stone-100 border-stone-200 text-stone-600">
  <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 flex gap-2.5 font-medium shadow-sm">
    <i className="fa-solid fa-user-astronaut text-emerald-700 text-sm mt-0.5"></i>
    <p><strong>Cocktail Theme Dress Code:</strong> Please change into your Pistachio Green attire before the evening events begin!</p>
  </div>
</EventCard>
      <EventCard time="5:30 PM - 7:00 PM" title="Fun Games Cluster 🎲" />
      <EventCard time="7:00 PM - 10:00 PM" title="Cocktail Party 🍸" description="Evening celebration track running alongside the main dinner arrangements." badgeColor="bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900">
        <div className="mt-2.5 bg-stone-50 border border-stone-200 rounded-xl p-3 flex justify-between items-center text-xs shadow-sm">
          <span className="font-black text-stone-800 flex items-center gap-2">
            <i className="fa-solid fa-utensils text-fuchsia-700"></i>
            Gala Dinner Buffet
          </span>
          <span className="font-mono text-fuchsia-900 bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-200 text-[11px] font-bold">
            8:30 PM - 10:00 PM
          </span>
        </div>
      </EventCard>
    </DayLayout>
  );
}

export function Day4Section({ passengers, loading }) {
  const morningAmenities = [
    { name: "🏊 Swimming Pool", detail: "8:00 AM - 8:00 PM" },
    { name: "🎮 Indoor Activities", detail: "TT, Hand Soccer, Snooker & Board Games (8:00 AM - 10:00 PM)" },
    { name: "🏸 Outdoor Sports", detail: "Badminton, Football, Cricket, Basketball (8:00 AM - 6:00 PM)" },
  ];

  return (
    <DayLayout date="18th July" subtitle="Saturday" indicatorColor="bg-rose-600">
      <EventCard time="8:00 AM - 10:00 AM" title="Morning Breakfast Buffet 🥞" badgeColor="bg-rose-50 border-rose-200 text-rose-900" />
      <EventCard time="Till 12:00 PM" title="Final Leisure & Resort Amenities 🌿" description="Last window to use resort facilities before heading out:" badgeColor="bg-purple-50 border-purple-200 text-purple-900">
        <div className="grid grid-cols-1 gap-1.5 mt-2 bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-[11px] shadow-inner">
          {morningAmenities.map((act, i) => (
            <div key={i} className="flex justify-between border-b border-stone-200/60 pb-1 last:border-0 last:pb-0">
              <span className="font-bold text-stone-700">{act.name}</span>
              <span className="text-stone-500 font-mono text-right">{act.detail}</span>
            </div>
          ))}
        </div>
      </EventCard>
      <EventCard time="12:00 PM" title="Resort Checkout 🔑" description="Pack up your belongings, complete room handovers, and assemble at the main exit area." badgeColor="bg-rose-50 border-rose-200 text-rose-900" />
      <EventCard time="1:00 PM" title="Lunch at Misty Restaurant 🍽️" description="Group lunch gathering at the restaurant before the transit route begins." badgeColor="bg-rose-50 border-rose-200 text-rose-900" />
      <EventCard time="Afternoon Transit" title="Sightseeing on the way to Mysore Station 🗺️" description="Exploring localized sightseeing highlights and viewpoints along our return travel route." badgeColor="bg-sky-50 border-sky-200 text-sky-900" />
      <EventCard time="Transit Stop" title="Refreshment Point Stop ☕" description="A quick 10-minute break at Udupi Hotel." badgeColor="bg-stone-100 border-stone-200 text-stone-600" />
      <EventCard time="7:00 PM - 8:00 PM" title="Dinner at Mysore Railway Station 🍱" description="Pre-boarding dinner stop arranged at Adyar Ananda Bhavan (A2B)." badgeColor="bg-rose-50 border-rose-200 text-rose-900" />
      <EventCard time="8:45 PM" title="Return Train: Kaveri Express 🚂" description="Boarding window opens at Mysore Station. Keep your digital tickets ready." badgeColor="bg-rose-50 border-rose-200 text-rose-900">
        <TrainSeatDropdown passengers={passengers} loading={loading} />
      </EventCard>
    </DayLayout>
  );
}