
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";

interface AnimatedButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: "default" | "shine" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ variant = "default", size = "default", children, className, ...props }, ref) => {
    // Convert "shine" variant to "default" for the base Button component
    const buttonVariant = variant === "shine" ? "default" : variant;
    
    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        size={size}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "hover:translate-y-[-2px] active:translate-y-[1px]",
          "hover:shadow-md",
          variant === "shine" && "shine-button",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;
