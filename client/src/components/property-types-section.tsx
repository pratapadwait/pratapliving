import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Building, Building2, Trees } from "lucide-react";
import { OptimizedImage } from "@/components/optimized-image";
import { PROPERTY_SUITE, PROPERTY_APARTMENT, PROPERTY_VILLA } from "@/lib/imagekit-assets";

const propertyTypes = [
  {
    type: "suite",
    name: "Executive Suites",
    description: "High-speed WiFi, Omaxe Hazratganj, 5 mins to Ekana Stadium, Pallasio Mall.",
    image: PROPERTY_SUITE,
    icon: Building,
  },
  {
    type: "apartment",
    name: "Luxe Studio Apartments",
    description: "Secure, couple-friendly studio in Gomti Nagar Extension.",
    image: PROPERTY_APARTMENT,
    icon: Building2,
  },
  {
    type: "villa",
    name: "Private Villas",
    description: "Grand spacious space near Purvanchal Expressway, 5min to Lulu Mall, ideal for parties.",
    image: PROPERTY_VILLA,
    icon: Trees,
  },
];

export function PropertyTypesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Pratap Living Collection: Luxury Stays in Lucknow
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            From sprawling 6BHK luxury villas in Sushant Golf City to executive penthouses in the heart of Gomti Nagar Extension, Pratap Living offers the highest-rated boutique hotels and private stays in Lucknow. Strategically located near Ekana Stadium, Medanta, and Lulu Mall, our collection is designed for travelers who refuse to compromise on privacy or luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {propertyTypes.map((propertyType) => {
            const Icon = propertyType.icon;
            return (
              <Link key={propertyType.type} href={`/properties?type=${propertyType.type}`}>
                <Card
                  className="overflow-hidden hover-elevate cursor-pointer group h-full"
                  data-testid={`card-type-${propertyType.type}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <OptimizedImage
                      src={propertyType.image}
                      alt={propertyType.name}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-white">
                          {propertyType.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-muted-foreground text-sm mb-4">
                      {propertyType.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:underline">
                      View Properties
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
