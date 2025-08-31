import { Star, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryBadge from "./CategoryBadge";

interface PlaceCardProps {
  place: {
    id: number;
    name: string;
    category: string;
    rating?: number;
    reviews?: number;
    image?: string;
    description: string;
    tags?: string[];
    city?: string;
    country?: string;
  };
  variant?: "grid" | "list";
  onClick?: () => void;
}

export function PlaceCardSkeleton({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Skeleton className="h-12 w-12 flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
}

export default function PlaceCard({ 
  place, 
  variant = "grid", 
  onClick 
}: PlaceCardProps) {
  if (variant === "list") {
    return (
      <Card 
        className="hover:shadow-soft transition-shadow cursor-pointer" 
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {place.image && (
              <div className="text-3xl flex-shrink-0">
                {place.image}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold truncate">{place.name}</h3>
                  {(place.city || place.country) && (
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>
                        {place.city}{place.city && place.country ? ", " : ""}{place.country}
                      </span>
                    </div>
                  )}
                </div>
                {place.rating && (
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{place.rating}</span>
                    {place.reviews && (
                      <span className="text-muted-foreground text-sm">({place.reviews})</span>
                    )}
                  </div>
                )}
              </div>
              <CategoryBadge category={place.category} className="mb-3" />
              <p className="text-muted-foreground mb-3 line-clamp-2">
                {place.description}
              </p>
              {place.tags && place.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {place.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="hover:shadow-travel transition-all cursor-pointer group" 
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          {place.image && (
            <div className="text-4xl group-hover:scale-110 transition-transform">
              {place.image}
            </div>
          )}
          {place.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{place.rating}</span>
              {place.reviews && (
                <span className="text-muted-foreground">({place.reviews})</span>
              )}
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{place.name}</CardTitle>
        {(place.city || place.country) && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>
              {place.city}{place.city && place.country ? ", " : ""}{place.country}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <CategoryBadge category={place.category} className="mb-3" />
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {place.description}
        </p>
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {place.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          Visualizza dettagli
        </Button>
      </CardContent>
    </Card>
  );
}
