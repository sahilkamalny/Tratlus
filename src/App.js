import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Coffee, Hotel, Car, Plus, ChevronRight, ChevronLeft, X, Utensils, ShoppingBag, Camera, Star, Train, Bike, CheckCircle2, Plane, Globe, Compass, Map } from 'lucide-react';

// Global drag state tracker
let currentDragData = { category: null, blockIndex: null };

// Activity categories with enhanced defaults
const ACTIVITY_CATEGORIES = [
  { 
    id: 'attraction', 
    name: 'Attraction', 
    icon: Camera, 
    color: 'bg-blue-500',
    defaultTitle: 'Visit Local Attraction',
    defaultDuration: 120
  },
  { 
    id: 'food', 
    name: 'Dining', 
    icon: Utensils, 
    color: 'bg-orange-500',
    defaultTitle: 'Meal Time',
    defaultDuration: 60
  },
  { 
    id: 'accommodation', 
    name: 'Hotel Check-in', 
    icon: Hotel, 
    color: 'bg-purple-500',
    defaultTitle: 'Hotel Check-in/Check-out',
    defaultDuration: 30
  },
  { 
    id: 'transport', 
    name: 'Transportation', 
    icon: Car, 
    color: 'bg-green-500',
    defaultTitle: 'Travel Between Locations',
    defaultDuration: 30
  },
  { 
    id: 'shopping', 
    name: 'Shopping', 
    icon: ShoppingBag, 
    color: 'bg-pink-500',
    defaultTitle: 'Shopping & Browsing',
    defaultDuration: 90
  },
];

const HOURS = Array.from({ length: 25 }, (_, i) => i);

// --- LANDING PAGE COMPONENT ---
const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white font-sans selection:bg-blue-500 selection:text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-blue-600/20 blur-[150px] animate-pulse duration-[10s]" />
            <div className="absolute top-[30%] -right-[20%] w-[70vw] h-[70vw] rounded-full bg-purple-600/10 blur-[150px] animate-pulse duration-[15s]" />
            <div className="absolute bottom-0 left-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[150px]" />
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-screen flex flex-col justify-center items-center text-center">
            {/* Floating Icons */}
            <div className="absolute top-1/4 left-[15%] bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-2xl animate-[bounce_6s_infinite]">
                <Map className="text-blue-400 w-8 h-8" />
            </div>
            <div className="absolute bottom-1/3 right-[15%] bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-2xl animate-[bounce_8s_infinite] delay-1000">
                <Compass className="text-purple-400 w-8 h-8" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-slate-300">The Future of Travel Logic</span>
            </div>

            {/* Main Title */}
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent drop-shadow-sm animate-in fade-in zoom-in-95 duration-1000">
                TRATLUS
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                Architect your perfect journey with our AAA-grade itinerary engine. 
                Drag, drop, and discover the world with precision.
            </p>

            {/* CTA Button */}
            <button 
                onClick={onStart}
                className="group relative px-10 py-5 bg-white text-slate-950 rounded-full font-black text-lg tracking-wide overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
            >
                <span className="relative z-10 flex items-center gap-2">
                    START PLANNING <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>

            {/* Feature Pills */}
            <div className="mt-16 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                {['Smart Drag & Drop', 'Real-time Logistics', 'Global Database', 'AI Powered'].map((feat, i) => (
                    <div key={i} className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm text-sm font-bold text-slate-400 hover:bg-white/10 hover:text-white transition-all hover:-translate-y-1">
                        {feat}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

// --- APP COMPONENTS ---

const ActivityBlock = ({ category, onDragStart }) => {
  const cat = ACTIVITY_CATEGORIES.find(c => c.id === category);
  const Icon = cat.icon;
  
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(e, category);
      }}
      className={`${cat.color} text-white p-4 rounded-2xl cursor-move hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-4 shadow-lg group ring-1 ring-white/20`}
    >
      <div className="bg-white/20 p-2.5 rounded-xl group-hover:bg-white/30 transition-all backdrop-blur-sm">
        <Icon size={22} />
      </div>
      <span className="font-bold tracking-wide text-sm">{cat.name}</span>
    </div>
  );
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

const CalendarView = ({ selectedDate, onDateSelect, activities }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };
  
  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  
  const previousMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const selectDate = (day) => onDateSelect(new Date(year, month, day));
  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };
  
  const hasActivities = (day) => {
    const dateKey = new Date(year, month, day).toDateString();
    return activities[dateKey] && activities[dateKey].length > 0;
  };
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 border border-white/40 relative overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
      
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight pb-2 leading-normal">Travel Dates</h2>
            <p className="text-slate-500 font-medium text-sm">Pick a day to plan your adventure</p>
        </div>
        <div className="flex items-center gap-4 bg-white/60 p-1.5 rounded-2xl shadow-sm border border-white/50 backdrop-blur-md">
            <button onClick={previousMonth} className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 hover:text-blue-600 hover:shadow-md active:scale-90">
            <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-bold text-slate-700 min-w-[140px] text-center">
            {monthNames[month]} {year}
            </h3>
            <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 hover:text-blue-600 hover:shadow-md active:scale-90">
            <ChevronRight size={20} />
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-3 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        {[...Array(startingDayOfWeek)].map((_, i) => <div key={`empty-${i}`} className="w-full" />)}
        
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const today = isToday(day);
          const hasAct = hasActivities(day);
          const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

          return (
            <button
              key={day}
              onClick={() => selectDate(day)}
              className={`
                w-full h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group
                ${isSelected 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl scale-105 z-10 ring-4 ring-blue-100' 
                    : today 
                        ? 'bg-white border-2 border-blue-200 text-blue-600 font-bold shadow-md'
                        : 'bg-white/40 hover:bg-white text-slate-600 hover:shadow-lg hover:scale-105 border border-transparent hover:border-white/60'
                }
              `}
            >
              <span className={`text-sm ${isSelected ? 'font-bold' : 'font-semibold'}`}>{day}</span>
              {hasAct && (
                <div className="flex gap-1 absolute bottom-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-green-500/70'}`} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DayView = ({ date, blocks, onDrop, onDeleteBlock, onEditBlock, onBackToCalendar, onUpdateBlock }) => {
  const timelineRef = useRef(null);
  const [draggingBlock, setDraggingBlock] = useState(null);
  const [ghostPreview, setGhostPreview] = useState(null);

  const COMPACT_PIXELS_PER_HOUR = 40;
  const SNAP_MINUTES = 30;
  const MAX_MINUTES_IN_DAY = 1440;
  const VERTICAL_CLEARANCE = 10;

  const isInteracting = draggingBlock !== null || ghostPreview !== null;

  const isConflicting = (startTime, duration, excludeIndex = null) => {
    const proposedEnd = startTime + duration;
    return blocks.some((block, idx) => {
      if (excludeIndex !== null && idx === parseInt(excludeIndex)) return false;
      const blockStart = block.startTime;
      const blockEnd = blockStart + block.duration;
      return startTime < blockEnd && proposedEnd > blockStart;
    });
  };

  const handleTimelineDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    const category = currentDragData.category;
    const blockIndex = currentDragData.blockIndex;

    if (!category && blockIndex === null) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top - VERTICAL_CLEARANCE;
    const minutes = Math.round((y / COMPACT_PIXELS_PER_HOUR) * 60 / SNAP_MINUTES) * SNAP_MINUTES;
      
    if (category && blockIndex === null) {
      const cat = ACTIVITY_CATEGORIES.find(c => c.id === category);
      const proposedStartTime = Math.max(0, Math.min(minutes, MAX_MINUTES_IN_DAY - cat.defaultDuration));
      setGhostPreview({ category, startTime: proposedStartTime, duration: cat.defaultDuration, isValid: !isConflicting(proposedStartTime, cat.defaultDuration) });
    } else if (blockIndex !== null) {
      const block = blocks[parseInt(blockIndex)];
      const proposedStartTime = Math.max(0, Math.min(minutes, MAX_MINUTES_IN_DAY - block.duration));
      setGhostPreview({ category: block.category, startTime: proposedStartTime, duration: block.duration, isValid: !isConflicting(proposedStartTime, block.duration, parseInt(blockIndex)) });
    }
  };

  const handleTimelineDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const category = currentDragData.category;
    const blockIndex = currentDragData.blockIndex;
    
    if (!ghostPreview || ghostPreview.isValid === false) { handleDragEnd(); return; }
    
    if (category && blockIndex === null) {
      const cat = ACTIVITY_CATEGORIES.find(c => c.id === category);
      onDrop({ category, title: cat.defaultTitle, location: '', duration: ghostPreview.duration, notes: '', startTime: ghostPreview.startTime }, date);
    } else if (blockIndex !== null) {
      const block = blocks[parseInt(blockIndex)];
      onUpdateBlock(date, parseInt(blockIndex), { ...block, startTime: ghostPreview.startTime, duration: ghostPreview.duration });
    }
    handleDragEnd();
  };

  const handleDragEnd = () => { setGhostPreview(null); setDraggingBlock(null); currentDragData = { category: null, blockIndex: null }; };
  const handleBlockDragStart = (e, index) => { e.dataTransfer.setData('blockIndex', index.toString()); e.dataTransfer.effectAllowed = 'move'; currentDragData = { category: null, blockIndex: index }; setTimeout(() => setDraggingBlock(index), 0); };
  const handleDragLeave = (e) => { if (e.currentTarget.contains(e.relatedTarget)) return; setGhostPreview(null); };
  
  const handleResize = (e, index, direction) => {
    e.preventDefault();
    const startY = e.clientY;
    const block = blocks[index];
    const startDuration = block.duration;
    const startTime = block.startTime;

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaMinutes = Math.round((deltaY / COMPACT_PIXELS_PER_HOUR) * 60 / SNAP_MINUTES) * SNAP_MINUTES;
      if (direction === 'bottom') {
        const newDuration = Math.max(SNAP_MINUTES, Math.min(startDuration + deltaMinutes, MAX_MINUTES_IN_DAY - startTime));
        onUpdateBlock(date, index, { ...block, duration: newDuration });
      } else if (direction === 'top') {
        const newStartTime = Math.max(0, Math.min(startTime + deltaMinutes, startTime + startDuration - SNAP_MINUTES));
        const newDuration = startDuration + (startTime - newStartTime);
        onUpdateBlock(date, index, { ...block, startTime: newStartTime, duration: newDuration });
      }
    };
    const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
    document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
  };
  
  const CompactTimelineBlock = ({ block, index }) => {
    const cat = ACTIVITY_CATEGORIES.find(c => c.id === block.category);
    const Icon = cat.icon;
    const height = (block.duration / 60) * COMPACT_PIXELS_PER_HOUR;
    const top = (block.startTime / 60) * COMPACT_PIXELS_PER_HOUR + VERTICAL_CLEARANCE; 
    const isBeingDragged = draggingBlock === index;
    
    return (
      <div
        draggable
        onDragStart={(e) => handleBlockDragStart(e, index)}
        style={{ height: `${height - 2}px`, top: `${top + 1}px` }} 
        className={`
          ${cat.color} text-white rounded-xl px-2 shadow-lg transition-all 
          absolute left-1 right-1 group flex flex-col justify-center overflow-hidden
          ring-1 ring-white/20 backdrop-blur-sm
          ${isInteracting ? 'pointer-events-none' : 'cursor-move hover:scale-[1.01] hover:ring-2 hover:ring-white/50 hover:shadow-xl hover:z-10'}
          ${isBeingDragged ? 'opacity-40 scale-95' : 'opacity-100'}
        `}
        onClick={() => onEditBlock(date, index)}
      >
        <div onMouseDown={(e) => { e.stopPropagation(); if (!isInteracting) handleResize(e, index, 'top'); }} className={`absolute top-0 left-0 right-0 h-2 cursor-ns-resize z-20 ${isInteracting ? 'hidden' : ''}`} />
        <div className="flex items-center justify-between relative z-0 w-full px-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="bg-black/10 p-1 rounded-lg flex-shrink-0 backdrop-blur-md"><Icon size={12} className="text-white" /></div>
            <div className="flex-1 min-w-0 flex justify-between items-center pr-1">
              <div className="font-bold text-xs truncate leading-tight drop-shadow-md">{block.title || cat.defaultTitle}</div>
              <div className="text-[10px] opacity-90 whitespace-nowrap font-semibold flex-shrink-0 ml-2 tracking-tight bg-black/10 px-1.5 py-0.5 rounded-md">
                {formatTime(block.startTime)} - {formatTime(block.startTime + block.duration)}
              </div>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onDeleteBlock(date, index); }} className={`opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/20 hover:bg-red-500 text-white rounded-md p-1 flex-shrink-0 ml-1 backdrop-blur-md hover:shadow-md hover:scale-110 ${isInteracting ? 'hidden' : ''}`}><X size={12} /></button>
        </div>
        {height > 45 && block.location && <div className="text-[10px] opacity-95 flex items-center gap-1 mt-1 truncate pl-8 font-medium text-blue-50"><MapPin size={9} />{block.location}</div>}
        <div onMouseDown={(e) => { e.stopPropagation(); if (!isInteracting) handleResize(e, index, 'bottom'); }} className={`absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize z-20 ${isInteracting ? 'hidden' : ''}`} />
      </div>
    );
  };
  
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-6 border border-white/40 flex flex-col h-[800px] relative overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
      {/* Gradient inside rounded container */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
      
      <div className="flex items-center justify-between mb-6 z-10 pt-4">
        <div>
          <button onClick={onBackToCalendar} className="text-xs font-extrabold text-slate-500 hover:text-blue-600 mb-1 flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-wider"><ChevronLeft size={14} />Back to Calendar</button>
          <h3 className="font-black text-3xl text-slate-800 tracking-tight pb-1 bg-clip-text">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
        </div>
        <div className="text-right bg-white/60 px-5 py-2.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Activities</div>
          <div className="text-2xl font-black text-slate-700 leading-none">{blocks.length}</div>
        </div>
      </div>
      
      {/* Dark Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .dark-scrollbar::-webkit-scrollbar { width: 8px; }
        .dark-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .dark-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .dark-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />

      {/* Main Timeline Container: Rounded, contains dark grid and dark labels */}
      <div className="flex-1 overflow-y-auto relative dark-scrollbar rounded-3xl border border-slate-700 bg-slate-900 shadow-inner">
        <div className="flex min-h-full relative" style={{ height: `${(24 * COMPACT_PIXELS_PER_HOUR) + (2 * VERTICAL_CLEARANCE)}px` }}>
            
            {/* Dark Time Column */}
            <div className="w-16 flex-shrink-0 relative border-r border-slate-700 bg-slate-900 z-10">
                {HOURS.map(hour => (<div key={hour} style={{ top: `${(hour * COMPACT_PIXELS_PER_HOUR) + VERTICAL_CLEARANCE}px` }} className="absolute right-0 w-full text-right pr-3"><span className="text-[10px] font-bold text-slate-500 block -translate-y-1/2">{hour === 0 || hour === 24 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}</span></div>))}
            </div>

            {/* Dark Grid Area */}
            <div className="flex-1 relative bg-slate-900">
                <div ref={timelineRef} onDrop={handleTimelineDrop} onDragOver={handleTimelineDragOver} onDragLeave={handleDragLeave} onDragEnd={handleDragEnd} className="absolute inset-0">
                    {/* Dark Grid Lines */}
                    {HOURS.map(hour => (<div key={`h-${hour}`} style={{ top: `${(hour * COMPACT_PIXELS_PER_HOUR) + VERTICAL_CLEARANCE}px` }} className="absolute left-0 right-0 border-t border-slate-700/50 w-full" />))}
                    {HOURS.filter(h => h < 24).map(hour => (<div key={`m-${hour}`} style={{ top: `${(hour * COMPACT_PIXELS_PER_HOUR) + (COMPACT_PIXELS_PER_HOUR / 2) + VERTICAL_CLEARANCE}px` }} className="absolute left-0 right-0 border-t border-slate-800/50 border-dashed" />))}
                    
                    {ghostPreview && (() => {
                      const cat = ACTIVITY_CATEGORIES.find(c => c.id === ghostPreview.category);
                      return (<div style={{ height: `${(ghostPreview.duration / 60) * COMPACT_PIXELS_PER_HOUR}px`, top: `${(ghostPreview.startTime / 60) * COMPACT_PIXELS_PER_HOUR + VERTICAL_CLEARANCE}px` }} className={`${ghostPreview.isValid ? cat.color : 'bg-red-500'} absolute left-1 right-1 rounded-xl z-50 flex items-center justify-center opacity-70 ring-2 ring-white border-2 border-dashed border-white/60 pointer-events-none`}> <cat.icon size={24} className="text-white animate-pulse" /></div>);
                    })()}
                    
                    {blocks.length === 0 && !ghostPreview ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                            <div className="bg-slate-800 p-8 rounded-full mb-4 shadow-sm backdrop-blur-md animate-pulse"><Plus size={40} className="opacity-40 text-slate-400" /></div>
                            <p className="text-sm font-bold uppercase tracking-wider opacity-60 text-slate-500">Drop activities here</p>
                        </div>
                    ) : (
                        blocks.map((block, idx) => <CompactTimelineBlock key={idx} block={block} index={idx} />)
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ActivityModal = ({ block, onSave, onClose }) => {
  const [formData, setFormData] = useState(block || { title: '', location: '', duration: 60, notes: '', category: 'attraction', startTime: 540 });
  const roundToHalfHour = (num, min = 0) => Math.max(min, Math.ceil(num / 30) * 30);
  const handleBlur = (field) => { if (field === 'duration') setFormData(prev => ({ ...prev, duration: roundToHalfHour(prev.duration, 30) })); else if (field === 'startTime') setFormData(prev => ({ ...prev, startTime: roundToHalfHour(prev.startTime, 0) % 1440 })); };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-8 border border-white/20 scale-100 transition-all ring-1 ring-black/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="flex items-center justify-between mb-8 pt-2"><div><h2 className="text-2xl font-black text-slate-800 tracking-tight">Edit Activity</h2><p className="text-slate-500 font-medium text-sm">Customize your itinerary details</p></div><button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all"><X size={24} /></button></div>
        <div className="space-y-6">
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Activity Name</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700 placeholder-slate-400 shadow-sm" placeholder="e.g., Visit Eiffel Tower" /></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Location</label><div className="relative"><MapPin className="absolute left-4 top-4 text-slate-400" size={20} /><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full pl-12 pr-5 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm" placeholder="e.g., Paris, France" /></div></div>
          <div className="grid grid-cols-2 gap-5">
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Start Time</label><input type="time" value={`${Math.floor(formData.startTime / 60).toString().padStart(2, '0')}:${(formData.startTime % 60).toString().padStart(2, '0')}`} onChange={(e) => { const [h, m] = e.target.value.split(':').map(Number); setFormData({ ...formData, startTime: h * 60 + m }); }} onBlur={() => handleBlur('startTime')} className="w-full px-5 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm" /></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Duration (min)</label><input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} onBlur={() => handleBlur('duration')} className="w-full px-5 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-bold text-slate-700 shadow-sm" min="30" step="30" /></div>
          </div>
          <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-700 shadow-sm resize-none" rows="3" placeholder="Add any special notes..." /></div>
        </div>
        <div className="flex gap-4 mt-10"><button onClick={onClose} className="flex-1 px-6 py-4 border-2 border-slate-100 text-slate-600 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-sm uppercase tracking-wide">Cancel</button><button onClick={() => onSave(formData)} className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all font-bold text-sm uppercase tracking-wide">Save Changes</button></div>
      </div>
    </div>
  );
};

const FoodPreferencesScreen = ({ onBack, onNext, preferences, setPreferences }) => {
  const cuisineTypes = ['Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 'Thai', 'French', 'Mediterranean', 'American', 'Korean', 'Vietnamese', 'Greek', 'African'];
  const dietaryRestrictions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'];

  const toggleCuisine = (c) => setPreferences(p => ({ ...p, cuisines: p.cuisines.includes(c) ? p.cuisines.filter(x => x !== c) : [...p.cuisines, c] }));
  const toggleDietary = (d) => setPreferences(p => ({ ...p, dietary: p.dietary.includes(d) ? p.dietary.filter(x => x !== d) : [...p.dietary, d] }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400" />
        
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-orange-600 font-bold mb-6 flex items-center gap-2 hover:-translate-x-1 transition-all bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm pt-4">
          <ChevronLeft size={16} /> Back to Itinerary
        </button>

        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3 drop-shadow-sm pt-2 pb-3 leading-normal">Culinary Preferences</h2>
          <p className="text-slate-600 font-medium text-lg">Curate your perfect dining experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          {/* Interactive Circles */}
          <div className="lg:col-span-7 relative bg-white/30 rounded-[2rem] p-8 border border-white/40 shadow-inner">
             <div className="flex flex-col lg:flex-row justify-around items-start gap-8 mt-4">
                
                {/* CUISINE WHEEL (Larger Radius, No Overlap) */}
                <div className="text-center w-full">
                    <h3 className="font-black text-slate-700 mb-6 flex items-center justify-center gap-2"><Utensils size={20} className="text-orange-500"/> Favorite Cuisines</h3>
                    {/* Increased container size to 500px to fit 170px radius cleanly */}
                    <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                        {cuisineTypes.map((cuisine, index) => {
                            const angle = (index / cuisineTypes.length) * 2 * Math.PI - Math.PI / 2;
                            // Increased radius to 170 to give 16px buttons plenty of space
                            const radius = 170; 
                            // Calculate position as percentage
                            // 50% + (radius / total_width * 100) * cos/sin
                            // Using approx scale factor: 170px is ~34% of 500px width
                            const xPct = 50 + 34 * Math.cos(angle);
                            const yPct = 50 + 34 * Math.sin(angle);

                            const cuisineColors = {
                                'Italian': 'from-red-500 to-green-500', 'Chinese': 'from-red-600 to-yellow-500', 'Japanese': 'from-pink-400 to-red-500', 'Mexican': 'from-green-600 to-red-600',
                                'Indian': 'from-orange-500 to-red-600', 'Thai': 'from-green-500 to-yellow-500', 'French': 'from-blue-500 to-red-400', 'Mediterranean': 'from-blue-400 to-yellow-400',
                                'American': 'from-red-500 to-blue-600', 'Korean': 'from-red-500 to-orange-500', 'Vietnamese': 'from-yellow-500 to-green-500', 'Greek': 'from-blue-500 to-white',
                                'African': 'from-orange-600 to-yellow-500'
                            };
                            return (
                                <button key={cuisine} onClick={() => toggleCuisine(cuisine)} style={{ left: `calc(${xPct}% - 2rem)`, top: `calc(${yPct}% - 2rem)` }}
                                  className={`absolute w-16 h-16 rounded-full font-medium text-[10px] transition-all hover:scale-110 hover:shadow-xl active:scale-95 cursor-pointer text-white flex items-center justify-center leading-tight ${preferences.cuisines.includes(cuisine) ? `bg-gradient-to-br ${cuisineColors[cuisine]} shadow-lg z-10` : `bg-gradient-to-br ${cuisineColors[cuisine]} opacity-40 shadow-md hover:opacity-70`}`}>
                                  {cuisine}
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                {/* DIETARY WHEEL (Original Sizes Restored: 24 center, 16 outer) */}
                <div className="text-center w-full">
                    <h3 className="font-black text-slate-700 mb-6 flex items-center justify-center gap-2"><Coffee size={20} className="text-green-500"/> Dietary Restrictions</h3>
                    <div className="relative w-full aspect-square max-w-[380px] mx-auto">
                         {dietaryRestrictions.map((dietary, index) => {
                            let xPct, yPct;
                            if (index === 0) { xPct = 50; yPct = 50; } else {
                                const angle = ((index - 1) / (dietaryRestrictions.length - 1)) * 2 * Math.PI - Math.PI / 2;
                                xPct = 50 + 34 * Math.cos(angle); 
                                yPct = 50 + 34 * Math.sin(angle);
                            }
                            const dietaryColors = {
                                'Vegetarian': 'from-green-500 to-lime-500', 'Vegan': 'from-green-600 to-emerald-600', 'Halal': 'from-teal-500 to-cyan-500',
                                'Kosher': 'from-blue-500 to-indigo-500', 'Gluten-Free': 'from-yellow-500 to-amber-500', 'Dairy-Free': 'from-sky-400 to-blue-400', 'Nut-Free': 'from-orange-400 to-red-400'
                            };
                            return (
                                <button key={dietary} onClick={() => toggleDietary(dietary)} style={{ left: `calc(${xPct}% - ${index === 0 ? '3rem' : '2rem'})`, top: `calc(${yPct}% - ${index === 0 ? '3rem' : '2rem'})` }}
                                  className={`absolute rounded-full font-medium text-xs transition-all hover:scale-110 hover:shadow-xl active:scale-95 cursor-pointer text-white ${preferences.dietary.includes(dietary) ? `bg-gradient-to-br ${dietaryColors[dietary]} shadow-lg z-10` : `bg-gradient-to-br ${dietaryColors[dietary]} opacity-40 shadow-md hover:opacity-70`} ${index === 0 ? 'w-24 h-24 z-20' : 'w-16 h-16'}`}>
                                  {dietary}
                                </button>
                            );
                        })}
                    </div>
                </div>
             </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/50 p-6 rounded-3xl shadow-sm border border-white/60 hover:shadow-md transition-all">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Food Allergies</label>
                <input type="text" value={preferences.allergies} onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value })} className="w-full px-5 py-4 bg-white border-0 ring-1 ring-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all font-bold text-slate-700 placeholder-slate-300" placeholder="e.g., Peanuts, Shellfish..." />
            </div>

            <div className="bg-white/50 p-6 rounded-3xl shadow-sm border border-white/60 hover:shadow-md transition-all">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Price Range</label>
                <div className="flex gap-3">
                    {[1, 2, 3, 4].map(l => (
                        <button key={l} onClick={() => setPreferences({ ...preferences, priceRange: [1, l] })} className={`flex-1 h-12 rounded-xl font-black text-lg transition-all duration-200 flex items-center justify-center ${l <= preferences.priceRange[1] ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg scale-105 ring-2 ring-orange-200' : 'bg-white text-slate-300 hover:bg-slate-50'}`}>{'$'.repeat(l)}</button>
                    ))}
                </div>
            </div>

            <div className="bg-white/50 p-6 rounded-3xl shadow-sm border border-white/60 hover:shadow-md transition-all">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex justify-between"><span>Max Distance</span> <span className="text-orange-600">{preferences.maxDistance} min</span></label>
                <input type="range" min="5" max="60" step="5" value={preferences.maxDistance} onChange={(e) => setPreferences({ ...preferences, maxDistance: parseInt(e.target.value) })} className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600" />
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          <button onClick={onBack} className="px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm uppercase tracking-wide">Back</button>
          <button onClick={onNext} className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-95 transition-all font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2">Find Places to Stay <ChevronRight size={18} /></button>
        </div>
      </div>
    </div>
  );
};

const AccommodationScreen = ({ onBack, onNext, preferences, setPreferences }) => {
  const types = [
    { id: 'hotel', name: 'Hotel', icon: Hotel }, { id: 'hostel', name: 'Hostel', icon: Coffee },
    { id: 'airbnb', name: 'Airbnb', icon: Hotel }, { id: 'resort', name: 'Resort', icon: Star },
    { id: 'vacation', name: 'Rental', icon: Hotel }
  ];
  const amenities = ['WiFi', 'Parking', 'Pool', 'Gym', 'Breakfast', 'AC', 'Kitchen', 'Laundry'];

  const toggleType = (t) => setPreferences(p => ({ ...p, types: p.types.includes(t) ? p.types.filter(x => x !== t) : [...p.types, t] }));
  const toggleAmenity = (a) => setPreferences(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a] }));

  const getPercent = (val, min, max) => ((val - min) / (max - min)) * 100;

  return (
    <div className="max-w-6xl mx-auto">
        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400" />
            
            <button onClick={onBack} className="text-sm text-slate-500 hover:text-purple-600 font-bold mb-6 flex items-center gap-2 hover:-translate-x-1 transition-all bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm pt-4">
                <ChevronLeft size={16} /> Back to Food
            </button>

            <div className="mb-10 text-center">
                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pt-2 pb-3 leading-normal">Where to Stay?</h2>
                <p className="text-slate-600 font-medium text-lg">Find your home away from home</p>
            </div>

            <div className="space-y-8 mb-10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {types.map(t => {
                        const Icon = t.icon;
                        const isSel = preferences.types.includes(t.id);
                        return (
                            <button key={t.id} onClick={() => toggleType(t.id)} className={`h-32 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 group ${isSel ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xl scale-105 ring-4 ring-purple-100' : 'bg-white/60 hover:bg-white text-slate-600 hover:shadow-lg hover:-translate-y-1'}`}>
                                <div className={`p-3 rounded-2xl ${isSel ? 'bg-white/20' : 'bg-purple-50 group-hover:bg-purple-100'} transition-colors`}><Icon size={28} /></div>
                                <span className="font-bold text-sm">{t.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/50 p-8 rounded-[2rem] shadow-sm border border-white/60">
                         <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-6">Star Rating</label>
                         <div className="flex justify-between items-center gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onClick={() => setPreferences({...preferences, minStars: s})} className={`flex-1 aspect-square rounded-2xl flex items-center justify-center font-black text-lg transition-all ${preferences.minStars <= s ? 'bg-yellow-400 text-white shadow-lg scale-110 rotate-3' : 'bg-white text-slate-300 hover:bg-slate-50'}`}>
                                    {s}<span className="text-[10px] ml-0.5 align-top">★</span>
                                </button>
                            ))}
                         </div>
                    </div>

                    <div className="bg-white/50 p-8 rounded-[2rem] shadow-sm border border-white/60 flex flex-col justify-center">
                        <div className="flex justify-between mb-6">
                             <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Price Range / Night</label>
                             <span className="font-black text-slate-700 text-lg">${preferences.minPrice} - ${preferences.maxPrice}</span>
                        </div>
                        <div className="relative h-12 bg-white rounded-2xl p-2 shadow-inner flex items-center">
                             <input type="range" min="50" max="1000" value={preferences.maxPrice} onChange={(e) => setPreferences({...preferences, maxPrice: parseInt(e.target.value)})} className="w-full h-full opacity-0 absolute z-10 cursor-pointer" />
                             <div className="h-2 bg-slate-100 w-full rounded-full overflow-hidden relative">
                                <div style={{ width: `${getPercent(preferences.maxPrice, 50, 1000)}%` }} className="h-full bg-gradient-to-r from-purple-500 to-pink-500 absolute top-0 left-0" />
                             </div>
                             <div style={{ left: `calc(${getPercent(preferences.maxPrice, 50, 1000)}% - 1rem)` }} className="absolute w-8 h-8 bg-white rounded-full shadow-md border-2 border-purple-500 pointer-events-none transition-all" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/30 p-8 rounded-[2rem] border border-white/40">
                     <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2"><Plus size={14}/> Must-Haves</label>
                     <div className="flex flex-wrap gap-3">
                        {amenities.map(a => {
                            const isSel = preferences.amenities.includes(a);
                            return (
                                <button key={a} onClick={() => toggleAmenity(a)} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isSel ? 'bg-slate-800 text-white shadow-lg scale-105' : 'bg-white text-slate-500 hover:bg-slate-100 shadow-sm hover:shadow'}`}>
                                    {a}
                                </button>
                            );
                        })}
                     </div>
                </div>
            </div>

            <div className="flex gap-5">
                <button onClick={onBack} className="px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm uppercase tracking-wide">Back</button>
                <button onClick={onNext} className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.01] active:scale-95 transition-all font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2">Transport Options <ChevronRight size={18} /></button>
            </div>
        </div>
    </div>
  );
};

const TransportationScreen = ({ onBack, onNext, preferences, setPreferences }) => {
  const modes = [
    { id: 'rideshare', name: 'Rideshare', icon: Car, desc: 'Uber/Lyft' },
    { id: 'public', name: 'Transit', icon: Train, desc: 'Bus/Metro' },
    { id: 'rental', name: 'Rental', icon: KeyIcon, desc: 'Self-drive' },
    { id: 'flight', name: 'Flight', icon: Plane, desc: 'Inter-city' },
    { id: 'bike', name: 'Bike', icon: Bike, desc: 'Eco-friendly' },
    { id: 'walk', name: 'Walk', icon: MapPin, desc: 'Scenic' },
  ];
  function KeyIcon(props) { return <div {...props} className="border-2 border-current rounded w-5 h-3" /> }
  const toggleMode = (m) => setPreferences(p => ({ ...p, modes: p.modes.includes(m) ? p.modes.filter(x => x !== m) : [...p.modes, m] }));

  return (
    <div className="max-w-6xl mx-auto">
        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/40 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400" />
             
             <button onClick={onBack} className="text-sm text-slate-500 hover:text-teal-600 font-bold mb-6 flex items-center gap-2 hover:-translate-x-1 transition-all bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm pt-4">
                <ChevronLeft size={16} /> Back to Accommodation
            </button>

            <div className="mb-10">
                <h2 className="text-4xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3 pt-2 pb-3 leading-normal">Getting Around</h2>
                <p className="text-slate-600 font-medium text-lg">Select your preferred wheels (or wings)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {modes.map(m => {
                        const Icon = m.icon;
                        const isSel = preferences.modes.includes(m.id);
                        return (
                            <button key={m.id} onClick={() => toggleMode(m.id)} className={`p-6 rounded-3xl transition-all duration-300 text-left relative overflow-hidden group ${isSel ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xl scale-[1.02]' : 'bg-white/70 hover:bg-white text-slate-600 hover:shadow-lg'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${isSel ? 'bg-white/20' : 'bg-teal-50 group-hover:bg-teal-100'} transition-colors`}><Icon size={24} /></div>
                                    {isSel && <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 size={16} /></div>}
                                </div>
                                <div className="font-bold text-lg">{m.name}</div>
                                <div className={`text-xs font-medium mt-1 ${isSel ? 'text-teal-100' : 'text-slate-400'}`}>{m.desc}</div>
                            </button>
                        );
                    })}
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white/50 p-6 rounded-[2rem] shadow-sm border border-white/60">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">Priority</label>
                        <div className="flex flex-col gap-2">
                            {['Speed', 'Cost', 'Comfort'].map(p => {
                                const isSel = preferences.priority === p.toLowerCase();
                                return (
                                    <button key={p} onClick={() => setPreferences({...preferences, priority: p.toLowerCase()})} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-between px-6 ${isSel ? 'bg-slate-800 text-white shadow-lg scale-105' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                        {p}
                                        {isSel && <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 rounded-[2rem] shadow-lg text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-teal-100 mb-2">Daily Budget</label>
                        <div className="text-5xl font-black mb-4 tracking-tighter">${preferences.budget}</div>
                        <input type="range" min="10" max="200" step="10" value={preferences.budget} onChange={(e) => setPreferences({...preferences, budget: parseInt(e.target.value)})} className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-teal-100" />
                    </div>
                </div>
            </div>

            <div className="flex gap-5">
                <button onClick={onBack} className="px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm uppercase tracking-wide">Back</button>
                <button onClick={onNext} className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl hover:shadow-xl hover:shadow-teal-500/30 hover:scale-[1.01] active:scale-95 transition-all font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2">Review Trip <ChevronRight size={18} /></button>
            </div>
        </div>
    </div>
  );
};

const ReviewScreen = ({ onBack, activities, foodPrefs, accommPrefs, transportPrefs }) => {
  const totalDays = Object.keys(activities).length;
  const totalActivities = Object.values(activities).reduce((sum, day) => sum + day.length, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-slate-900 text-white rounded-[3rem] shadow-2xl overflow-hidden relative min-h-[600px]">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
         <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
         <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-20 animate-pulse delay-1000" />

         <div className="p-12 relative z-10 pt-16">
            <button onClick={onBack} className="text-sm text-slate-400 hover:text-white font-bold mb-8 flex items-center gap-2 transition-all w-fit px-4 py-2 rounded-full bg-white/5 hover:bg-white/10">
                <ChevronLeft size={16} /> Edit Details
            </button>

            <div className="text-center mb-16">
                <h2 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl tracking-tighter pb-3 leading-tight">Ready for Takeoff?</h2>
                <p className="text-slate-400 text-xl max-w-lg mx-auto">Your personalized itinerary is generated below.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/15 transition-all hover:-translate-y-1">
                    <div className="text-5xl font-black mb-2 text-blue-400">{totalDays}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Days</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/15 transition-all hover:-translate-y-1">
                    <div className="text-5xl font-black mb-2 text-purple-400">{totalActivities}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Activities</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center hover:bg-white/15 transition-all hover:-translate-y-1">
                    <div className="text-5xl font-black mb-2 text-pink-400">${transportPrefs.budget + accommPrefs.maxPrice}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Est. Daily Cost</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="font-bold text-xl text-white flex items-center gap-3"><Utensils className="text-orange-400"/> Dining Profile</h3>
                    <div className="flex flex-wrap gap-2">
                        {foodPrefs.cuisines.map(c => <span key={c} className="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-300 text-xs font-bold">{c}</span>)}
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                        <span className="text-slate-500 text-sm font-medium">Price Range</span>
                        <span className="text-orange-400 font-black text-xl">{'$'.repeat(foodPrefs.priceRange[1])}</span>
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 space-y-6">
                    <h3 className="font-bold text-xl text-white flex items-center gap-3"><Hotel className="text-purple-400"/> Stay & Travel</h3>
                    <div className="flex flex-wrap gap-2">
                        {accommPrefs.types.map(t => <span key={t} className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold">{t}</span>)}
                        {transportPrefs.modes.map(t => <span key={t} className="px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 text-xs font-bold">{t}</span>)}
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                        <span className="text-slate-500 text-sm font-medium">Comfort Level</span>
                        <span className="text-purple-400 font-black text-xl">{accommPrefs.minStars}+ Stars</span>
                    </div>
                </div>
            </div>

            <button className="w-full py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl font-black text-2xl text-white shadow-[0_20px_50px_-12px_rgba(124,58,237,0.5)] hover:shadow-[0_30px_60px_-12px_rgba(124,58,237,0.6)] hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-3">GENERATE ITINERARY <span className="text-3xl">✨</span></span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default function Tratlus() {
  const [showLanding, setShowLanding] = useState(true);
  const [activities, setActivities] = useState({});
  const [editingActivity, setEditingActivity] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([1]);
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [foodPreferences, setFoodPreferences] = useState({ cuisines: [], dietary: [], allergies: '', priceRange: [1, 3], minRating: 3.5, maxDistance: 15, mealsPerDay: 3 });
  const [accommodationPreferences, setAccommodationPreferences] = useState({ types: [], minStars: 3, maxStars: 5, minPrice: 50, maxPrice: 400, amenities: [], maxTravelTime: 20, rooms: 1 });
  const [transportationPreferences, setTransportationPreferences] = useState({ modes: [], priority: 'cost', budget: 50, accessibility: 'none' });

  const handleDragStart = (e, category) => { e.dataTransfer.setData('category', category); currentDragData = { category, blockIndex: null }; };
  const handleDrop = (newActivity, date) => {
    const dateKey = date.toDateString();
    setActivities(prev => ({ ...prev, [dateKey]: [...(prev[dateKey] || []), newActivity] }));
    setEditingActivity({ date: dateKey, index: (activities[dateKey] || []).length, block: newActivity });
  };
  const handleDeleteBlock = (date, index) => { const k = date.toDateString(); setActivities(p => ({ ...p, [k]: p[k].filter((_, i) => i !== index) })); };
  const handleEditBlock = (date, index) => { setEditingActivity({ date: date.toDateString(), index, block: activities[date.toDateString()][index] }); };
  const handleUpdateBlock = (date, index, updated) => { const k = date.toDateString(); setActivities(p => ({ ...p, [k]: p[k].map((b, i) => i === index ? updated : b) })); };
  const handleSaveActivity = (data) => {
    if (editingActivity) setActivities(p => ({ ...p, [editingActivity.date]: p[editingActivity.date].map((b, i) => i === editingActivity.index ? data : b) }));
    setEditingActivity(null);
  };
  
  const goToStep = (s) => { const max = Math.max(...completedSteps, 1); if (s <= max + 1 || s === 1) { setCurrentStep(s); if (!completedSteps.includes(s)) setCompletedSteps([...completedSteps, s]); } };
  const advanceStep = (n) => { if (!completedSteps.includes(n)) setCompletedSteps([...completedSteps, n]); setCurrentStep(n); };

  const hasActivities = Object.values(activities).some(dayActs => dayActs.length > 0);

  if (showLanding) {
    return <LandingPage onStart={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-fixed transition-colors duration-500" style={{ background: 'linear-gradient(to bottom, #ffffff, #7d9eff)' }}>
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-200/30 blur-[120px]" />
             <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-200/30 blur-[120px]" />
             <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-pink-200/30 blur-[120px]" />
        </div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => goToStep(1)}>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                <MapPin className="text-white" size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">Tratlus</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full border border-white/50">
              {['Itinerary', 'Food', 'Stay', 'Travel', 'Review'].map((step, i) => {
                const s = i + 1;
                const isC = currentStep === s;
                const isD = completedSteps.includes(s);
                return (
                  <button key={step} disabled={!isD && !isC} onClick={() => (isD || isC) && goToStep(s)} 
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${isC ? 'bg-white text-slate-800 shadow-md scale-105' : isD ? 'text-slate-500 hover:text-slate-800 hover:bg-white/50' : 'text-slate-300 cursor-not-allowed'}`}>
                    {step}
                  </button>
                );
              })}
            </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {currentStep === 1 && (
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-5xl font-black text-slate-800 mb-2 tracking-tight">Plan Your Journey</h2>
                    <p className="text-slate-500 font-medium text-lg">Drag and drop activities to craft your perfect day.</p>
                </div>
                
                <div className={`transition-all duration-500 ${hasActivities ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  <button onClick={() => advanceStep(2)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                    Next Step <ChevronRight size={18}/>
                  </button>
                </div>
            </div>

            <div className={`grid grid-cols-1 ${viewMode === 'day' ? 'lg:grid-cols-4' : ''} gap-8`}>
              {viewMode === 'day' && (
                <div className="lg:col-span-1 animate-in slide-in-from-left-8 duration-500 delay-100">
                  <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-xl p-6 sticky top-28 border border-white/60">
                    <h3 className="font-black text-slate-800 text-lg mb-6 flex items-center gap-2"><Plus className="text-blue-500" strokeWidth={3} /> Add Activities</h3>
                    <div className="space-y-3">
                      {ACTIVITY_CATEGORIES.map(cat => <ActivityBlock key={cat.id} category={cat.id} onDragStart={handleDragStart} />)}
                    </div>
                  </div>
                </div>
              )}

              <div className={`${viewMode === 'day' ? 'lg:col-span-3' : 'w-full'} transition-all duration-500`}>
                {viewMode === 'calendar' ? 
                  <CalendarView selectedDate={selectedDate} onDateSelect={(d) => { setSelectedDate(d); setViewMode('day'); }} activities={activities} /> : 
                  <DayView date={selectedDate} blocks={activities[selectedDate.toDateString()] || []} onDrop={handleDrop} onDeleteBlock={handleDeleteBlock} onEditBlock={handleEditBlock} onBackToCalendar={() => setViewMode('calendar')} onUpdateBlock={handleUpdateBlock} />
                }
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && <div className="animate-in zoom-in-95 fade-in duration-500"><FoodPreferencesScreen onBack={() => goToStep(1)} onNext={() => advanceStep(3)} preferences={foodPreferences} setPreferences={setFoodPreferences} /></div>}
        {currentStep === 3 && <div className="animate-in zoom-in-95 fade-in duration-500"><AccommodationScreen onBack={() => goToStep(2)} onNext={() => advanceStep(4)} preferences={accommodationPreferences} setPreferences={setAccommodationPreferences} /></div>}
        {currentStep === 4 && <div className="animate-in zoom-in-95 fade-in duration-500"><TransportationScreen onBack={() => goToStep(3)} onNext={() => advanceStep(5)} preferences={transportationPreferences} setPreferences={setTransportationPreferences} /></div>}
        {currentStep === 5 && <div className="animate-in zoom-in-95 fade-in duration-500"><ReviewScreen onBack={() => goToStep(4)} activities={activities} foodPrefs={foodPreferences} accommPrefs={accommodationPreferences} transportPrefs={transportationPreferences} /></div>}
      </main>

      {editingActivity && <ActivityModal block={editingActivity.block} onSave={handleSaveActivity} onClose={() => setEditingActivity(null)} />}
    </div>
  );
}