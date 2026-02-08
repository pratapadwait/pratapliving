import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Users, MapPin, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

import propertyHomestay from "@/assets/images/property-homestay.png";
import propertySuite from "@/assets/images/property-suite.png";
import propertyApartment from "@/assets/images/property-apartment.png";
import propertyVilla from "@/assets/images/property-villa.png";

const propertyImages: Record<string, string> = {
  homestay: propertyHomestay,
  suite: propertySuite,
  apartment: propertyApartment,
  villa: propertyVilla,
};

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl = propertyImages[property.type] || propertyHomestay;

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover-elevate transition-all duration-300 group cursor-pointer" data-testid={`card-property-${property.id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={imageUrl}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {property.featured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 capitalize"
          >
            {property.type}
          </Badge>
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif text-xl font-semibold text-foreground line-clamp-1">
              {property.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
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
