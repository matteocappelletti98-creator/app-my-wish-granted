
import { 
  TreePine, 
  Utensils, 
  Building, 
  Mountain, 
  Waves, 
  Camera, 
  ShoppingBag,
  MapPin,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CategoryType = 
  | "nature" 
  | "restaurants" 
  | "monuments" 
  | "mountains" 
  | "beaches" 
  | "photo-spots" 
  | "shopping"
  | "default";

interface CategoryIconProps {
  category: CategoryType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const categoryConfig: Record<CategoryType, { icon: LucideIcon; color: string }> = {
  nature: { icon: TreePine, color: "text-nature-green" },
  restaurants: { icon: Utensils, color: "text-sunset-orange" },
  monuments: { icon: Building, color: "text-earth-brown" },
  mountains: { icon: Mountain, color: "text-nature-green" },
  beaches: { icon: Waves, color: "text-ocean-blue" },
  "photo-spots": { icon: Camera, color: "text-accent" },
  shopping: { icon: ShoppingBag, color: "text-sunset-orange" },
  default: { icon: MapPin, color: "text-muted-foreground" },
};

const sizeConfig = {
  sm: "h-4 w-4",
  md: "h-5 w-5", 
  lg: "h-6 w-6",
};

export const CategoryIcon = ({ 
  category, 
  size = "md", 
  className 
}: CategoryIconProps) => {
  const config = categoryConfig[category] || categoryConfig.default;
  const Icon = config.icon;
  
  return (
    <Icon 
      className={cn(
        sizeConfig[size],
        config.color,
        className
      )} 
    />
  );
};
