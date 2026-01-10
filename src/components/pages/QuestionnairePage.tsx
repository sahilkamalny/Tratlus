import { cn } from "@/lib/utils";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Moon, 
  Sun, 
  VolumeX, 
  Volume1, 
  Volume2, 
  X,
  Utensils,
  Check,
  Car,
  Bus,
  Plane,
  Navigation,
  MapPin,
  FastForward,
  DollarSign,
  Coffee,
  Home,
  Map,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface QuestionnairePageProps {
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
  primaryGradientButton: string;
  
  // Questionnaire state
  questionnaireStep: number;
  setQuestionnaireStep: React.Dispatch<React.SetStateAction<number>>;
  
  // Dietary preferences (Step 1)
  dietaryNeeds: string[];
  setDietaryNeeds: React.Dispatch<React.SetStateAction<string[]>>;
  foodAllergies: string;
  setFoodAllergies: React.Dispatch<React.SetStateAction<string>>;
  mealBudget: string;
  setMealBudget: React.Dispatch<React.SetStateAction<string>>;
  foodAdventurousness: number;
  setFoodAdventurousness: React.Dispatch<React.SetStateAction<number>>;
  favoriteCuisines: string[];
  setFavoriteCuisines: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Transportation & Accommodation (Step 2)
  transportationMethod: string[];
  setTransportationMethod: React.Dispatch<React.SetStateAction<string[]>>;
  transportationPriority: "speed" | "cost" | "comfort";
  setTransportationPriority: React.Dispatch<React.SetStateAction<"speed" | "cost" | "comfort">>;
  accommodationType: string[];
  setAccommodationType: React.Dispatch<React.SetStateAction<string[]>>;
  pricePerNight: number;
  setPricePerNight: React.Dispatch<React.SetStateAction<number>>;
  
  // Trip Logistics (Step 3)
  destination: string;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  surpriseMe: boolean;
  setSurpriseMe: React.Dispatch<React.SetStateAction<boolean>>;
  departureLocation: string;
  setDepartureLocation: React.Dispatch<React.SetStateAction<string>>;
  tripDates: { from?: Date; to?: Date };
  setTripDates: React.Dispatch<React.SetStateAction<{ from?: Date; to?: Date }>>;
  numberOfTravelers: number;
  setNumberOfTravelers: React.Dispatch<React.SetStateAction<number>>;
  
  // Actions
  setAppState: React.Dispatch<React.SetStateAction<string>>;
  handleGenerateItinerary: () => void;
  isGenerating: boolean;
}

export function QuestionnairePage({
  isDarkMode,
  handleThemeToggle,
  isMuted,
  volume,
  handleMuteToggle,
  playSound,
  pageBgClass,
  subTextClass,
  primaryGradientButton,
  questionnaireStep,
  setQuestionnaireStep,
  dietaryNeeds,
  setDietaryNeeds,
  foodAllergies,
  setFoodAllergies,
  mealBudget,
  setMealBudget,
  foodAdventurousness,
  setFoodAdventurousness,
  favoriteCuisines,
  setFavoriteCuisines,
  transportationMethod,
  setTransportationMethod,
  transportationPriority,
  setTransportationPriority,
  accommodationType,
  setAccommodationType,
  pricePerNight,
  setPricePerNight,
  destination,
  setDestination,
  surpriseMe,
  setSurpriseMe,
  departureLocation,
  setDepartureLocation,
  tripDates,
  setTripDates,
  numberOfTravelers,
  setNumberOfTravelers,
  setAppState,
  handleGenerateItinerary,
  isGenerating,
}: QuestionnairePageProps) {
  // Glass panel styles specific to questionnaire
  const glassCardClass = isDarkMode
    ? "bg-slate-900/40 border-white/10 text-white shadow-2xl backdrop-blur-xl"
    : "bg-white/40 border-white/40 text-slate-900 shadow-xl backdrop-blur-xl";
  
  const inputClass = isDarkMode
    ? "bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/20"
    : "bg-white/60 border-white/40 text-slate-900 placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20";

  const tileClass = (isActive: boolean) => cn(
    "cursor-pointer transition-all duration-300 relative overflow-hidden rounded-xl border p-4 flex flex-col gap-2 h-full",
    isActive 
      ? (isDarkMode 
          ? "bg-fuchsia-500/20 border-fuchsia-500/50 text-white shadow-[0_0_20px_rgba(217,70,239,0.2)]" 
          : "bg-blue-500/10 border-blue-500/50 text-slate-900 shadow-[0_0_20px_rgba(59,130,246,0.15)]") 
      : (isDarkMode 
          ? "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300" 
          : "bg-white/40 border-white/20 hover:bg-white/50 text-slate-600")
  );

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
            isDarkMode ? "bg-fuchsia-500/45 sm:bg-fuchsia-500/26" : "bg-fuchsia-500/70 sm:bg-fuchsia-500/60 mix-blend-multiply"
          )}
          style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
        />
        <div className={cn(
            "absolute top-[30%] -right-[20%] w-[110vw] h-[110vw] sm:w-[70vw] sm:h-[70vw] sm:-right-28 rounded-full blur-[100px] sm:blur-[200px]",
            isDarkMode ? "bg-blue-500/41 sm:bg-blue-500/22" : "bg-blue-500/70 sm:bg-blue-500/60 mix-blend-multiply" 
          )}
          style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite", animationDelay: "0.5s" }}
        />
        <div className={cn(
            "absolute bottom-0 left-[20%] w-[100vw] h-[100vw] sm:w-[70vw] sm:h-[70vw] sm:bottom-[-10%] rounded-full blur-[100px] sm:blur-[200px]",
            isDarkMode ? "bg-purple-500/41 sm:bg-purple-500/22" : "bg-indigo-500/70 sm:bg-indigo-500/60 mix-blend-multiply"
          )}
          style={{ animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite", animationDelay: "1s" }}
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
        <div className="h-full overflow-y-auto relative z-10 p-4 md:p-6 pb-24">
          
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
                  isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-indigo-900 hover:bg-white/40"
                )}
              >
                 {isDarkMode ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </Button>
              <Button
                variant="ghost"
                onClick={handleMuteToggle}
                className={cn(
                  "rounded-full p-2 hover:bg-white/10 active:scale-95 transition-all",
                  isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-indigo-900 hover:bg-white/40"
                )}
              >
                 {isMuted ? <VolumeX className="size-5" /> : volume < 0.35 ? <Volume1 className="size-5" /> : <Volume2 className="size-5" />}
              </Button>
              <button 
                 onClick={() => setAppState("landing")}
                 className={cn("p-2 rounded-full transition-colors active:scale-95", isDarkMode ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-white/40 text-slate-600 hover:text-indigo-900")}
              >
                 <X className="size-6" />
              </button>
          </div>

          <div className="max-w-2xl mx-auto">
            
            {/* Header */}
            <div className="mb-8 text-center">
               <h2 className={cn(
                  "text-3xl font-black bg-clip-text text-transparent mb-2 uppercase tracking-wide",
                  isDarkMode 
                    ? "bg-gradient-to-r from-fuchsia-400 to-blue-400" 
                    : "bg-gradient-to-r from-fuchsia-600 to-blue-600"
               )}>
                  Plan Your Journey
               </h2>
               <p className={cn("text-sm font-medium", subTextClass)}>
                  Step {questionnaireStep} of 3: {
                    questionnaireStep === 1 ? "Taste & Preferences" : 
                    questionnaireStep === 2 ? "Style & Comfort" : "Logistics"
                  }
               </p>
               
               {/* Progress Indicator */}
               <div className="flex justify-center gap-2 mt-4">
                  {[1, 2, 3].map(step => (
                    <div 
                      key={step} 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        step === questionnaireStep 
                          ? "w-8 bg-gradient-to-r from-fuchsia-500 to-blue-500" 
                          : step < questionnaireStep
                            ? "w-2 bg-green-500"
                            : "w-2 bg-slate-200/20"
                      )}
                    />
                  ))}
               </div>
            </div>

            {/* Form Content */}
            <div className={cn("rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 border", glassCardClass)}>
              
              {questionnaireStep === 1 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Utensils className="size-5 text-fuchsia-500" />
                      Dietary Preferences
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher", "None"].map((diet) => (
                         <div 
                            key={diet}
                            onClick={() => {
                              if (dietaryNeeds.includes(diet)) {
                                setDietaryNeeds(dietaryNeeds.filter((d) => d !== diet));
                              } else {
                                // If selecting "None", clear others. If selecting others, clear "None"
                                if (diet === "None") setDietaryNeeds(["None"]);
                                else setDietaryNeeds([...dietaryNeeds.filter(d => d !== "None"), diet]);
                              }
                            }}
                            className={tileClass(dietaryNeeds.includes(diet))}
                         >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">{diet}</span>
                              {dietaryNeeds.includes(diet) && <Check className="size-4 text-fuchsia-500" />}
                            </div>
                         </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <Label className={cn("mb-3 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                          Allergies
                        </Label>
                        <Input
                          placeholder="e.g. Peanuts, Shellfish..."
                          value={foodAllergies}
                          onChange={(e) => setFoodAllergies(e.target.value)}
                          className={cn("h-12 rounded-xl", inputClass)}
                        />
                     </div>
                     
                     <div>
                        <Label className={cn("mb-3 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                           Meal Budget
                        </Label>
                        <div className="flex gap-2">
                          {["$", "$$", "$$$", "$$$$"].map((budget) => (
                            <button
                              key={budget}
                              onClick={() => setMealBudget(budget)}
                              className={cn(
                                "flex-1 h-12 rounded-xl border font-bold transition-all",
                                mealBudget === budget
                                  ? (isDarkMode 
                                      ? "bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400" 
                                      : "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-600")
                                  : (isDarkMode 
                                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-400" 
                                      : "bg-white/40 border-white/20 hover:bg-white/50 text-slate-600")
                              )}
                            >
                              {budget}
                            </button>
                          ))}
                        </div>
                     </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-4">
                      <Label className={cn("block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                        Culinary Adventurousness
                      </Label>
                      <span className="font-bold text-fuchsia-500">{foodAdventurousness}/10</span>
                    </div>
                    <Slider
                      value={[foodAdventurousness]}
                      onValueChange={([val]) => setFoodAdventurousness(val)}
                      min={1}
                      max={10}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs font-medium opacity-60 mt-1">
                      <span>Safe & Familiar</span>
                      <span>Exotic & Wild</span>
                    </div>
                  </div>

                  <div>
                    <Label className={cn("mb-4 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                      Favorite Cuisines
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {["Italian", "Chinese", "Japanese", "Mexican", "Indian", "Thai", "French", "Mediterranean", "American", "Korean", "Vietnamese", "Greek", "African"].map((cuisine) => (
                        <button
                          key={cuisine}
                          onClick={() => {
                            if (favoriteCuisines.includes(cuisine)) {
                              setFavoriteCuisines(favoriteCuisines.filter((c) => c !== cuisine));
                            } else {
                              setFavoriteCuisines([...favoriteCuisines, cuisine]);
                            }
                          }}
                          className={cn(
                            "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                            favoriteCuisines.includes(cuisine)
                              ? "bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white border-transparent"
                              : (isDarkMode 
                                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-400" 
                                  : "bg-white/40 border-white/20 hover:bg-white/60 text-slate-600")
                          )}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {questionnaireStep === 2 && (
                 <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Car className="size-5 text-blue-500" />
                        Transportation
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[ 
                          { id: "Uber/Lyft", icon: Car }, 
                          { id: "Transit", icon: Bus }, 
                          { id: "Rental", icon: Car }, 
                          { id: "Flight", icon: Plane },
                          { id: "Bike", icon: Navigation }, 
                          { id: "Walk", icon: MapPin },
                        ].map((item) => (
                           <div 
                              key={item.id}
                              onClick={() => {
                                if (transportationMethod.includes(item.id)) {
                                  setTransportationMethod(transportationMethod.filter((m) => m !== item.id));
                                } else {
                                  setTransportationMethod([...transportationMethod, item.id]);
                                }
                              }}
                              className={tileClass(transportationMethod.includes(item.id))}
                           >
                              <item.icon className="size-5 opacity-70" />
                              <span className="font-semibold text-xs">{item.id}</span>
                           </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className={cn("mb-3 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                         Travel Priority
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                         {[ 
                            { value: "speed" as const, label: "Speed", icon: FastForward },
                            { value: "cost" as const, label: "Budget", icon: DollarSign },
                            { value: "comfort" as const, label: "Comfort", icon: Coffee },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setTransportationPriority(option.value)}
                              className={tileClass(transportationPriority === option.value)}
                            >
                              <option.icon className="size-5 opacity-70 mb-1" />
                              <span className="font-bold text-sm">{option.label}</span>
                            </button>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 pt-4 border-t border-white/10">
                        <Home className="size-5 text-green-500" />
                        Accommodation
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {["Hotel", "Resort", "Airbnb", "Hostel", "Boutique", "Villa"].map((type) => (
                             <div 
                                key={type}
                                onClick={() => {
                                  if (accommodationType.includes(type)) {
                                    setAccommodationType(accommodationType.filter((t) => t !== type));
                                  } else {
                                    setAccommodationType([...accommodationType, type]);
                                  }
                                }}
                                className={tileClass(accommodationType.includes(type))}
                             >
                                <span className="font-semibold text-sm">{type}</span>
                             </div>
                          ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className={cn("mb-4 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                        Budget per Night: <span className="text-blue-500">${pricePerNight}</span>
                      </Label>
                      <Slider
                        value={[pricePerNight]}
                        onValueChange={([val]) => setPricePerNight(val)}
                        min={50}
                        max={1000}
                        step={50}
                        className="py-4"
                      />
                       <div className="flex justify-between text-xs font-medium opacity-60 mt-1">
                        <span>$50</span>
                        <span>$1000+</span>
                      </div>
                    </div>
                 </div>
              )}

              {questionnaireStep === 3 && (
                 <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                         <Map className="size-5 text-indigo-500" />
                         Trip Logistics
                      </h3>
                      
                      <div className="space-y-4">
                         <div>
                            <Label className={cn("mb-2 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                               Where are you going?
                            </Label>
                             <div className="flex gap-2">
                                <Input
                                  placeholder="Destination City/Country"
                                  value={destination}
                                  onChange={(e) => setDestination(e.target.value)}
                                  disabled={surpriseMe}
                                  className={cn("h-12 rounded-xl flex-1", inputClass)}
                                />
                                 <button
                                    onClick={() => {
                                        setSurpriseMe(!surpriseMe);
                                        if (!surpriseMe) setDestination("");
                                    }}
                                    className={cn(
                                        "px-4 rounded-xl border flex flex-col items-center justify-center min-w-[80px]",
                                        surpriseMe 
                                          ? (isDarkMode ? "bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400" : "bg-fuchsia-500/10 border-fuchsia-500 text-fuchsia-600")
                                          : (isDarkMode ? "bg-white/5 border-white/10" : "bg-white/40 border-white/20")
                                    )}
                                 >
                                    <Sparkles className="size-4 mb-1" />
                                    <span className="text-[10px] font-bold uppercase">Surprise</span>
                                 </button>
                             </div>
                         </div>
                         
                         <div>
                            <Label className={cn("mb-2 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                               Departing From
                            </Label>
                              <Input
                                  placeholder="Origin City"
                                  value={departureLocation}
                                  onChange={(e) => setDepartureLocation(e.target.value)}
                                  className={cn("h-12 rounded-xl", inputClass)}
                              />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <Label className={cn("mb-2 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                                  Start Date
                               </Label>
                               <Input type="date" className={cn("h-12 rounded-xl", inputClass)} 
                                  onChange={(e) => setTripDates(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : undefined }))}
                               />
                            </div>
                             <div>
                               <Label className={cn("mb-2 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                                  End Date
                               </Label>
                               <Input type="date" className={cn("h-12 rounded-xl", inputClass)} 
                                  onChange={(e) => setTripDates(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : undefined }))}
                               />
                            </div>
                         </div>
                      </div>
                    </div>

                    <div>
                        <Label className={cn("mb-3 block font-semibold", isDarkMode ? "text-slate-300" : "text-slate-700")}>
                            Travelers
                        </Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5, "6+"].map((num) => (
                             <button
                                key={num}
                                onClick={() => setNumberOfTravelers(typeof num === 'string' ? 6 : num)}
                                className={cn(
                                   "flex-1 h-12 rounded-xl border font-bold text-lg",
                                   numberOfTravelers === (typeof num === 'string' ? 6 : num)
                                    ? (isDarkMode 
                                        ? "bg-blue-500/20 border-blue-500 text-blue-400" 
                                        : "bg-blue-500/10 border-blue-500 text-blue-600")
                                    : (isDarkMode 
                                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-slate-400" 
                                        : "bg-white/40 border-white/20 hover:bg-white/50 text-slate-600")
                                )}
                             >
                                {num}
                             </button>
                          ))}
                        </div>
                    </div>
                 </div>
              )}

             {/* Navigation Buttons */}
             <div className="flex gap-4 mt-8">
                {questionnaireStep === 1 ? (
                   <button 
                      onClick={() => setAppState("swiping")}
                      className={cn(
                         "flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95",
                         isDarkMode ? "bg-white/5 text-white hover:bg-white/10" : "bg-white/40 text-slate-800 hover:bg-white/50"
                      )}
                   >
                      <ChevronLeft className="size-5" /> Back
                   </button>
                ) : (
                   <button 
                      onClick={() => setQuestionnaireStep(prev => prev - 1)}
                      className={cn(
                         "flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95",
                         isDarkMode ? "bg-white/5 text-white hover:bg-white/10" : "bg-white/40 text-slate-800 hover:bg-white/50"
                      )}
                   >
                      <ChevronLeft className="size-5" /> Previous
                   </button>
                )}

                {questionnaireStep < 3 ? (
                   <button 
                      onClick={() => setQuestionnaireStep(prev => prev + 1)}
                      className={cn(
                         "flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-white shadow-lg",
                         primaryGradientButton
                      )}
                   >
                      Next Step <ChevronRight className="size-5" />
                   </button>
                ) : (
                   <button 
                      onClick={handleGenerateItinerary}
                      disabled={(!tripDates.from || !tripDates.to || !departureLocation.trim() || (!surpriseMe && !destination.trim()))}
                      className={cn(
                         "flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                         primaryGradientButton
                      )}
                   >
                      {isGenerating ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
                      Generate Itinerary
                   </button>
                )}
             </div>

          </div>
        </div>
        </div>
      </SafeAreaWrapper>
    </div>
  );
}
