import React from "react";
import { cn } from "@/lib/utils";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, 
  Sun, 
  VolumeX, 
  Volume1, 
  Volume2, 
  X,
  Heart,
  RotateCcw,
  Loader2,
  Sparkles,
  FastForward,
  Award,
  PartyPopper,
} from "lucide-react";

// Local type definitions
type CategoryName = "Locations" | "Food" | "Activities" | "Accommodations" | "Transportation" | "Vibes";

interface TravelCard {
  id: string;
  category: CategoryName;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

interface Category {
  name: CategoryName;
  icon: React.ReactNode;
  displayName: string;
}

interface SwipePageProps {
  // Theme
  isDarkMode: boolean;
  handleThemeToggle: () => void;
  
  // Sound
  isMuted: boolean;
  volume: number;
  handleMuteToggle: () => void;
  playSound: (sound: string) => void;
  
  // Page styles
  pageBgClass: string;
  subTextClass: string;
  
  // Card state
  cardStack: TravelCard[];
  currentCategoryIndex: number;
  setCurrentCategoryIndex: React.Dispatch<React.SetStateAction<number>>;
  currentCategory: Category;
  categoryProgress: Record<CategoryName, number>;
  overallProgress: number;
  
  // Categories and required swipes (passed from parent)
  CATEGORIES: Category[];
  REQUIRED_SWIPES_MAP: Record<CategoryName, number>;
  
  // Swipe state
  swipeDirection: "left" | "right" | null;
  dragOffset: { x: number; y: number };
  isDragging: boolean;
  
  // Swipe handlers
  handleSwipe: (direction: "left" | "right") => void;
  handleDragStart: (x: number, y: number) => void;
  handleDragMove: (x: number, y: number) => void;
  handleDragEnd: () => void;
  handleSwipeAnimationEnd: () => void;
  
  // UI helper functions
  getSwipeRightPhrase: (category: CategoryName) => string;
  getSwipeLeftPhrase: (category: CategoryName) => string;
  currentRightPhrase: string | null;
  currentLeftPhrase: string | null;
  badgeGradientClass: string;
  
  // Control buttons
  handleReset: () => void;
  handleAutoComplete: () => void;
  isAutoCompleting: boolean;
  handleSkipToQuestionnaire: () => void;
  
  // Continue button
  showContinueButton: boolean;
  setShowContinueButton: React.Dispatch<React.SetStateAction<boolean>>;
  setAppState: React.Dispatch<React.SetStateAction<string>>;
  
  // Badge and confetti
  showBadge: string | null;
  showConfetti: boolean;
}

export function SwipePage({
  isDarkMode,
  handleThemeToggle,
  isMuted,
  volume,
  handleMuteToggle,
  playSound,
  pageBgClass,
  subTextClass,
  cardStack,
  currentCategoryIndex,
  setCurrentCategoryIndex,
  currentCategory,
  categoryProgress,
  overallProgress,
  CATEGORIES,
  REQUIRED_SWIPES_MAP,
  swipeDirection,
  dragOffset,
  isDragging,
  handleSwipe,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  handleSwipeAnimationEnd,
  getSwipeRightPhrase,
  getSwipeLeftPhrase,
  currentRightPhrase,
  currentLeftPhrase,
  badgeGradientClass,
  handleReset,
  handleAutoComplete,
  isAutoCompleting,
  handleSkipToQuestionnaire,
  showContinueButton,
  setShowContinueButton,
  setAppState,
  showBadge,
  showConfetti,
}: SwipePageProps) {
  const swipeGlassPanelClass = isDarkMode 
    ? "bg-slate-900/60 border-white/10 text-white shadow-xl backdrop-blur-xl" 
    : "bg-white/60 border-white/40 text-slate-900 shadow-xl backdrop-blur-xl";

  return (
    <div
      className={cn(
        "h-[100svh] relative flex flex-col overflow-hidden transition-colors duration-500",
        pageBgClass
      )}
      style={{ touchAction: 'none' }}
    >
      {/* Background - Extends into safe area notch */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" style={{ zIndex: 0 }}>
        {/* Fuchsia blob - top left */}
        <div
          className={cn(
            "absolute -top-[20%] -left-[10%] w-[120vw] h-[120vw] sm:w-[80vw] sm:h-[80vw] sm:-top-40 sm:-left-16 rounded-full blur-[100px] sm:blur-[200px]",
            isDarkMode ? "bg-fuchsia-500/45 sm:bg-fuchsia-500/26" : "bg-fuchsia-500/70 sm:bg-fuchsia-500/60 mix-blend-multiply"
          )}
          style={{
            animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
        
        {/* Blue blob - middle right */}
        <div
          className={cn(
            "absolute top-[30%] -right-[20%] w-[110vw] h-[110vw] sm:w-[70vw] sm:h-[70vw] sm:-right-28 rounded-full blur-[100px] sm:blur-[200px]",
            isDarkMode ? "bg-blue-500/41 sm:bg-blue-500/22" : "bg-blue-500/70 sm:bg-blue-500/60 mix-blend-multiply" 
          )}
          style={{
            animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            animationDelay: "0.5s",
          }}
        />
        
        {/* Purple blob - bottom left */}
        <div
          className={cn(
            "absolute bottom-0 left-[20%] w-[100vw] h-[100vw] sm:w-[70vw] sm:h-[70vw] sm:bottom-[-10%] rounded-full blur-[100px] sm:blur-[200px]",
            isDarkMode ? "bg-purple-500/41 sm:bg-purple-500/22" : "bg-indigo-500/70 sm:bg-indigo-500/60 mix-blend-multiply"
          )}
          style={{
            animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            animationDelay: "1s",
          }}
        />
        {/* Grid Overlay */}
        <div className={cn(
           "absolute inset-0 bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0",
           isDarkMode 
             ? "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" 
             : "bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]"
        )} />
      </div>

      {/* Content with safe area padding */}
      <SafeAreaWrapper fullHeight={false} includeTop={true} includeBottom={false} className="h-full">
        <div className="relative z-10 flex flex-col h-full">
          
          {/* Header */}
          <header className="flex-shrink-0 pt-4 px-4 space-y-4">
            <div className="flex items-center justify-between">
              <h1
                className={cn(
                  "text-3xl font-black uppercase tracking-tighter bg-clip-text text-transparent",
                  isDarkMode
                    ? "bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400"
                    : "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600"
                )}
              >
                Swipe Deck
              </h1>
              <div className="flex items-center gap-2 relative">
                <button
                  onClick={handleReset}
                  className={cn(
                     "rounded-full p-2 transition-all active:scale-95",
                     isDarkMode 
                        ? "text-slate-400 hover:text-white hover:bg-white/10" 
                        : "text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm"
                  )}
                  aria-label="Reset"
                >
                  <RotateCcw className="size-5" />
                </button>
                <button
                  onClick={handleAutoComplete}
                  disabled={isAutoCompleting}
                  className={cn(
                     "rounded-full p-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                     isDarkMode 
                        ? "text-slate-400 hover:text-white hover:bg-white/10" 
                        : "text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm"
                  )}
                >
                  {isAutoCompleting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Sparkles className="size-5" />
                  )}
                </button>
                <div className="flex items-center gap-2">
               <button
                  onClick={() => {
                     handleThemeToggle();
                     playSound('switch');
                  }}
                  className={cn(
                     "rounded-full p-2 transition-all active:scale-95",
                     isDarkMode 
                        ? "text-slate-400 hover:text-white hover:bg-white/10" 
                        : "text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm"
                  )}
               >
                  {isDarkMode ? <Moon className="size-5" /> : <Sun className="size-5" />}
               </button>
               
               <button
                  onClick={handleMuteToggle}
                  className={cn(
                     "rounded-full p-2 transition-all active:scale-95",
                     isDarkMode 
                        ? "text-slate-400 hover:text-white hover:bg-white/10" 
                        : "text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm"
                  )}
               >
                  {isMuted ? <VolumeX className="size-5" /> : volume < 0.35 ? <Volume1 className="size-5" /> : <Volume2 className="size-5" />}
               </button>
            </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] uppercase font-semibold">
                <span className={subTextClass}>Now swiping: {currentCategory.displayName}</span>
                <span className={subTextClass}>{overallProgress}% calibrated</span>
              </div>
              <Progress
                value={overallProgress}
                className={cn(
                  "h-3 mt-2 bg-white/20",
                  "[&_[data-slot=progress-indicator]]:bg-gradient-to-r",
                  "[&_[data-slot=progress-indicator]]:from-fuchsia-500",
                  "[&_[data-slot=progress-indicator]]:to-blue-500"
                )}
              />
            </div>

            <div className="grid grid-cols-6 gap-2">
              {CATEGORIES.map((cat, idx) => {
                const progress = categoryProgress[cat.name];
                const required = REQUIRED_SWIPES_MAP[cat.name];
                const isComplete = progress >= required;
                const percentage = Math.min(100, (progress / required) * 100);
                const isActive = idx === currentCategoryIndex;

                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setCurrentCategoryIndex(idx);
                      setShowContinueButton(false);
                      playSound("click");
                    }}
                    className={cn(
                      "rounded-2xl px-2 py-2 flex flex-col items-center gap-1 text-[11px] font-semibold transition-all overflow-visible",
                      isActive
                        ? "bg-gradient-to-br from-fuchsia-500/90 to-blue-500/90 text-white shadow-lg border-transparent"
                        : isComplete
                          ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30"
                          : isDarkMode
                            ? "bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5"
                            : "bg-white/40 text-slate-600 hover:bg-white/60 border border-white/30"
                    )}
                  >
                    <div className="relative">
                      {cat.icon}
                      {isComplete && (
                        <div className="absolute -top-0.5 -right-0.5 size-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <span className="text-[9px] truncate w-full text-center">{cat.displayName}</span>
                    <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-fuchsia-500 to-blue-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </header>

          {/* Main Card Area */}
          <main className="flex-1 flex items-center justify-center px-4 min-h-0 overflow-visible">
            <div className="relative w-full max-w-sm aspect-[3/4] perspective-1000">
              {/* Card stacking effect */}
              {cardStack.slice(1, 3).map((_, idx) => (
                <div
                  key={`bg-${idx}`}
                  className={cn(
                    "absolute inset-0 rounded-[24px] border backdrop-blur-md transition-all",
                    swipeGlassPanelClass
                  )}
                  style={{
                    transform: `scale(${1 - (idx + 1) * 0.04}) translateY(${(idx + 1) * 12}px)`,
                    opacity: 1 - (idx + 1) * 0.2,
                    zIndex: 10 - idx,
                  }}
                />
              ))}

              {/* Active Card */}
              {cardStack.length > 0 ? (
                <div
                  className={cn(
                    "absolute inset-0 z-30 select-none rounded-[32px] overflow-hidden",
                    isDragging && "cursor-grabbing"
                  )}
                  style={{
                    transform: swipeDirection
                      ? undefined
                      : `translateX(${dragOffset.x}px) rotate(${dragOffset.x * 0.05}deg)`,
                    touchAction: "none",
                  }}
                  onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                  onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchMove={(e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchEnd={handleDragEnd}
                >
                  <Card
                    onTransitionEnd={handleSwipeAnimationEnd}
                    className={cn(
                      "h-full overflow-hidden border backdrop-blur-2xl transition-all duration-600 ease-out",
                      swipeGlassPanelClass,
                      "shadow-[0_35px_80px_-40px_rgba(15,23,42,0.8)]",
                      swipeDirection === "right" && "translate-x-[115%] rotate-6 opacity-0",
                      swipeDirection === "left" && "-translate-x-[115%] -rotate-6 opacity-0"
                    )}
                  >
                    <div className="absolute inset-0 pointer-events-none rounded-[24px] border border-white/20" />
                    <div
                      className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center transition-opacity"
                      style={{ opacity: swipeDirection === "right" ? 0.8 : Math.max(0, dragOffset.x / 120) * 0.8 }}
                    >
                      <div className="bg-green-500 text-white px-6 py-2 rounded-full text-2xl font-black tracking-widest rotate-6 border border-white/40">
                        {currentRightPhrase || getSwipeRightPhrase(currentCategory.name)}
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 bg-red-500/20 z-10 flex items-center justify-center transition-opacity"
                      style={{ opacity: swipeDirection === "left" ? 0.8 : Math.max(0, -dragOffset.x / 120) * 0.8 }}
                    >
                      <div className="bg-red-500 text-white px-6 py-2 rounded-full text-2xl font-black tracking-widest -rotate-6 border border-white/40">
                        {currentLeftPhrase || getSwipeLeftPhrase(currentCategory.name)}
                      </div>
                    </div>

                    <div className="relative h-[60%]">
                      <img src={cardStack[0].imageUrl} alt={cardStack[0].title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={cn(
                            "bg-gradient-to-r text-[11px] font-black tracking-widest uppercase border-none text-white",
                            badgeGradientClass
                          )}
                        >
                          {currentCategory.displayName}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <div className="-mt-6">
                        <h2 className="text-2xl font-black tracking-tight">{cardStack[0].title}</h2>
                        <p className={cn("text-sm mt-2 leading-relaxed", subTextClass)}>{cardStack[0].description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 -mt-1">
                        {cardStack[0].tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className={cn(
                              "text-[11px] font-semibold uppercase border-white/20 rounded-full px-3 py-1",
                              isDarkMode ? "text-white/80" : "text-slate-700"
                            )}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center rounded-[32px] bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-200 font-semibold text-sm z-20 backdrop-blur-lg">
                  Preparing cards...
                </div>
              )}
          </div>
        </main>

        <footer className="pt-4 flex items-center justify-center flex-shrink-0 pb-[max(1.5rem,0.5rem)]">
            {cardStack.length > 0 ? (
              <div className="flex justify-center gap-6 items-center">
                <Button
                  size="lg"
                  variant="ghost"
                  className={cn(
                    "size-16 rounded-full flex items-center justify-center transition-all active:scale-95 backdrop-blur-xl border relative z-50",
                    isDarkMode 
                      ? "bg-white/5 border-white/10 text-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:border-red-500/50 hover:bg-red-500/10" 
                      : "bg-white/40 border-white/40 text-red-600 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:border-red-500/50 hover:bg-red-500/10"
                  )}
                  onClick={() => handleSwipe("left")}
                >
                  <X className="size-7" />
                </Button>
                <Button
                  size="lg"
                  className={cn(
                    "size-16 rounded-full flex items-center justify-center transition-all active:scale-95 backdrop-blur-xl border",
                     isDarkMode 
                        ? "bg-white/5 border-white/10 text-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:border-green-500/50 hover:bg-green-500/10" 
                        : "bg-white/40 border-white/40 text-green-600 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:border-green-500/50 hover:bg-green-500/10"
                  )}
                  onClick={() => handleSwipe("right")}
                >
                  <Heart className="size-7" />
                </Button>
                {showContinueButton && (
                  <Button
                    size="lg"
                    className={cn(
                      "bg-gradient-to-r from-fuchsia-600 to-blue-600 text-white rounded-full px-8 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                    )}
                    onClick={() => setAppState("questionnaire")}
                  >
                    Continue
                  </Button>
                )}
                   <button 
                      onClick={handleSkipToQuestionnaire}
                      disabled={isAutoCompleting}
                      className={cn(
                         "rounded-full p-3 transition-all active:scale-95 group",
                         isDarkMode 
                            ? "text-slate-500 hover:text-white hover:bg-white/10" 
                            : "text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm",
                         isAutoCompleting && "opacity-50 cursor-not-allowed"
                      )}
                   >
                      <FastForward className="size-5 group-hover:translate-x-1 transition-transform" />
                   </button>
              </div>
            ) : (
              <p className={cn("text-center text-sm font-semibold", subTextClass)}>
                You've seen every card in this category.
              </p>
            )}
        </footer>
        </div>
      </SafeAreaWrapper>

      {showBadge && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in fade-in duration-500">
          <Card
            className={cn(
              "text-center p-8 rounded-3xl text-white shadow-2xl border-0 bg-gradient-to-r",
              badgeGradientClass
            )}
          >
            <Award className="size-16 mx-auto mb-3" />
            <h3 className="text-2xl font-black">{showBadge} Complete!</h3>
            <p className="text-sm opacity-90">Badge earned</p>
          </Card>
        </div>
      )}

      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2 animate-pulse">
              <PartyPopper className="size-24 mx-auto text-fuchsia-400" />
              <h2 className="text-3xl font-black">Profile Calibrated!</h2>
              <p className={cn("text-sm", subTextClass)}>Jump into the questionnaire to lock it in.</p>
            </div>
          </div>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                backgroundColor: ["#f472b6", "#38bdf8", "#a855f7", "#34d399", "#facc15"][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random()}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
