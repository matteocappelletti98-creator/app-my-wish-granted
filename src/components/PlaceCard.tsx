
import React from "react";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryBadge from "./CategoryBadge";
import type { Place } from "@/lib/sheet";

interface PlaceCardProps {
  place: Place;
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
              </div>
              <CategoryBadge category={place.category} />
              <p className="text-muted-foreground mb-3 line-clamp-2 mt-3">
                {place.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {place.image ? (
          <img
            src={place.image}
            alt={place.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl opacity-70">📍</div>
        )}
        <div className="absolute left-3 top-3">
          <CategoryBadge category={place.category} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{place.name}</h3>
        <p className="text-sm text-gray-500">
          {place.city}{place.city && place.country ? ", " : ""}{place.country}
        </p>
        <p className="mt-2 text-gray-700 line-clamp-2">{place.description}</p>
      </div>
    </article>
  );
}
