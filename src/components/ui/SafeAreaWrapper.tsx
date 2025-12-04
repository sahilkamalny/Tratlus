import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SafeAreaWrapperProps {
  children: ReactNode;
  className?: string;
  includeTop?: boolean;
  includeBottom?: boolean;
  fullHeight?: boolean; // Use 100svh instead of 100%
  respectPWA?: boolean; // Whether to respect PWA standalone mode and skip safe areas when in PWA
}

const SafeAreaWrapper = ({
  children,
  className = "",
  includeTop = true,
  includeBottom = true,
  fullHeight = false,
  respectPWA = true, // Default to respecting PWA mode
}: SafeAreaWrapperProps) => {
  // Check if running in PWA standalone mode
  const isStandalone = typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
     (window.navigator as any).standalone === true);

  // Only apply safe areas if not in PWA standalone mode (or if respectPWA is false)
  const shouldApplySafeAreas = !respectPWA || !isStandalone;

  const wrapperClass = cn(
    fullHeight ?
      (respectPWA && isStandalone ? "h-[100dvh]" : "h-[100svh]")
      : "h-full",
    "relative",
    className
  );

  const contentClass = cn(
    "w-full h-full",
    shouldApplySafeAreas && includeTop && "pt-[env(safe-area-inset-top)]",
    shouldApplySafeAreas && includeBottom && "pb-[env(safe-area-inset-bottom)]"
  );

  return (
    <div className={wrapperClass}>
      <div className={contentClass}>
        {children}
      </div>
    </div>
  );
};

export default SafeAreaWrapper;