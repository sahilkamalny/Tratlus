import React from "react";
import { cn } from "@/lib/utils";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Moon, 
  Sun, 
  VolumeX, 
  Volume1, 
  Volume2, 
  X,
  Trash2,
  Edit3,
  Plus,
  Check,
  Car,
  Camera,
  MapPin,
  Map,
  Compass,
  DollarSign,
  Loader2,
  Utensils,
  Star,
  RefreshCw,
  GripVertical,
  Sparkles,
} from "lucide-react";
import type { TravelItinerary, Activity } from "@/hooks/use-google-gemini-chat";


export interface NearbyActivity {
  title: string;
  location: string;
  description: string;
  estimatedCost: number;
  type: string;
  rating?: number;
}

interface ItineraryPageProps {
  // Theme
  isDarkMode: boolean;
  handleThemeToggle: () => void;
  
  // Sound
  isMuted: boolean;
  volume: number;
  handleMuteToggle: () => void;
  playSound: (sound: string) => void;
  
  // Itinerary data
  itinerary: TravelItinerary;
  setItinerary: React.Dispatch<React.SetStateAction<TravelItinerary | null>>;
  
  // Nearby activities dialog
  showNearbyActivities: boolean;
  setShowNearbyActivities: React.Dispatch<React.SetStateAction<boolean>>;
  nearbyActivities: NearbyActivity[];
  nearbyCategory: string;
  setNearbyCategory: React.Dispatch<React.SetStateAction<string>>;
  isLoadingNearby: boolean;
  handleAddNearbyActivity: (activity: NearbyActivity, dayIndex: number) => void;
  
  // Map view dialog
  showMapView: boolean;
  setShowMapView: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenMapView: () => void;
  mapCoordinates: { lat: number; lon: number } | null;
  isLoadingMap: boolean;
  
  // Activity editing
  editingActivity: { dayIndex: number; actIndex: number } | null;
  setEditingActivity: React.Dispatch<React.SetStateAction<{ dayIndex: number; actIndex: number } | null>>;
  
  // Drag and drop
  draggedActivity: { dayIndex: number; actIndex: number } | null;
  setDraggedActivity: React.Dispatch<React.SetStateAction<{ dayIndex: number; actIndex: number } | null>>;
  dragOverActivity: { dayIndex: number; actIndex: number } | null;
  setDragOverActivity: React.Dispatch<React.SetStateAction<{ dayIndex: number; actIndex: number } | null>>;
  handleActivityDragStart: (dayIndex: number, actIndex: number) => void;
  handleActivityDragOver: (e: React.DragEvent, dayIndex: number, actIndex: number) => void;
  handleActivityDrop: (dayIndex: number, actIndex: number) => void;
  handleActivityDragEnd: () => void;
  
  // Activity actions
  handleDeleteActivity: (dayIndex: number, actIndex: number) => void;
  handleOpenAddActivity: (dayIndex: number) => void;
  handleAddActivity: () => void;
  
  // Add activity form
  addingActivityForDay: number | null;
  setAddingActivityForDay: React.Dispatch<React.SetStateAction<number | null>>;
  newActivityForm: {
    title: string;
    time: string;
    duration: string;
    location: string;
    description: string;
    estimatedCost: string;
    type: string;
  };
  setNewActivityForm: React.Dispatch<React.SetStateAction<{
    title: string;
    time: string;
    duration: string;
    location: string;
    description: string;
    estimatedCost: string;
    type: string;
  }>>;
  isAddingActivity: boolean;
  
  // Re-optimize
  handleReOptimize: () => void;
  isGenerating: boolean;
}

export function ItineraryPage({
  isDarkMode,
  handleThemeToggle,
  isMuted,
  volume,
  handleMuteToggle,
  playSound,
  itinerary,
  setItinerary,
  showNearbyActivities,
  setShowNearbyActivities,
  nearbyActivities,
  nearbyCategory,
  setNearbyCategory,
  isLoadingNearby,
  handleAddNearbyActivity,
  showMapView,
  setShowMapView,
  handleOpenMapView,
  mapCoordinates,
  isLoadingMap,
  editingActivity,
  setEditingActivity,
  draggedActivity,
  setDraggedActivity,
  dragOverActivity,
  setDragOverActivity,
  handleActivityDragStart,
  handleActivityDragOver,
  handleActivityDrop,
  handleActivityDragEnd,
  handleDeleteActivity,
  handleOpenAddActivity,
  handleAddActivity,
  addingActivityForDay,
  setAddingActivityForDay,
  newActivityForm,
  setNewActivityForm,
  isAddingActivity,
  handleReOptimize,
  isGenerating,
}: ItineraryPageProps) {
  const primaryGradientButton = "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20";
  
  const glassCardClass = isDarkMode
    ? "bg-slate-900/60 border-white/10 text-white shadow-xl backdrop-blur-xl"
    : "bg-white/60 border-white/40 text-slate-900 shadow-xl backdrop-blur-xl";
    
  const timelineLineClass = isDarkMode ? "bg-white/10" : "bg-indigo-500/20";
  const dayHeaderClass = isDarkMode ? "bg-slate-800/80 text-white" : "bg-white/80 text-indigo-900";
  
  const pageBgClass = isDarkMode ? "bg-slate-950" : "bg-gradient-to-br from-rose-200 via-sky-200 to-indigo-200";

  return (
    <div 
      className={cn(
        "h-[100svh] relative overflow-hidden transition-colors duration-500",
        pageBgClass
      )}
    >
      {/* Animated Background - Extends into safe area notch */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className={cn(
            "absolute -top-[20%] -left-[10%] w-[120vw] h-[120vw] sm:w-[80vw] sm:h-[80vw] sm:-top-40 sm:-left-16 rounded-full blur-[100px] sm:blur-[200px]",
            isDarkMode ? "bg-fuchsia-500/20" : "bg-fuchsia-600/30"
          )}
          style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
        />
        <div className={cn(
            "absolute top-[30%] -right-[20%] w-[110vw] h-[110vw] sm:w-[70vw] sm:h-[70vw] sm:-right-28 rounded-full blur-[100px] sm:blur-[200px]",
            isDarkMode ? "bg-blue-500/20" : "bg-blue-500/30"
          )}
          style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite", animationDelay: "0.5s" }}
        />
         <div className={cn(
           "absolute inset-0 bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] z-0",
           isDarkMode 
             ? "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" 
             : "bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]"
         )} />
      </div>

      {/* Content with safe area padding */}
      <SafeAreaWrapper fullHeight={false} includeTop={true} includeBottom={true} className="h-full">
        <div className="h-full overflow-y-auto relative z-10 scrollbar-hide">
          {/* Top Controls */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  handleThemeToggle();
                  playSound("switch");
                }}
                className={cn(
                  "rounded-full p-2 hover:bg-white/10 active:scale-95 transition-all",
                  isDarkMode ? "text-slate-400 hover:text-white" : "text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm"
                )}
              >
                 {isDarkMode ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </Button>
              <Button
                variant="ghost"
                onClick={handleMuteToggle}
                className={cn(
                  "rounded-full p-2 hover:bg-white/10 active:scale-95 transition-all",
                  isDarkMode ? "text-slate-400 hover:text-white" : "text-indigo-900 bg-white/40 hover:bg-white/60 shadow-sm"
                )}
              >
                 {isMuted ? <VolumeX className="size-5" /> : volume < 0.35 ? <Volume1 className="size-5" /> : <Volume2 className="size-5" />}
              </Button>
          </div>
          
          {/* Hero Header */}
          <div className="relative pt-12 pb-8 px-6 text-center z-10">
             <div className={cn(
               "inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border backdrop-blur-md",
               isDarkMode ? "bg-white/10 border-white/10 text-slate-300" : "bg-white/40 border-white/20 text-indigo-900"
             )}>
                Itinerary Ready
             </div>
             <h1 className={cn(
                "text-4xl md:text-6xl font-black tracking-tight mb-2 bg-clip-text text-transparent pb-2",
                isDarkMode 
                  ? "bg-gradient-to-r from-fuchsia-400 to-blue-400" 
                  : "bg-gradient-to-r from-fuchsia-600 to-blue-600"
             )}>
                {itinerary.destination}
             </h1>
             <p className={cn("text-lg font-medium opacity-80", isDarkMode ? "text-slate-300" : "text-indigo-900")}>
                {itinerary.tripDates.startDate} — {itinerary.tripDates.endDate}
             </p>
             
             {/* Primary Actions */}
             <div className="flex justify-center gap-3 mt-6">
                <Button 
                  onClick={() => setShowNearbyActivities(true)}
                  className={cn(
                    "rounded-full px-6 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95",
                    primaryGradientButton
                  )}
                >
                  <Compass className="size-4 mr-2" /> Explore Nearby
                </Button>
                <Button 
                  onClick={handleOpenMapView}
                  className={cn(
                    "rounded-full px-6 font-bold border shadow-md transition-transform hover:scale-105 active:scale-95",
                    isDarkMode ? "bg-white/10 border-white/10 text-white hover:bg-white/20" : "bg-white/60 border-white/40 text-indigo-900 hover:bg-white/80"
                  )}
                >
                  <Map className="size-4 mr-2" /> Map View
                </Button>
             </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 pb-32">
            
            {/* Cost Summary Card */}
            <div className={cn("rounded-2xl p-6 mb-8 flex items-center justify-between", glassCardClass)}>
              <div className="flex items-center gap-4">
                 <div className={cn("p-3 rounded-xl", isDarkMode ? "bg-green-500/20" : "bg-green-100")}>
                    <DollarSign className={cn("size-6", isDarkMode ? "text-green-400" : "text-green-600")} />
                 </div>
                 <div>
                    <p className="text-xs font-bold uppercase opacity-60">Estimated Total</p>
                    <p className={cn("text-2xl font-black", isDarkMode ? "text-green-400" : "text-green-700")}>
                       ${itinerary.totalEstimatedCost.toLocaleString()}
                    </p>
                 </div>
              </div>
               <Button
                  onClick={handleReOptimize}
                  variant="ghost"
                  className="rounded-full size-10 p-0 hover:bg-white/10"
                  disabled={isGenerating}
                >
                  <RefreshCw className={cn("size-5", isGenerating && "animate-spin")} />
                </Button>
            </div>

            {/* Timeline Items */}
            {itinerary.days.map((day, dayIndex) => (
              <div key={day.dayNumber} className="relative pl-8 pb-8 last:pb-0">
                {/* Timeline Line */}
                <div className={cn("absolute left-[11px] top-8 bottom-0 w-[2px]", timelineLineClass)} />
                
                {/* Day Header Dot */}
                <div className={cn(
                  "absolute left-0 top-1 size-6 rounded-full border-4 shadow-lg z-10",
                  isDarkMode ? "border-slate-950 bg-fuchsia-500" : "border-indigo-50 bg-fuchsia-500"
                )} />

                <div className="mb-6">
                   <h3 className={cn("text-xl font-black inline-flex items-center gap-2", isDarkMode ? "text-white" : "text-indigo-950")}>
                      Day {day.dayNumber} <span className="text-sm font-medium opacity-60 font-sans">{day.date}</span>
                   </h3>
                </div>

                <div className="space-y-4">
                  {day.activities.map((activity, actIndex) => {
                    const isTransportBetween = activity.type === "transport-between";

                    if (isTransportBetween) {
                       return (
                          <div
                            key={`${day.dayNumber}-${actIndex}`}
                            draggable
                            onDragStart={(e) => {
                              e.stopPropagation();
                              handleActivityDragStart(dayIndex, actIndex);
                            }}
                            onDragOver={(e) => handleActivityDragOver(e, dayIndex, actIndex)}
                            onDrop={() => handleActivityDrop(dayIndex, actIndex)}
                            onDragEnd={handleActivityDragEnd}
                            className={cn(
                              "relative ml-[-12px] flex items-center gap-3 py-2 px-3 rounded-lg border backdrop-blur-sm transition-all cursor-grab active:cursor-grabbing group",
                              isDarkMode 
                                ? "bg-slate-900/40 border-white/5 hover:bg-slate-800/60" 
                                : "bg-white/40 border-white/20 hover:bg-white/60",
                              draggedActivity?.dayIndex === dayIndex && draggedActivity?.actIndex === actIndex && "opacity-50 scale-95",
                              dragOverActivity?.dayIndex === dayIndex && dragOverActivity?.actIndex === actIndex && "border-fuchsia-500/50 bg-fuchsia-500/10"
                            )}
                          >
                             <div className="p-1.5 rounded-full bg-slate-500/20 text-slate-500">
                                <Car className="size-3" />
                             </div>
                             <div className="flex-1 min-w-0 flex items-center gap-2 text-xs font-medium opacity-70">
                                <span>{activity.time}</span>
                                <span className="w-1 h-1 rounded-full bg-current" />
                                <span className="truncate">{activity.title}</span>
                             </div>
                             <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2 cursor-grab text-slate-400">
                                <GripVertical className="size-3" />
                             </div>
                          </div>
                       );
                    }

                    return (
                      <div
                        key={`${day.dayNumber}-${actIndex}`}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          handleActivityDragStart(dayIndex, actIndex);
                        }}
                        onDragOver={(e) => handleActivityDragOver(e, dayIndex, actIndex)}
                        onDrop={() => handleActivityDrop(dayIndex, actIndex)}
                        onDragEnd={handleActivityDragEnd}
                        className={cn(
                          "p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing group",
                          glassCardClass,
                          draggedActivity?.dayIndex === dayIndex && draggedActivity?.actIndex === actIndex && "opacity-50 scale-95",
                          dragOverActivity?.dayIndex === dayIndex && dragOverActivity?.actIndex === actIndex && "border-fuchsia-500/50 bg-fuchsia-500/10"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={cn(
                                "p-2 rounded-lg text-white shadow-sm",
                                activity.type === 'food' ? "bg-orange-500" :
                                activity.type === 'attraction' ? "bg-cyan-500" :
                                activity.type === 'activity' ? "bg-green-500" :
                                activity.type === 'accommodation' ? "bg-purple-500" :
                                "bg-indigo-500"
                              )}>
                                {activity.type === 'food' ? <Utensils className="size-4" /> :
                                 activity.type === 'attraction' ? <Camera className="size-4" /> :
                                 activity.type === 'activity' ? <Compass className="size-4" /> :
                                 <MapPin className="size-4" />}
                              </div>
                              <div>
                                <h4 className={cn("font-bold", isDarkMode ? "text-white" : "text-slate-900")}>{activity.title}</h4>
                                <p className="text-xs opacity-60">{activity.time} • {activity.duration}</p>
                              </div>
                            </div>
                            <p className={cn("text-sm mb-2", isDarkMode ? "text-slate-400" : "text-slate-600")}>{activity.description}</p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className={cn("flex items-center gap-1", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                                <MapPin className="size-3" /> {activity.location}
                              </span>
                              <span className={cn("font-medium", isDarkMode ? "text-green-400" : "text-green-600")}>
                                ${activity.estimatedCost}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setEditingActivity({ dayIndex, actIndex })}
                            >
                              <Edit3 className="size-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteActivity(dayIndex, actIndex)}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-slate-400 pt-1">
                              <GripVertical className="size-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Add Activity Button */}
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full rounded-xl border-dashed",
                      isDarkMode ? "border-white/10 text-slate-400 hover:bg-white/5" : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    )}
                    onClick={() => handleOpenAddActivity(dayIndex)}
                  >
                    <Plus className="size-4 mr-2" /> Add Activity
                  </Button>
                </div>
              </div>
            ))}

          </div>

        </div>

        {/* Nearby Activities Dialog */}
        <Dialog open={showNearbyActivities} onOpenChange={setShowNearbyActivities}>
          <DialogContent className={cn("max-w-2xl max-h-[80vh] overflow-y-auto", glassCardClass)}>
            <DialogHeader>
              <DialogTitle className={cn("flex items-center gap-2", isDarkMode ? "text-white" : "text-amber-900")}>
                <Compass className="size-5" />
                Explore Nearby Activities
              </DialogTitle>
              <DialogDescription>
                Discover local experiences to add to your itinerary
              </DialogDescription>
            </DialogHeader>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "all", label: "All", icon: <Star className="size-3" /> },
                { id: "food", label: "Food", icon: <Utensils className="size-3" /> },
                { id: "attraction", label: "Sights", icon: <Camera className="size-3" /> },
                { id: "activity", label: "Activities", icon: <Compass className="size-3" /> },
              ].map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={nearbyCategory === cat.id ? "default" : "outline"}
                  onClick={() => setNearbyCategory(cat.id)}
                  className={cn(
                    "text-xs h-8",
                    nearbyCategory === cat.id 
                      ? primaryGradientButton 
                      : isDarkMode ? "border-white/10" : "border-slate-200"
                  )}
                >
                  {cat.icon}
                  <span className="ml-1">{cat.label}</span>
                </Button>
              ))}
            </div>

            {/* Activities List */}
            <div className="mt-4 space-y-3">
              {isLoadingNearby ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-8 animate-spin text-fuchsia-500" />
                </div>
              ) : nearbyActivities.length === 0 ? (
                <p className={cn("text-center py-8", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                  No nearby activities found. Try refreshing.
                </p>
              ) : (
                nearbyActivities
                  .filter((act) => nearbyCategory === "all" || act.type === nearbyCategory)
                  .map((activity, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3 rounded-lg border",
                        isDarkMode ? "bg-white/5 border-white/5" : "bg-white/40 border-white/20"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <div className={cn(
                                "p-1.5 rounded-md text-white shadow-sm",
                                activity.type === 'food' ? "bg-orange-500" :
                                activity.type === 'attraction' ? "bg-cyan-500" :
                                activity.type === 'activity' ? "bg-green-500" :
                                "bg-indigo-500"
                             )}>
                                {activity.type === 'food' ? <Utensils className="size-3" /> :
                                 activity.type === 'attraction' ? <Camera className="size-3" /> :
                                 activity.type === 'activity' ? <Compass className="size-3" /> :
                                 <MapPin className="size-3" />}
                             </div>
                            <h4 className={cn("font-medium", isDarkMode ? "text-white" : "text-slate-900")}>{activity.title}</h4>
                            {activity.rating && (
                              <div className="flex items-center gap-1 text-xs text-yellow-500">
                                <Star className="size-3 fill-yellow-500" />
                                {activity.rating}
                              </div>
                            )}
                          </div>
                          <p className={cn("text-sm mt-1", isDarkMode ? "text-slate-400" : "text-slate-600")}>{activity.location}</p>
                          <p className={cn("text-sm mt-1", isDarkMode ? "text-slate-500" : "text-slate-500")}>{activity.description}</p>
                          <span className={cn("text-sm font-medium", isDarkMode ? "text-green-400" : "text-green-600")}>
                            ${activity.estimatedCost}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {itinerary.days.map((day, dayIdx) => (
                            <Button
                              key={dayIdx}
                              size="sm"
                              variant="outline"
                              className={cn(
                                "text-xs h-7",
                                isDarkMode ? "border-white/10 hover:bg-white/10" : "border-white/30 hover:bg-white/20"
                              )}
                              onClick={() => handleAddNearbyActivity(activity, dayIdx)}
                            >
                              <Plus className="size-3 mr-1" />
                              Day {day.dayNumber}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Map View Dialog */}
        <Dialog open={showMapView} onOpenChange={setShowMapView}>
          <DialogContent className={cn("max-w-4xl max-h-[90vh] overflow-y-auto", glassCardClass)}>
            <DialogHeader>
              <DialogTitle className={cn("flex items-center gap-2", isDarkMode ? "text-white" : "text-amber-900")}>
                <Map className="size-5" />
                Trip Map - {itinerary.destination}
              </DialogTitle>
              <DialogDescription>
                Your complete itinerary visualized on a map
              </DialogDescription>
            </DialogHeader>

            {/* Map Legend */}
            <div className={cn("flex gap-4 flex-wrap mt-4 p-3 rounded-lg", isDarkMode ? "bg-slate-800" : "bg-slate-50")}>
              <div className={cn("flex items-center gap-2 text-sm", isDarkMode ? "text-white" : "text-slate-700")}>
                <div className="size-3 rounded-full bg-amber-500" />
                <span>Food</span>
              </div>
              <div className={cn("flex items-center gap-2 text-sm", isDarkMode ? "text-white" : "text-slate-700")}>
                <div className="size-3 rounded-full bg-cyan-500" />
                <span>Attractions</span>
              </div>
              <div className={cn("flex items-center gap-2 text-sm", isDarkMode ? "text-white" : "text-slate-700")}>
                <div className="size-3 rounded-full bg-green-500" />
                <span>Activities</span>
              </div>
              <div className={cn("flex items-center gap-2 text-sm", isDarkMode ? "text-white" : "text-slate-700")}>
                <div className="size-3 rounded-full bg-purple-500" />
                <span>Stays</span>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-slate-200">
              {isLoadingMap ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
                </div>
              ) : mapCoordinates && showMapView ? (
                <iframe
                  key={`map-${Date.now()}`}
                  title="Trip Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoordinates.lon - 0.02}%2C${mapCoordinates.lat - 0.02}%2C${mapCoordinates.lon + 0.02}%2C${mapCoordinates.lat + 0.02}&layer=mapnik&marker=${mapCoordinates.lat}%2C${mapCoordinates.lon}&_=${Date.now()}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-center text-slate-500">
                  <div>
                    <Map className="size-12 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Click "Open Map" to load map</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Activity Dialog */}
        <Dialog open={addingActivityForDay !== null} onOpenChange={(open) => !open && setAddingActivityForDay(null)}>
          <DialogContent className={cn("max-w-md", glassCardClass)}>
            <DialogHeader>
              <DialogTitle className={cn(isDarkMode ? "text-white" : "text-slate-900")}>
                Add Activity to Day {addingActivityForDay !== null ? addingActivityForDay + 1 : ""}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label className={cn("mb-2 block", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                  Activity Title
                </Label>
                <Input
                  placeholder="e.g. Visit the Louvre"
                  value={newActivityForm.title}
                  onChange={(e) => setNewActivityForm({ ...newActivityForm, title: e.target.value })}
                  className={cn(
                    "h-10 rounded-lg",
                    isDarkMode 
                      ? "bg-slate-950/50 border-white/10 text-white" 
                      : "bg-white/60 border-white/40"
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className={cn("mb-2 block", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                    Time
                  </Label>
                  <Input
                    type="time"
                    value={newActivityForm.time}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, time: e.target.value })}
                    className={cn(
                      "h-10 rounded-lg",
                      isDarkMode 
                        ? "bg-slate-950/50 border-white/10 text-white" 
                        : "bg-white/60 border-white/40"
                    )}
                  />
                </div>
                <div>
                  <Label className={cn("mb-2 block", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                    Duration
                  </Label>
                  <Input
                    placeholder="e.g. 2 hours"
                    value={newActivityForm.duration}
                    onChange={(e) => setNewActivityForm({ ...newActivityForm, duration: e.target.value })}
                    className={cn(
                      "h-10 rounded-lg",
                      isDarkMode 
                        ? "bg-slate-950/50 border-white/10 text-white" 
                        : "bg-white/60 border-white/40"
                    )}
                  />
                </div>
              </div>

              <div>
                <Label className={cn("mb-2 block", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                  Location
                </Label>
                <Input
                  placeholder="e.g. 99 Rue de Rivoli"
                  value={newActivityForm.location}
                  onChange={(e) => setNewActivityForm({ ...newActivityForm, location: e.target.value })}
                  className={cn(
                    "h-10 rounded-lg",
                    isDarkMode 
                      ? "bg-slate-950/50 border-white/10 text-white" 
                      : "bg-white/60 border-white/40"
                  )}
                />
              </div>

              <div>
                <Label className={cn("mb-2 block", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                  Estimated Cost ($)
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newActivityForm.estimatedCost}
                  onChange={(e) => setNewActivityForm({ ...newActivityForm, estimatedCost: e.target.value })}
                  className={cn(
                    "h-10 rounded-lg",
                    isDarkMode 
                      ? "bg-slate-950/50 border-white/10 text-white" 
                      : "bg-white/60 border-white/40"
                  )}
                />
              </div>

              <div>
                <Label className={cn("mb-2 block", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                  Type
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {["food", "attraction", "activity", "other"].map((type) => (
                    <Button
                      key={type}
                      size="sm"
                      variant={newActivityForm.type === type ? "default" : "outline"}
                      onClick={() => setNewActivityForm({ ...newActivityForm, type })}
                      className={cn(
                        "capitalize",
                        newActivityForm.type === type 
                          ? primaryGradientButton 
                          : isDarkMode ? "border-white/10" : ""
                      )}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddActivity}
                disabled={!newActivityForm.title.trim() || isAddingActivity}
                className={cn("w-full mt-4", primaryGradientButton)}
              >
                {isAddingActivity ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="size-4 mr-2" />
                    Add Activity
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </SafeAreaWrapper>
    </div>
  );
}
