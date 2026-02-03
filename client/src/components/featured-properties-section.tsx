import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Property } from "@shared/schema";

export function FeaturedPropertiesSection() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const featuredProperties = properties?.filter((p) => p.featured).slice(0, 4) || [];

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Properties
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Handpicked properties offering exceptional experiences and premium amenities.
            </p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="group" data-testid="button-view-all-properties">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading featured properties...</p>
          </div>
        )}
      </div>
    </section>
  );
}
