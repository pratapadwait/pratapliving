import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { PropertyTypesSection } from "@/components/property-types-section";
import { FeaturedPropertiesSection } from "@/components/featured-properties-section";
import { WhyChooseUsSection } from "@/components/why-choose-us-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useJsonLd } from "@/hooks/use-json-ld";

const homepageSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": "https://www.pratapliving.com/#location-omaxe",
    "name": "Pratap Living | Luxe Studio Stays - Omaxe Hazratganj",
    "url": "https://www.pratapliving.com",
    "description": "Experience the best hotel in Lucknow for privacy and style at Pratap Living. Our boutique designer rooms in Omaxe Hazratganj offer the premier choice for hotels in Gomti Nagar Lucknow, featuring couple friendly hotels Lucknow standards with luxury studio stays. Ideally located in Arjunganj, Gomti Nagar Extension, we provide flexible stay options including luxury stays on an hourly basis near Ekana Stadium.",
    "telephone": "+917460985009",
    "priceRange": "₹2200 - ₹5000",
    "parentOrganization": {
      "@type": "Organization",
      "name": "Pratap Living",
      "url": "https://www.pratapliving.com",
      "sameAs": [
        "https://www.instagram.com/pratapliving/",
        "https://www.youtube.com/@pratapliving",
        "https://www.facebook.com/pratapliving"
      ]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Omaxe Hazratganj, Arjunganj (Gomti Nagar Extension)",
      "addressLocality": "Lucknow",
      "addressRegion": "UP",
      "postalCode": "226002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.8118525",
      "longitude": "80.9953619"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": "https://www.pratapliving.com/#location-golfcity",
    "name": "Pratap Living - The Villa and Homestay Golf City",
    "url": "https://www.pratapliving.com",
    "description": "Premium 6BHK private luxury villa and homestay in Sushant Golf City. Ideal for weddings, birthdays, get-togethers, families, parties, and group stays in Lucknow.",
    "telephone": "+917460985009",
    "priceRange": "₹15000 - ₹45000",
    "parentOrganization": {
      "@type": "Organization",
      "name": "Pratap Living",
      "url": "https://www.pratapliving.com",
      "sameAs": [
        "https://www.instagram.com/pratapliving/",
        "https://www.youtube.com/@pratapliving",
        "https://www.facebook.com/pratapliving"
      ]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sushant Golf City",
      "addressLocality": "Lucknow",
      "addressRegion": "UP",
      "postalCode": "226030",
      "addressCountry": "IN"
    }
  }
];

export default function Home() {
  useDocumentTitle(
    "Pratap Living | Premium Homestays, Suites & Villas in Lucknow",
    "Experience exceptional hospitality with Pratap Living. Discover premium homestays, suites, apartments, and villas in Lucknow. Book your perfect stay or partner with us."
  );
  useJsonLd(homepageSchema);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <PropertyTypesSection />
        <FeaturedPropertiesSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
