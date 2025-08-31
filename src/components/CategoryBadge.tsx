
import { Badge } from "@/components/ui/badge";
import CategoryIcon, { normalizeCategory } from "./CategoryIcon";

interface CategoryBadgeProps {
  category?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig = {
  sm: { iconSize: 12, className: "text-xs px-2 py-0.5" },
  md: { iconSize: 16, className: "text-sm px-2.5 py-0.5" },
  lg: { iconSize: 18, className: "text-base px-3 py-1" },
};

export default function CategoryBadge({
  category,
  variant = "secondary",
  size = "md",
  className,
}: CategoryBadgeProps) {
  const normalizedCategory = normalizeCategory(category);
  const config = sizeConfig[size];
  
  // Traduzioni per le categorie
  const categoryLabels: Record<string, string> = {
    cafe: "Caffè",
    restaurant: "Ristorante",
    museum: "Museo",
    park: "Parco",
    bar: "Bar",
    hotel: "Hotel",
    shop: "Negozio",
    viewpoint: "Panorama",
    beach: "Spiaggia",
    other: "Altro",
  };

  const displayName = categoryLabels[normalizedCategory] || category || "Altro";

  return (
    <Badge 
      variant={variant} 
      className={`inline-flex items-center gap-1.5 ${config.className} ${className || ""}`}
    >
      <CategoryIcon 
        category={category} 
        size={config.iconSize} 
      />
      {displayName}
    </Badge>
  );
}
