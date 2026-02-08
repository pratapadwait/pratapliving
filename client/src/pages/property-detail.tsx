import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Property } from "@shared/schema";
import { useDocumentTitle } from "@/hooks/use-document-title";
import {
  ArrowLeft,
  Bed,
  Bath,
  Users,
  MapPin,
  Wifi,
  Car,
  Wind,
  Utensils,
  Tv,
  WashingMachine,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
} from "lucide-react";
import { useState } from "react";

import propertyHomestay from "@/assets/images/property-homestay.png";
import propertySuite from "@/assets/images/property-suite.png";
import propertyApartment from "@/assets/images/property-apartment.png";
import propertyVilla from "@/assets/images/property-villa.png";

const fallbackImages: Record<string, string> = {
  homestay: propertyHomestay,
  suite: propertySuite,
  apartment: propertyApartment,
  villa: propertyVilla,
};

const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  parking: Car,
  ac: Wind,
  kitchen: Utensils,
  tv: Tv,
  laundry: WashingMachine,
};

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  for (const [key, Icon] of Object.entries(amenityIcons)) {
    if (lower.includes(key)) return Icon;
  }
  return Shield;
}

function PhotoGallery({ images, propertyName }: { images: string[]; propertyName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (images.length === 0) return null;

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative">
        <div
          className="aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-md cursor-pointer"
          onClick={() => openLightbox(currentIndex)}
          data-testid="gallery-main-image"
        >
          <img
            src={images[currentIndex]}
            alt={`${propertyName} - Photo ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>

        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-80"
              onClick={goToPrev}
              data-testid="button-gallery-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-80"
              onClick={goToNext}
              data-testid="button-gallery-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-colors ${
                i === currentIndex ? "border-primary" : "border-transparent"
              }`}
              data-testid={`button-thumbnail-${i}`}
            >
              <img
                src={img}
                alt={`${propertyName} - Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95">
          <div className="relative flex items-center justify-center h-[90vh]">
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 z-10 text-white"
              onClick={() => setLightboxOpen(false)}
              data-testid="button-lightbox-close"
            >
              <X className="h-5 w-5" />
            </Button>

            <img
              src={images[lightboxIndex]}
              alt={`${propertyName} - Photo ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white rounded-full"
                  onClick={lightboxPrev}
                  data-testid="button-lightbox-prev"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white rounded-full"
                  onClick={lightboxNext}
                  data-testid="button-lightbox-next"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                  {lightboxIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const propertyId = params?.id;

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  useDocumentTitle(
    property ? `${property.name} | Pratap Living` : "Property Details | Pratap Living",
    property ? property.description.slice(0, 160) : "View property details and photos."
  );

  const allImages = property
    ? [
        property.imageUrl,
        ...(property.images || []).filter((img) => img && img !== property.imageUrl),
      ]
    : [];

  if (allImages.length === 0 && property) {
    allImages.push(fallbackImages[property.type] || fallbackImages.homestay);
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-16">
        {isLoading ? (
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-6 mt-4" />
            <Skeleton className="aspect-[4/3] md:aspect-[16/9] rounded-md mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-6" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error || !property ? (
          <div className="container mx-auto px-4 text-center py-20">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Link href="/properties">
              <Button data-testid="button-back-to-properties">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="container mx-auto px-4">
            <Link href="/properties">
              <Button variant="ghost" className="mb-4 -ml-2 mt-2" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <PhotoGallery images={allImages} propertyName={property.name} />

                <div className="mt-6">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary" className="capitalize" data-testid="badge-property-type">
                      {property.type}
                    </Badge>
                    {property.featured && (
                      <Badge data-testid="badge-featured">Featured</Badge>
                    )}
                  </div>

                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2" data-testid="text-property-name">
                    {property.name}
                  </h1>

                  <div className="flex items-center gap-1.5 text-muted-foreground mb-6">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm" data-testid="text-property-location">{property.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bed className="h-4 w-4" />
                      <span data-testid="text-bedrooms">{property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bath className="h-4 w-4" />
                      <span data-testid="text-bathrooms">{property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span data-testid="text-guests">Up to {property.guests} Guests</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="font-serif text-lg font-semibold text-foreground mb-3">About this property</h2>
                    <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                      {property.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {property.amenities.map((amenity) => {
                        const Icon = getAmenityIcon(amenity);
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                            data-testid={`amenity-${amenity.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <Icon className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-sm text-foreground">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-24">
                  <Card>
                    <CardContent className="p-5">
                      <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-primary" data-testid="text-price">
                            &#8377;{property.price.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground text-sm">/ night</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-5 text-sm">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Property type</span>
                          <span className="capitalize font-medium">{property.type}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Bedrooms</span>
                          <span className="font-medium">{property.bedrooms}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Bathrooms</span>
                          <span className="font-medium">{property.bathrooms}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Max guests</span>
                          <span className="font-medium">{property.guests}</span>
                        </div>
                      </div>

                      <a href="tel:+917460985009" className="block w-full">
                        <Button className="w-full" data-testid="button-contact-property">
                          <Phone className="h-4 w-4 mr-2" />
                          Call to Book
                        </Button>
                      </a>

                      <p className="text-xs text-muted-foreground text-center mt-3">
                        Call us at +91 7460985009 to book this property
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
