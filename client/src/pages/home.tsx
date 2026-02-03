import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { PropertyTypesSection } from "@/components/property-types-section";
import { FeaturedPropertiesSection } from "@/components/featured-properties-section";
import { WhyChooseUsSection } from "@/components/why-choose-us-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Home() {
  useDocumentTitle(
    "Pratap Living | Premium Homestays, Suites & Villas in Lucknow",
    "Experience exceptional hospitality with Pratap Living. Discover premium homestays, suites, apartments, and villas in Lucknow. Book your perfect stay or partner with us."
  );

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
