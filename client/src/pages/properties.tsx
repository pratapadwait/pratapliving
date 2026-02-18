import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import type { Property } from "@shared/schema";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Properties() {
  useDocumentTitle(
    "Our Properties | Pratap Living - Premium Stays in Lucknow",
    "Browse our curated collection of premium homestays, suites, apartments, and villas in Lucknow. Find your perfect accommodation."
  );
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialType = params.get("type") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(initialType);
  const [priceRange, setPriceRange] = useState("all");

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    return properties.filter((property) => {
      const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const types = property.type.split(",").map(t => t.trim()).filter(Boolean);
      const matchesType = selectedType === "all" || types.includes(selectedType);
      
      let matchesPrice = true;
      if (priceRange === "budget") {
        matchesPrice = property.price <= 3000;
      } else if (priceRange === "mid") {
        matchesPrice = property.price > 3000 && property.price <= 8000;
      } else if (priceRange === "luxury") {
        matchesPrice = property.price > 8000;
      }
      
      return matchesSearch && matchesType && matchesPrice;
    });
  }, [properties, searchQuery, selectedType, priceRange]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Properties
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover our curated collection of premium stays in Lucknow.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-type">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="homestay">Homestay</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48" data-testid="select-price">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="budget">Under &#8377;3,000</SelectItem>
                <SelectItem value="mid">&#8377;3,000 - &#8377;8,000</SelectItem>
                <SelectItem value="luxury">Above &#8377;8,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search filters to find more properties.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setPriceRange("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {!isLoading && filteredProperties.length > 0 && (
            <div className="mt-8 text-center text-muted-foreground">
              Showing {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
