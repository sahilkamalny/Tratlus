import { cn } from "@/lib/utils";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import { Loader2 } from "lucide-react";

interface LoadingPageProps {
  isDarkMode: boolean;
  pageBgClass: string;
  glassPanelClass: string;
}

export function LoadingPage({ isDarkMode, pageBgClass, glassPanelClass }: LoadingPageProps) {
  return (
    <div className={cn("h-[100svh] relative flex items-center justify-center overflow-hidden", pageBgClass)}>
      {/* Background Blobs - Extends into safe area notch */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
         <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 animate-pulse", isDarkMode ? "bg-fuchsia-500" : "bg-blue-500")} />
      </div>
      
      {/* Content with safe area padding */}
      <SafeAreaWrapper fullHeight={false} includeTop={true} includeBottom={true} className="h-full flex items-center justify-center p-4">
        <div className={cn("relative z-10 w-full max-w-md text-center p-8 rounded-3xl border backdrop-blur-xl shadow-2xl space-y-6", glassPanelClass)}>
          <div className="relative mx-auto size-24 flex items-center justify-center">
            <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", isDarkMode ? "bg-fuchsia-500" : "bg-blue-600")} />
            <div className={cn("absolute inset-2 rounded-full animate-pulse opacity-40", isDarkMode ? "bg-fuchsia-500" : "bg-blue-600")} />
            <Loader2 className={cn("relative z-10 size-10 animate-spin", isDarkMode ? "text-white" : "text-blue-600")} />
          </div>
          
          <div>
            <h2 className={cn("text-2xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r", isDarkMode ? "from-white to-slate-400" : "from-slate-900 to-slate-600")}>
              Preparing...
            </h2>
            <p className={cn("font-medium", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              Loading your personalized adventure.
            </p>
          </div>
        </div>
      </SafeAreaWrapper>
    </div>
  );
}
