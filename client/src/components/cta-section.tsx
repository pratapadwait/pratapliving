import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Home, TrendingUp, Users } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Partner With Pratap Living
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8 leading-relaxed">
              Own a property in Lucknow? Join our growing network of premium rental properties. We handle everything from marketing to guest management, while you earn steady income.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Home className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="text-primary-foreground font-semibold">List for Free</p>
                <p className="text-primary-foreground/70 text-sm">No upfront costs</p>
              </div>
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="text-primary-foreground font-semibold">Maximize Earnings</p>
                <p className="text-primary-foreground/70 text-sm">Optimized pricing</p>
              </div>
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
                <p className="text-primary-foreground font-semibold">Full Support</p>
                <p className="text-primary-foreground/70 text-sm">We manage it all</p>
              </div>
            </div>

            <Link href="/partner">
              <Button
                size="lg"
                variant="secondary"
                className="group"
                data-testid="button-partner-cta"
              >
                Become a Partner
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-6">
                  Partner Benefits
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-sm font-semibold">1</span>
                    </div>
                    <span className="text-primary-foreground/90">Professional property photography and listing creation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-sm font-semibold">2</span>
                    </div>
                    <span className="text-primary-foreground/90">Dynamic pricing optimization for maximum occupancy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-sm font-semibold">3</span>
                    </div>
                    <span className="text-primary-foreground/90">Complete guest management and support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-sm font-semibold">4</span>
                    </div>
                    <span className="text-primary-foreground/90">Regular maintenance coordination and quality checks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-sm font-semibold">5</span>
                    </div>
                    <span className="text-primary-foreground/90">Transparent earnings with monthly payouts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
