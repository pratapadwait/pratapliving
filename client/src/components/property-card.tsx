import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { OptimizedImage } from "@/components/optimized-image";
import type { Property } from "@shared/schema";

import { PROPERTY_TYPE_IMAGES, PROPERTY_HOMESTAY } from "@/lib/imagekit-assets";

const fallbackImages = PROPERTY_TYPE_IMAGES;

function getPropertyImage(property: Property): string {
  const isValid = (url: string | null | undefined) =>
    url && (url.startsWith("/objects/") || url.startsWith("http"));
  if (isValid(property.imageUrl)) return property.imageUrl!;
  if (property.images) {
    const first = property.images.find(img => isValid(img));
    if (first) return first;
  }
  const firstType = property.type.split(",")[0]?.trim() || "homestay";
  return fallbackImages[firstType] || PROPERTY_HOMESTAY;
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = getPropertyImage(property);

  return (
    <Link href={`/properties/${property.slug || property.id}`}>
      <Card className="overflow-hidden hover-elevate transition-all duration-300 group cursor-pointer" data-testid={`card-property-${property.id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <OptimizedImage
            src={imageUrl}
            alt={property.name}
            className="w-full h-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-testid={`img-property-${property.id}`}
          />
          <div className="absolute inset-0 pointer-events-none" />
          {property.featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground z-10">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 flex flex-wrap gap-1 z-10">
            {property.type.split(",").map(t => t.trim()).filter(Boolean).map((t) => (
              <Badge key={t} variant="secondary" className="capitalize">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-1">
              {property.name}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{property.guests} Guests</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-t pt-4">
            <div>
              <span className="text-2xl font-bold text-primary">
                &#8377;{property.price.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-sm"> / night</span>
            </div>
            <Button variant="outline" size="sm" className="group/btn" data-testid={`button-view-${property.id}`}>
              View Details
              <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
