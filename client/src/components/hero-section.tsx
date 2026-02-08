import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Star, MapPin, Shield } from "lucide-react";
import heroImage from "@/assets/images/hero-lucknow.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Lucknow cityscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>
      <div className="container mx-auto px-4 relative z-10 pt-[16px] pb-[16px]">
        <div className="max-w-3xl pt-16">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Experience Exceptional{" "}
            <span className="text-primary">Hospitality</span> in Lucknow
          </h1>

          <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl">
            Discover our curated collection of premium homestays, suites, apartments, and villas. Where luxury meets tradition in the heart of Lucknow.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/properties">
              <Button size="lg" className="group" data-testid="button-explore-properties">
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/partner">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white"
                data-testid="button-partner-hero"
              >
                Partner With Us
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold">15+</p>
                <p className="text-white/70 text-sm">Properties</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold">500+</p>
                <p className="text-white/70 text-sm">Happy Guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold">100%</p>
                <p className="text-white/70 text-sm">Company-Managed Stays</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
