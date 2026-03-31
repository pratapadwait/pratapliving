import { Lock, Star, MapPin, Armchair, Key, Clock } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Privacy-First Legal Policy",
    description: "A zero-judgment, highly secure environment for all consenting adults. Your privacy is protected by clear, guest-friendly legal standards.",
  },
  {
    icon: Star,
    title: "Verified 4.9-Star Reputation",
    description: "Backed by 100+ five-star reviews in 90 days. We are the highest-rated boutique hotel alternative on Airbnb in Lucknow.",
  },
  {
    icon: MapPin,
    title: "Prime Lucknow Connectivity",
    description: "Strategically located within 5 mins of Ekana Stadium, Lulu Mall, and Phoenix Palassio for effortless travel.",
  },
  {
    icon: Armchair,
    title: "Designer Luxury Interiors",
    description: "Curated by Livin Company, our suites combine high-end aesthetics with the functional comfort of a premium home.",
  },
  {
    icon: Key,
    title: "Founder-Led Curation",
    description: "Managed directly by Pratap Adwait Singh & Samiksha Singh. No impersonal staff—just personalized, premium care.",
  },
  {
    icon: Clock,
    title: "Premium Hourly Stays",
    description: "Book our luxury suites on a flexible hourly basis for business layovers, quick refreshes, or a secure, private escape in the heart of Lucknow.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Pratap Living Standard: Privacy-First Luxury in Lucknow
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Why 500+ guests and 100+ five-star reviewers choose our boutique suites over traditional hotels. Experience a "Sorted" stay designed by founders who prioritize your peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-lg bg-background border"
                data-testid={`feature-${index}`}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
