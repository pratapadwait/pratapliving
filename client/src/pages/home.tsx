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

const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LodgingBusiness",
      "@id": "https://pratapliving.com/#business",
      "name": "Pratap Living",
      "alternateName": "Pratap Living Premium Stays",
      "description": "Premium homestays, suites, apartments, and villas in Lucknow, India. Experience exceptional hospitality with Pratap Living — curated stays for discerning travellers.",
      "url": "https://pratapliving.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ik.imagekit.io/livincompany/pratapliving-com/site/logo.png",
        "width": 200,
        "height": 60
      },
      "image": "https://ik.imagekit.io/livincompany/pratapliving-com/site/hero-bg.jpg",
      "telephone": "+91-XXXXXXXXXX",
      "email": "stay@pratapliving.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lucknow",
        "addressRegion": "Uttar Pradesh",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "26.8467",
        "longitude": "80.9462"
      },
      "areaServed": {
        "@type": "City",
        "name": "Lucknow"
      },
      "priceRange": "₹₹₹",
      "starRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Pratap Living Stays",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "LodgingBusiness",
              "name": "Premium Homestays"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "LodgingBusiness",
              "name": "Luxury Suites"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "LodgingBusiness",
              "name": "Service Apartments"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "LodgingBusiness",
              "name": "Private Villas"
            }
          }
        ]
      },
      "sameAs": [
        "https://www.instagram.com/pratapliving",
        "https://www.facebook.com/pratapliving"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://pratapliving.com/#website",
      "url": "https://pratapliving.com",
      "name": "Pratap Living",
      "description": "Premium homestays, suites, apartments, and villas in Lucknow, India.",
      "publisher": {
        "@id": "https://pratapliving.com/#business"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://pratapliving.com/properties?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://pratapliving.com/#webpage",
      "url": "https://pratapliving.com",
      "name": "Pratap Living | Premium Homestays, Suites & Villas in Lucknow",
      "description": "Experience exceptional hospitality with Pratap Living. Discover premium homestays, suites, apartments, and villas in Lucknow. Book your perfect stay or partner with us.",
      "isPartOf": {
        "@id": "https://pratapliving.com/#website"
      },
      "about": {
        "@id": "https://pratapliving.com/#business"
      },
      "inLanguage": "en-IN"
    }
  ]
};

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
