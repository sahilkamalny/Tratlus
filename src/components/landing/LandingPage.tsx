import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSound } from '@/contexts/SoundContext';
import { Map, Compass, ChevronRight, Volume2, VolumeX, Volume1, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SafeAreaWrapper from '@/components/ui/SafeAreaWrapper';
import logo from '/logo.svg';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isMuted, setIsMuted, volume, playSound } = useSound();
  const [isFlushing, setIsFlushing] = useState(false);

  const handleStartClick = () => {
    playSound('success');
    setIsFlushing(true);
    // Wait for animation (800ms) before changing screen
    setTimeout(() => {
        onStart();
    }, 800);
  };

  const handleThemeToggle = () => {
    playSound("click");
    toggleTheme();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const accentBorderClass = isDarkMode ? "border-white/20 text-white/80 bg-white/5" : "border-white/30 text-slate-700 bg-white/10";

  return (
    <SafeAreaWrapper fullHeight={true} includeTop={true} includeBottom={true}>
      <div className={`h-full relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white selection:bg-blue-500 selection:text-white' : 'bg-slate-50 text-slate-900 selection:bg-fuchsia-200 selection:text-fuchsia-900'}`}>
        
        {/* Header Controls */}
        <div className="absolute top-6 right-6 z-50">
            <nav className="flex items-center gap-2 md:gap-4">
                <button 
                    onClick={() => {
                        toggleTheme();
                        // Optional: play click sound
                    }}
                    className={`p-2 rounded-full transition-all active:scale-95 ${
                        isDarkMode 
                        ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                        : 'text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm'
                    }`}
                    aria-label="Toggle Theme"
                >
                    {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                
                <button 
                    onClick={handleMuteToggle}
                    className={`p-2 rounded-full transition-all active:scale-95 ${
                        isDarkMode 
                        ? 'text-slate-400 hover:text-white hover:bg-white/10' 
                        : 'text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm'
                    }`}
                    aria-label="Toggle Sound"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : volume < 0.35 ? <Volume1 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <button className="hidden md:block text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Login</button>
                <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-transform">
                    Get App
                </button>
            </nav>
        </div>

        {/* Background Gradients - TUNED INTENSITY */}
        <div className={`absolute inset-0 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-rose-200 via-sky-200 to-indigo-200'}`} style={{ zIndex: 0 }} />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
             {/* Same blobs, kept compatible */}
             <div className={`absolute -top-[20%] -left-[10%] w-[120vw] h-[120vw] sm:w-[80vw] sm:h-[80vw] sm:-top-40 sm:-left-16 rounded-full blur-[100px] sm:blur-[200px] ${
                isDarkMode 
                ? 'bg-fuchsia-500/45 sm:bg-fuchsia-500/26' 
                : 'bg-fuchsia-500/70 sm:bg-fuchsia-500/60 mix-blend-multiply' 
            }`} style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            
            <div className={`absolute top-[30%] -right-[20%] w-[110vw] h-[110vw] sm:w-[70vw] sm:h-[70vw] sm:-right-28 rounded-full blur-[100px] sm:blur-[200px] ${
                isDarkMode 
                ? 'bg-blue-500/41 sm:bg-blue-500/22' 
                : 'bg-blue-500/70 sm:bg-blue-500/60 mix-blend-multiply'
            }`} style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0.5s' }} />
            
            <div className={`absolute bottom-0 left-[20%] w-[100vw] h-[100vw] sm:w-[70vw] sm:h-[70vw] sm:bottom-[-10%] rounded-full blur-[100px] sm:blur-[200px] ${
                isDarkMode 
                ? 'bg-purple-500/41 sm:bg-purple-500/22' 
                : 'bg-indigo-500/70 sm:bg-indigo-500/60 mix-blend-multiply'
            }`} style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '1s' }} />
            
            {/* Grid Overlay */}
            <div className={`absolute inset-0 bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] ${isDarkMode ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]' : 'bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]'}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-center items-center text-center">
            {/* Floating Icons */}
            <div className={`absolute top-[15%] left-[5%] md:top-1/4 md:left-[15%] backdrop-blur-lg p-2 md:p-4 rounded-2xl border shadow-2xl animate-[bounce_6s_infinite] ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/40 shadow-xl'}`}>
                <Map className={`${isDarkMode ? 'text-fuchsia-500' : 'text-fuchsia-600'} w-6 h-6 md:w-8 md:h-8`} />
            </div>
            <div className={`absolute bottom-[20%] right-[5%] md:bottom-1/3 md:right-[15%] backdrop-blur-lg p-2 md:p-4 rounded-2xl border shadow-2xl animate-[bounce_8s_infinite] delay-1000 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/40 shadow-xl'}`}>
                <Compass className={`${isDarkMode ? 'text-blue-500' : 'text-blue-600'} w-6 h-6 md:w-8 md:h-8`} />
            </div>

            {/* LOGO PLACEMENT */}
            <div className="mb-6 md:mb-8 relative animate-in fade-in zoom-in duration-700">
                <div className={`absolute inset-0 blur-xl rounded-full ${isDarkMode ? 'bg-fuchsia-500 opacity-30' : 'bg-fuchsia-400 opacity-20'}`} />
                <img 
                  src={logo} 
                  alt="Tratlus Logo" 
                  className="relative w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl" 
                />
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md mb-6 md:mb-8 transition-colors cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700 ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/60 border-white/40 hover:bg-white/70 shadow-lg'}`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className={`text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>The Travel Atlas</span>
            </div>

            {/* Main Title */}
            <h1 className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 md:mb-6 bg-clip-text text-transparent drop-shadow-sm animate-in fade-in zoom-in-95 duration-1000 px-4 pb-4 ${isDarkMode ? 'bg-gradient-to-r from-fuchsia-500 to-blue-500' : 'bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-blue-600'}`}>
                TRATLUS
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl md:text-2xl max-w-xs sm:max-w-md md:max-w-2xl mb-8 md:mb-12 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Architect your perfect journey with our AI-powered itinerary engine. 
                Drag, drop, and discover the world with precision.
            </p>

            {/* CTA Button */}
            <button 
                onClick={handleStartClick}
                onMouseEnter={() => playSound('hover')}
                className={`group relative px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-base md:text-lg tracking-wide overflow-hidden transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20`}
            >
                <span className="relative z-10 flex items-center gap-2">
                    Start Swiping <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div 
                  className={`absolute inset-0 transition-transform duration-[800ms] ease-in-out origin-left ${isFlushing ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 group-active:opacity-100'} bg-white/20`} 
                />
            </button>

            {/* Feature Pills */}
            <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-2 md:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                {['Intuitive Itinerary', 'Dynamic Logistics', 'Vast Database', 'AI-Powered'].map((feat, i) => (
                    <div key={i} className={`px-4 py-2 md:px-6 md:py-3 rounded-xl backdrop-blur-sm text-xs sm:text-sm font-bold transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-white/40 border border-white/20 text-slate-600 hover:bg-white/60 hover:text-slate-900 shadow-sm'}`}>
                        {feat}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </SafeAreaWrapper>
  );
};
