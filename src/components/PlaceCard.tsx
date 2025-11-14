import { Place } from "@/lib/sheet";
import { Card } from "@/components/ui/card";
import CategoryBadge from "./CategoryBadge";
import LinkifiedText from "./LinkifiedText";
import { MapPin } from "lucide-react";

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {place.image && (
        <img 
          src={place.image} 
          alt={place.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg">{place.name}</h3>
          <CategoryBadge category={place.category} />
        </div>
        
        {place.city && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4" />
            <span>{place.city}</span>
          </div>
        )}
        
        {place.description && (
          <p className="text-sm text-gray-700 line-clamp-2">
            <LinkifiedText text={place.description} />
          </p>
        )}
      </div>
    </Card>
  );
}
