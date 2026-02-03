import { Shield, Clock, HeartHandshake, Award, Sparkles, Phone } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Properties",
    description: "Every property is personally inspected and verified for quality, safety, and cleanliness standards.",
  },
  {
    icon: HeartHandshake,
    title: "Exceptional Hospitality",
    description: "Experience warm Lucknowi hospitality with dedicated hosts who go above and beyond.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our guest support team is available round the clock to assist with any queries or concerns.",
  },
  {
    icon: Award,
    title: "Premium Amenities",
    description: "Enjoy luxury amenities including high-speed WiFi, premium linens, and modern facilities.",
  },
  {
    icon: Sparkles,
    title: "Curated Experiences",
    description: "Discover local experiences, from heritage walks to authentic cuisine recommendations.",
  },
  {
    icon: Phone,
    title: "Easy Booking",
    description: "Simple booking process with instant confirmation and flexible cancellation policies.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Pratap Living
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're committed to providing an exceptional stay experience with attention to every detail.
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
