
import React from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassmorphicCard = React.forwardRef<HTMLDivElement, GlassmorphicCardProps>(
  ({ children, className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card",
          hover && "hover:shadow-lg hover:translate-y-[-4px] cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassmorphicCard.displayName = "GlassmorphicCard";

export default GlassmorphicCard;
