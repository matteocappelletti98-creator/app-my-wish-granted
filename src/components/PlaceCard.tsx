import React from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryBadge from "./CategoryBadge";
import type { Place } from "@/lib/sheet";

type PlaceCardProps = {
  p: Place;
  variant?: "grid" | "list";
  onClick?: () => void;
  onCategoryClick?: (category?: string) => void;
};

/* ───────── Skeleton ───────── */
export function PlaceCardSkeleton({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-20" />
        </div>
      </CardHeader>
      <CardContent className="pt-3 space-y-3">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}

/* ───────── Card ───────── */
export default function PlaceCard({
  p,
  variant = "grid",
  onClick,
  onCategoryClick,
}: PlaceCardProps) {
  if (variant === "list") {
    return (
      <Card className="hover:shadow-soft transition-shadow cursor-pointer" onClick={onClick}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">
                📍
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-semibold truncate">{p.name}</h3>
              </div>

              {(p.city || p.country) && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>
                    {p.city}
                    {p.city && p.country ? ", " : ""}
                    {p.country}
                  </span>
                </div>
              )}

              <div className="mt-2">
                <CategoryBadge category={p.category} />
              </div>

              <p className="text-muted-foreground mt-3 line-clamp-2">{p.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // variant = "grid"
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl opacity-70">📍</div>
        )}

        {/* Emoji/badge cliccabile → filtro categoria */}
        <div className="absolute left-3 top-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCategoryClick?.(p.category);
            }}
            aria-label={`Vedi categoria ${p.category ?? "tutte"}`}
            className="rounded-full shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Filtra per categoria"
          >
            <CategoryBadge category={p.category} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{p.name}</h3>
        <p className="text-sm text-gray-500">
          {p.city}
          {p.city && p.country ? ", " : ""}
          {p.country}
        </p>
        <p className="mt-2 text-gray-700 line-clamp-2">{p.description}</p>
      </div>
    </article>
  );
}