
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Sheet utilities
export const sheetSizes = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md", 
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  full: "sm:max-w-full"
} as const

export type SheetSize = keyof typeof sheetSizes

// Sheet animation helpers
export const sheetAnimations = {
  slideInFromLeft: "data-[state=open]:slide-in-from-left",
  slideInFromRight: "data-[state=open]:slide-in-from-right", 
  slideInFromTop: "data-[state=open]:slide-in-from-top",
  slideInFromBottom: "data-[state=open]:slide-in-from-bottom",
  slideOutToLeft: "data-[state=closed]:slide-out-to-left",
  slideOutToRight: "data-[state=closed]:slide-out-to-right",
  slideOutToTop: "data-[state=closed]:slide-out-to-top",
  slideOutToBottom: "data-[state=closed]:slide-out-to-bottom"
} as const

// Helper function to get sheet classes
export function getSheetClasses(size: SheetSize = "md") {
  return cn(
    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out",
    "data-[state=open]:animate-in data-[state=closed]:animate-out", 
    "data-[state=closed]:duration-300 data-[state=open]:duration-500",
    sheetSizes[size]
  )
}

// Sheet content helpers
export function createSheetContent(title: string, description?: string) {
  return {
    title,
    description,
    timestamp: new Date().toISOString()
  }
}
