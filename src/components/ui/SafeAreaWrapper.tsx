import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SafeAreaWrapperProps {
  children: ReactNode;
  className?: string;
  includeTop?: boolean;
  includeBottom?: boolean;
  fullHeight?: boolean; // Use 100svh instead of 100%
}

const SafeAreaWrapper = ({
  children,
  className = "",
  includeTop = true,
  includeBottom = true,
  fullHeight = false,
}: SafeAreaWrapperProps) => {
  const wrapperClass = cn(
    fullHeight ? "h-[100svh]" : "h-full",
    "relative",
    className
  );

  const contentClass = cn(
    "w-full h-full",
    includeTop && "pt-[env(safe-area-inset-top)]",
    includeBottom && "pb-[env(safe-area-inset-bottom)]"
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