import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/optimized-image";
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
  Expand,
  MapPinned,
  Heart,
  Landmark,
  Home,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

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

function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX < 0) onSwipeLeft();
      else onSwipeRight();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }, [onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchEnd };
}

function PhotoGallery({ images, propertyName }: { images: string[]; propertyName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  const animateTransition = (newIndex: number, setter: (i: number) => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setter(newIndex);
      setIsTransitioning(false);
    }, 150);
  };

  const goTo = (index: number) => {
    if (index === currentIndex) return;
    animateTransition(index, setCurrentIndex);
    scrollThumbnailIntoView(index);
  };

  const goToPrev = () => {
    const newIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    animateTransition(newIdx, setCurrentIndex);
    scrollThumbnailIntoView(newIdx);
  };

  const goToNext = () => {
    const newIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    animateTransition(newIdx, setCurrentIndex);
    scrollThumbnailIntoView(newIdx);
  };

  const scrollThumbnailIntoView = (index: number) => {
    if (thumbnailContainerRef.current) {
      const thumb = thumbnailContainerRef.current.children[index] as HTMLElement;
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxPrev = () => {
    const newIdx = lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1;
    animateTransition(newIdx, setLightboxIndex);
  };

  const lightboxNext = () => {
    const newIdx = lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1;
    animateTransition(newIdx, setLightboxIndex);
  };

  const mainSwipe = useSwipe(goToNext, goToPrev);
  const lightboxSwipe = useSwipe(lightboxNext, lightboxPrev);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") lightboxPrev();
      else if (e.key === "ArrowRight") lightboxNext();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, lightboxIndex]);

  return (
    <>
      <div className="relative">
        <div
          className="aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-md cursor-pointer relative"
          onClick={() => openLightbox(currentIndex)}
          {...mainSwipe}
          data-testid="gallery-main-image"
        >
          <OptimizedImage
            src={images[currentIndex]}
            alt={`${propertyName} - Photo ${currentIndex + 1}`}
            className={`w-full h-full transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            loading="eager"
          />
          <div className="absolute bottom-3 right-3">
            <Button size="icon" variant="secondary" className="rounded-full opacity-80" data-testid="button-expand-gallery">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-80"
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              data-testid="button-gallery-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-80"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
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
        <div
          ref={thumbnailContainerRef}
          className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin"
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                i === currentIndex ? "border-primary ring-1 ring-primary/30" : "border-transparent opacity-70"
              }`}
              data-testid={`button-thumbnail-${i}`}
            >
              <OptimizedImage
                src={img}
                alt={`${propertyName} - Thumbnail ${i + 1}`}
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95">
          <div
            className="relative flex items-center justify-center h-[90vh]"
            {...lightboxSwipe}
          >
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
              className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
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

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-md" data-testid={`faq-item-${index}`}>
      <button
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`button-faq-toggle-${index}`}
      >
        <span className="font-medium text-sm text-foreground">{question}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

const SEO_OVERRIDES: Record<string, { title: string; metaDescription: string }> = {
  "villa-homestay-golf-city": {
    title: "6BHK+ Luxury Villa in Sushant Golf City Lucknow | Pratap Living",
    metaDescription: "Book the premier 6BHK+ villa in Sushant Golf City, Lucknow. Perfect for wedding guests at The Centrum & Viviana Greens. Managed by Pratap Adwait Singh. Call +917460985009.",
  },
};

export default function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const propertyId = params?.id;

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ["/api/properties", propertyId],
    enabled: !!propertyId,
  });

  const isGolfCityVilla = propertyId === "villa-homestay-golf-city";
  const seoOverride = propertyId ? SEO_OVERRIDES[propertyId] : undefined;

  useDocumentTitle(
    seoOverride?.title || (property ? `${property.name} | Pratap Living` : "Property Details | Pratap Living"),
    seoOverride?.metaDescription || (property ? property.description.slice(0, 160) : "View property details and photos.")
  );

  const isValidImage = (url: string | null | undefined) =>
    url && (url.startsWith("/objects/") || url.startsWith("http"));

  const allImages = property
    ? [
        ...(isValidImage(property.imageUrl) ? [property.imageUrl] : []),
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
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-md shrink-0" />
              ))}
            </div>
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
                    {isGolfCityVilla ? "Pratap Living | The Villa and Homestay - Golf City" : property.name}
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
                    {isGolfCityVilla ? (
                      <div data-testid="text-description">
                        <h3 className="font-serif text-base font-semibold text-foreground mb-2">Experience the Grandeur of Lucknow's Premier 6BHK+ Villa</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Welcome to a space where luxury meets the comfort of home. Located in the serene and elite neighborhood of Sushant Golf City, our signature 6BHK+ Luxury Villa is the ultimate destination for those who refuse to settle for cramped hotel rooms. Whether you are in the city for a grand wedding, a family reunion, or a premium corporate offsite, we provide the space and sophistication you need.
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                        {property.description}
                      </p>
                    )}
                  </div>

                  {isGolfCityVilla && (
                    <div className="mb-8" data-testid="section-property-highlights">
                      <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Property Highlights</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <MapPinned className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Location</p>
                              <p className="text-sm text-muted-foreground">Sushant Golf City, Lucknow (Near Shaheed Path)</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Best For</p>
                              <p className="text-sm text-muted-foreground">Wedding guest accommodation, large family get-togethers, and corporate retreats.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Landmark className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Key Landmarks</p>
                              <p className="text-sm text-muted-foreground">5 mins to The Centrum | 7 mins to Lulu Mall | 10 mins to Medanta Hospital.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Home className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Massive 6BHK+ Capacity</p>
                              <p className="text-sm text-muted-foreground">Designed specifically for large groups, our villa allows up to 15+ guests to stay together under one roof, making it the perfect "Baraat" base or family headquarters.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="sm:col-span-2">
                          <CardContent className="p-4 flex gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Prime Wedding Proximity</p>
                              <p className="text-sm text-muted-foreground">Located just a 5-minute drive from The Centrum and Viviana Greens, and minutes away from Imperial Grand Lawn and The Palms.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

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

                  {isGolfCityVilla && (
                    <div className="mt-8" data-testid="section-faqs">
                      <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                      <div className="space-y-3">
                        <FaqItem
                          index={0}
                          question="Is there a villa for 15+ guests near The Centrum Lucknow?"
                          answer="Yes, the Pratap Living 6BHK+ Villa in Sushant Golf City is specifically designed for large groups and is located within 5 minutes of The Centrum and Viviana Greens."
                        />
                        <FaqItem
                          index={1}
                          question="Can we book the entire villa or individual rooms?"
                          answer="We offer flexible occupancy. You can book the entire 6BHK+ Villa for total privacy or opt for individual luxury rooms depending on your group size."
                        />
                        <FaqItem
                          index={2}
                          question="How do I get the best rates for the Golf City Villa?"
                          answer="For direct booking discounts and group packages, contact Pratap Adwait Singh at +917460985009 or book via pratapliving.com."
                        />
                      </div>
                    </div>
                  )}
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
