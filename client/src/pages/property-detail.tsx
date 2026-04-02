import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OptimizedImage } from "@/components/optimized-image";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Property } from "@shared/schema";
import { Helmet } from "react-helmet-async";
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
  Phone,
  MapPinned,
  Heart,
  Landmark,
  Home,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

import { PROPERTY_TYPE_IMAGES, PROPERTY_HOMESTAY } from "@/lib/imagekit-assets";

const fallbackImages = PROPERTY_TYPE_IMAGES;

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

function getImageKitSrc(url: string, width: number, quality: number = 80): string {
  if (!url.includes("ik.imagekit.io")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}tr=w-${width},q-${quality},f-auto`;
}

function PhotoGallery({ images, propertyName }: { images: string[]; propertyName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [nextLoaded, setNextLoaded] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) return null;

  useEffect(() => {
    images.forEach((img) => {
      const preload = new Image();
      preload.src = getImageKitSrc(img, 1280);
    });
  }, [images]);

  useEffect(() => {
    if (currentIndex === displayIndex) return;
    const preload = new Image();
    preload.src = getImageKitSrc(images[currentIndex], 1280);
    preload.onload = () => {
      setNextLoaded(true);
    };
    if (preload.complete) {
      setNextLoaded(true);
    }
  }, [currentIndex, displayIndex, images]);

  useEffect(() => {
    if (nextLoaded && currentIndex !== displayIndex) {
      setDisplayIndex(currentIndex);
      setNextLoaded(false);
    }
  }, [nextLoaded, currentIndex, displayIndex]);

  const scrollThumbnailIntoView = (index: number) => {
    if (thumbnailContainerRef.current) {
      const thumb = thumbnailContainerRef.current.children[index] as HTMLElement;
      if (thumb) {
        thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

  const goTo = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    scrollThumbnailIntoView(index);
  };

  const goToPrev = () => {
    const newIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIdx);
    scrollThumbnailIntoView(newIdx);
  };

  const goToNext = () => {
    const newIdx = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIdx);
    scrollThumbnailIntoView(newIdx);
  };

  const mainSwipe = useSwipe(goToNext, goToPrev);

  const displaySrc = getImageKitSrc(images[displayIndex], 1280);

  return (
    <>
      <div className="relative">
        <div
          className="aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-md relative bg-muted"
          {...mainSwipe}
          data-testid="gallery-main-image"
        >
          <img
            src={displaySrc}
            alt={`${propertyName} - Photo ${displayIndex + 1}`}
            className="w-full h-full object-cover"
            decoding="async"
          />
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
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
              <img
                src={getImageKitSrc(img, 160)}
                alt={`${propertyName} - Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
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
  "luxe-studio-omaxe-hazratganj": {
    title: "Luxe Studio Stays in Omaxe Hazratganj Lucknow | Pratap Living",
    metaDescription: "Book a designer studio stay at Omaxe Hazratganj, Gomti Nagar Extension, Lucknow. Couple-friendly, private, and flexible hourly stays near Ekana Stadium. Call +917460985009.",
  },
};

const PROPERTY_MAPS: Record<string, string> = {
  "villa-homestay-golf-city": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56955.49880375895!2d80.9503807!3d26.8488988!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be598449e523f%3A0xbc372f2db9199fbe!2sPratap%20Living%20-%20The%20Villa%20and%20Homestay%20Golf%20City!5e0!3m2!1sen!2sin!4v1774929081742!5m2!1sen!2sin",
  "luxe-studio-omaxe-hazratganj": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.883042114598!2d80.99536187494394!3d26.81185246441857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be301f2925f53%3A0xaea797774f5019cb!2sPratap%20Living%20%7C%20Luxe%20Studio%20Stays%20-%20Omaxe%20Hazratganj!5e0!3m2!1sen!2sin!4v1774929285273!5m2!1sen!2sin",
};

const JSON_LD_SCHEMAS: Record<string, Record<string, unknown>> = {
  "villa-homestay-golf-city": {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": "https://www.pratapliving.com/#location-golfcity",
    "name": "Pratap Living - The Villa and Homestay Golf City",
    "description": "Premium 6BHK private luxury villa in Sushant Golf City. Ideal for weddings, families, and group stays. Couple-friendly and Local ID accepted.",
    "parentOrganization": { "@id": "https://www.pratapliving.com/#organization" },
    "url": "https://www.pratapliving.com/villa-homestay-golf-city",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pocket 7, Villa 23, Sushant Golf City",
      "addressLocality": "Lucknow",
      "addressRegion": "UP",
      "postalCode": "226030",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.7842783",
      "longitude": "81.0061884"
    },
    "numberOfRooms": "6",
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Couple Friendly", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Local ID Accepted", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Private Kitchen", "value": "true" }
    ],
    "checkinTime": "11:00:00",
    "checkoutTime": "10:00:00"
  },
  "luxe-studio-omaxe-hazratganj": {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": "https://www.pratapliving.com/#location-omaxe",
    "name": "Pratap Living | Luxe Studio Stays - Omaxe Hazratganj",
    "description": "Luxury boutique designer studio in Omaxe Hazratganj. Premier choice for couple-friendly hotels in Gomti Nagar Lucknow.",
    "parentOrganization": { "@id": "https://www.pratapliving.com/#organization" },
    "url": "https://www.pratapliving.com/luxe-studio-omaxe-hazratganj",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Omaxe Hazratganj, Arjunganj",
      "addressLocality": "Lucknow",
      "addressRegion": "UP",
      "postalCode": "226002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.8118521",
      "longitude": "80.9978897"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Couple Friendly", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Local ID Accepted", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "High-speed WiFi", "value": "true" }
    ],
    "checkinTime": "14:00:00",
    "checkoutTime": "11:00:00"
  }
};

const BREADCRUMB_SCHEMAS: Record<string, Record<string, unknown>> = {
  "villa-homestay-golf-city": {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.pratapliving.com/" },
      { "@type": "ListItem", "position": 2, "name": "Properties", "item": "https://www.pratapliving.com/properties" },
      { "@type": "ListItem", "position": 3, "name": "Private Villa at Golf City", "item": "https://www.pratapliving.com/villa-homestay-golf-city" }
    ]
  },
  "luxe-studio-omaxe-hazratganj": {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.pratapliving.com/" },
      { "@type": "ListItem", "position": 2, "name": "Properties", "item": "https://www.pratapliving.com/properties" },
      { "@type": "ListItem", "position": 3, "name": "Luxe Studio Stays at Omaxe Hazratganj", "item": "https://www.pratapliving.com/luxe-studio-omaxe-hazratganj" }
    ]
  },
};

function PropertyNotFound() {
  return (
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
  );
}

export default function PropertyDetail() {
  const [, propertiesParams] = useRoute("/properties/:id");
  const [matchesVilla] = useRoute("/villa-homestay-golf-city");
  const [matchesStudio] = useRoute("/luxe-studio-omaxe-hazratganj");
  const [, slugParams] = useRoute("/:slug");

  const propertyId = matchesVilla
    ? "villa-homestay-golf-city"
    : matchesStudio
    ? "luxe-studio-omaxe-hazratganj"
    : propertiesParams?.id ?? slugParams?.slug;

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ["/api/properties", propertyId],
    enabled: !!propertyId,
  });

  const isGolfCityVilla = propertyId === "villa-homestay-golf-city";
  const isLuxeStudio = propertyId === "luxe-studio-omaxe-hazratganj";
  const seoOverride = propertyId ? SEO_OVERRIDES[propertyId] : undefined;

  const pageTitle = seoOverride?.title || (property ? `${property.name} | Pratap Living` : "Property Details | Pratap Living");
  const pageDesc = seoOverride?.metaDescription || (property ? property.description.slice(0, 160) : "View property details and photos.");
  const pageJsonLd = propertyId ? JSON_LD_SCHEMAS[propertyId] ?? null : null;
  const breadcrumbJsonLd = propertyId ? BREADCRUMB_SCHEMAS[propertyId] ?? null : null;

  const isValidImage = (url: string | null | undefined) =>
    url && (url.startsWith("/objects/") || url.startsWith("http"));

  const allImages = property
    ? [
        ...(isValidImage(property.imageUrl) ? [property.imageUrl] : []),
        ...(property.images || []).filter((img) => img && img !== property.imageUrl),
      ]
    : [];

  if (allImages.length === 0 && property) {
    const firstType = property.type.split(",")[0]?.trim() || "homestay";
    allImages.push(fallbackImages[firstType] || PROPERTY_HOMESTAY);
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isLoading && !property) {
    return <PropertyNotFound />;
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        {propertyId === "villa-homestay-golf-city" && (
          <link rel="canonical" href="https://www.pratapliving.com/villa-homestay-golf-city" />
        )}
        {propertyId === "luxe-studio-omaxe-hazratganj" && (
          <link rel="canonical" href="https://www.pratapliving.com/luxe-studio-omaxe-hazratganj" />
        )}
        {pageJsonLd && (
          <script type="application/ld+json">{JSON.stringify(pageJsonLd)}</script>
        )}
        {breadcrumbJsonLd && (
          <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        )}
      </Helmet>
      <Navigation />
      <main className="pt-20 pb-28 lg:pb-16">
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
                    {property.type.split(",").map(t => t.trim()).filter(Boolean).map((t) => (
                      <Badge key={t} variant="secondary" className="capitalize" data-testid={`badge-property-type-${t}`}>
                        {t}
                      </Badge>
                    ))}
                    {property.featured && (
                      <Badge data-testid="badge-featured">Featured</Badge>
                    )}
                  </div>

                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2" data-testid="text-property-name">
                    {isGolfCityVilla
                      ? "Private Villa Stay at Golf City"
                      : propertyId === "luxe-studio-omaxe-hazratganj"
                      ? "Luxe Studio Apartments at Omaxe Hazratganj"
                      : property.name}
                  </h1>

                  <a
                    href={property.location.startsWith("http") ? property.location : `https://www.google.com/maps/search/${encodeURIComponent(property.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted-foreground mb-6 hover:text-primary transition-colors"
                    data-testid="link-property-location"
                  >
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm underline underline-offset-2" data-testid="text-property-location">
                      View on Google Maps
                    </span>
                  </a>

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
                        <h3 className="font-serif text-base font-semibold text-foreground mb-2">The Perfect Space for Your Entire Group</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Finding accommodation that keeps your entire group together without sacrificing comfort can be a challenge. Our private villa in Lucknow solves this by offering massive capacity with six spacious bedrooms and six bathrooms. For just ₹25,000 a night, your group can enjoy exclusive access to a premium property that feels like home. Whether you are looking for one of the best party places in Lucknow for a celebration, or searching for a quiet private retreat after a busy event, our villa offers the flexibility and space you need.
                        </p>
                      </div>
                    ) : isLuxeStudio ? (
                      <div data-testid="text-description">
                        <h3 className="font-serif text-base font-semibold text-foreground mb-2">Luxury Studio Stay in Lucknow</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Discover the ultimate Luxe Studio Apartment at Omaxe Hazratganj. Perfect for up to two guests, this premium 1-bedroom suite offers unparalleled privacy, modern amenities, and comfort in the heart of the city.
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
                              <p className="text-sm text-muted-foreground">Sushant Golf City, Lucknow — close to The Centrum, Lulu Mall, and Medanta Hospital.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Home className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Massive 6BHK+ Capacity</p>
                              <p className="text-sm text-muted-foreground">Comfortably hosts up to 16 guests with 6 spacious bedrooms and 6 bathrooms — the perfect shared base for any large group.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Close to Major Wedding Venues</p>
                              <p className="text-sm text-muted-foreground">Just minutes from The Centrum and Viviana Greens — skip cramped hotel rooms and give your family a shared luxurious space.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Landmark className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Near Shopping & Entertainment</p>
                              <p className="text-sm text-muted-foreground">Minutes from Lulu Mall, Pallasio Mall, and Ekana Stadium — a spacious alternative to standard hotel stays.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="sm:col-span-2">
                          <CardContent className="p-4 flex gap-3">
                            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Convenient Healthcare Access</p>
                              <p className="text-sm text-muted-foreground">A peaceful, private environment just a short drive from Medanta Hospital — ideal for those visiting loved ones or traveling for medical care.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {isLuxeStudio && (
                    <div className="mb-8" data-testid="section-studio-highlights">
                      <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Property Highlights</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Heart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Couple-Friendly & Private</p>
                              <p className="text-sm text-muted-foreground">Designed with your privacy in mind — one of the premier private places for couples in Lucknow, offering a safe and welcoming environment.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Home className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Premium Modern Amenities</p>
                              <p className="text-sm text-muted-foreground">1-bedroom suite with high-speed WiFi, AC, private balcony, dedicated workspace, and full kitchen access with microwave.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <Landmark className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Key Landmarks</p>
                              <p className="text-sm text-muted-foreground">Close to Ekana Stadium, Pallasio Mall, and Tender Palm Hospital in Gomti Nagar Extension.</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 flex gap-3">
                            <MapPinned className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-sm text-foreground">Unbeatable Value</p>
                              <p className="text-sm text-muted-foreground">At just ₹3,000 per night, a premium alternative to crowded hotels in Gomti Nagar — complete comfort, no rush.</p>
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
                          question="Where is the villa located?"
                          answer="The villa is in Sushant Golf City, Lucknow — close to The Centrum, Lulu Mall, and Medanta Hospital, offering easy access to key city attractions."
                        />
                        <FaqItem
                          index={1}
                          question="How many guests can the villa accommodate?"
                          answer="Our 6BHK+ luxury villa comfortably accommodates up to 16 guests, featuring 6 bedrooms and 6 bathrooms to ensure everyone has plenty of space and privacy."
                        />
                        <FaqItem
                          index={2}
                          question="What is the cost per night?"
                          answer="The entire villa is available for ₹25,000 per night, offering exceptional value for large groups compared to booking multiple separate hotel rooms."
                        />
                        <FaqItem
                          index={3}
                          question="Is the villa suitable for hosting events like Haldi, Mehndi, Sangeet, birthday, or anniversary parties?"
                          answer="Yes, the villa is ideal for Haldi, Mehndi, Sangeet, birthdays, and anniversary celebrations, with plenty of space for private parties and special events."
                        />
                        <FaqItem
                          index={4}
                          question="How do I check in and access the amenities?"
                          answer="Upon arrival, our on-site Pratap Living staff will welcome you, provide a tour of the property, and ensure you are connected to the WiFi and familiar with the kitchen and 24/7 cleaning services."
                        />
                        <FaqItem
                          index={5}
                          question="Can I book individual rooms instead of the entire Pratap Living villa?"
                          answer="Yes, you can book the villa per room as well, based on your group size and needs."
                        />
                      </div>
                    </div>
                  )}

                  {isGolfCityVilla && (
                    <div className="mt-8" data-testid="section-villa-how-to-book">
                      <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Secure Your Luxury Group Getaway</h2>
                      <div className="space-y-4">
                        {[
                          { step: "1", title: "Reach Out to Our Team", desc: "Call or message us directly at +91 7460985009 to check availability for your desired dates." },
                          { step: "2", title: "Secure Your Reservation", desc: "Lock in the entire villa for just ₹25,000 per night — exceptional value for groups of up to 16 guests." },
                          { step: "3", title: "Arrive & Enjoy", desc: "Our on-site staff will welcome you, walk you through the property, and ensure a completely stress-free stay." },
                        ].map(({ step, title, desc }) => (
                          <div key={step} className="flex gap-4 items-start">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {step}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">{title}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isLuxeStudio && (
                    <div className="mt-8" data-testid="section-studio-faqs">
                      <h2 className="font-serif text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
                      <div className="space-y-3">
                        <FaqItem
                          index={0}
                          question="Is the property suitable for couples looking for privacy?"
                          answer="Yes, it's a private, couple-friendly suite designed for comfort and safety."
                        />
                        <FaqItem
                          index={1}
                          question="Do you offer hourly room rates?"
                          answer="We offer only nightly rates at ₹3,000, not hourly bookings."
                        />
                        <FaqItem
                          index={2}
                          question="Where is the Luxe Studio located and what landmarks are nearby?"
                          answer="It's at Omaxe Hazratganj, Gomti Nagar Extension, close to Ekana Stadium, Pallasio Mall, and Tender Palm Hospital."
                        />
                        <FaqItem
                          index={3}
                          question="What amenities are included in the stay?"
                          answer="You get a 1-bedroom suite with WiFi, AC, balcony, workspace, kitchen, and microwave."
                        />
                        <FaqItem
                          index={4}
                          question="How do I check availability and book my stay?"
                          answer="Call or message us at +91 7460985009 to check availability and book."
                        />
                      </div>
                    </div>
                  )}

                  {isLuxeStudio && (
                    <div className="mt-8" data-testid="section-studio-how-to-book">
                      <h2 className="font-serif text-lg font-semibold text-foreground mb-4">How to Book Your Suite</h2>
                      <div className="space-y-4">
                        {[
                          { step: "1", title: "Reach Out to Our Team", desc: "Simply call or message us directly at +91 7460985009 to check availability for your desired dates." },
                          { step: "2", title: "Secure Your Reservation", desc: "Lock in your stay at our Luxe Studio Apartment for just ₹3,000 per night." },
                          { step: "3", title: "Enjoy Your Luxurious Getaway", desc: "Arrive at Omaxe Hazratganj and step into your pristine, fully furnished luxury studio stay." },
                        ].map(({ step, title, desc }) => (
                          <div key={step} className="flex gap-4 items-start">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {step}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-foreground">{title}</p>
                              <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {propertyId && PROPERTY_MAPS[propertyId] && (
                    <div className="mt-8" data-testid="section-property-map">
                      <h2 className="font-serif text-lg font-semibold text-foreground mb-3">Location</h2>
                      <div className="rounded-md overflow-hidden border h-72">
                        <iframe
                          src={PROPERTY_MAPS[propertyId]}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`${property.name} Location`}
                          data-testid="iframe-property-map"
                        ></iframe>
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
                          <span className="capitalize font-medium">{property.type.split(",").map(t => t.trim()).filter(Boolean).join(", ")}</span>
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
      </main>
      <Footer />

      {property && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t p-3 flex items-center justify-between gap-3" data-testid="mobile-booking-bar">
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="text-lg font-bold text-primary">&#8377;{property.price.toLocaleString()}</span>
            <span className="text-muted-foreground text-xs">/ night</span>
          </div>
          <a href="tel:+917460985009">
            <Button data-testid="button-mobile-call-to-book">
              <Phone className="h-4 w-4 mr-2" />
              Call to Book
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
