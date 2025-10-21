import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const netflixButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        netflix: "bg-netflix-red text-white shadow-netflix hover:bg-netflix-red/90 active:scale-95",
        "netflix-outline": "border border-netflix-red text-netflix-red bg-transparent hover:bg-netflix-red hover:text-white",
        secondary: "bg-netflix-gray text-white hover:bg-netflix-light-gray",
        ghost: "text-muted-foreground hover:bg-netflix-gray hover:text-white",
        hero: "bg-netflix-red text-white shadow-netflix hover:shadow-glow hover:scale-105 text-base font-semibold px-8 py-4",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "netflix",
      size: "default",
    },
  }
);

export interface NetflixButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof netflixButtonVariants> {
  asChild?: boolean;
}

const NetflixButton = React.forwardRef<HTMLButtonElement, NetflixButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(netflixButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NetflixButton.displayName = "NetflixButton";

export { NetflixButton, netflixButtonVariants };