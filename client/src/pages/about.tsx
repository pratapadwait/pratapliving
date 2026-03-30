import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Phone, MapPin, Star, Heart, Building2, Globe, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

function FaqItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-md" data-testid={`about-faq-item-${index}`}>
      <button
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
        data-testid={`button-about-faq-toggle-${index}`}
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

export default function About() {
  useDocumentTitle(
    "About Pratap Living | Boutique Luxury Stays by Pratap Adwait Singh",
    "Meet Pratap Adwait Singh, founder of Pratap Living. Discover Lucknow's premier 6BHK+ villas and luxury suites in Sushant Golf City and Omaxe Hazratganj."
  );

  const comfortCards = [
    {
      icon: Heart,
      title: "Couple Friendly Hotels Lucknow",
      description:
        "Experience true privacy and comfort at Pratap Living—your trusted choice for couple friendly hotels Lucknow. Our thoughtfully designed boutique stays offer a safe, cozy setting for couples to relax and celebrate. Enjoy a romantic city getaway.",
    },
    {
      icon: Building2,
      title: "Exclusive Boutique Properties",
      description:
        "Choose the perfect backdrop for your stay. Relax in our large luxury villa in Sushant Golf City. Or enjoy the lively vibe of our Executive Penthouse and Studio Apartments in Omaxe Hazratganj. If you are looking for highly secure, couple friendly hotels in Lucknow, our exclusive suites offer a perfect escape.",
    },
    {
      icon: MapPin,
      title: "Strategic, Prime Locations",
      description:
        "We situate our properties near major landmarks like Lulu Mall, Medanta Hospital, and The Centrum. Located within 5 minutes of Ekana Stadium and Phoenix Palassio, our Omaxe Hazratganj units serve Gomti Nagar Extension. We offer easy access for those comparing premium stays and hotels in Gomti Nagar, Lucknow.",
    },
    {
      icon: Star,
      title: "A Proven 5-Star Reputation",
      description:
        "Pratap Living is proud to maintain a 4.9-star rating across over 100 verified reviews in just 90 days. You can view our live guest feedback on our Verified Airbnb Profile. We deliver a flawless 5-star experience on international platforms like Airbnb. We ensure your stay always exceeds expectations.",
    },
  ];

  const comparisonRows = [
    {
      feature: "Privacy-First Experience",
      pratap: "Yes – legally compliant, private stays",
      hotel: "Limited – often shared amenities",
    },
    {
      feature: "Couple Friendly Accommodations",
      pratap: "Yes – secure, discreet, and welcoming",
      hotel: "Varies by property",
    },
    {
      feature: "Fully Equipped Kitchens",
      pratap: "Available in most units",
      hotel: "Rarely available",
    },
    {
      feature: "Location Specificity",
      pratap: "Boutique stays in Lucknow's top areas. Just 5 minutes from Ekana Stadium, Phoenix Palassio, Lulu Mall, and Gomti Nagar Extension.",
      hotel: "Central city locations, less flexible",
    },
    {
      feature: "Personalized Guest Relations",
      pratap: "Direct contact with owner-curators",
      hotel: "Standardized hotel staff",
    },
    {
      feature: "Verified Ratings & Reviews",
      pratap: "4.9-star rating, 100+ verified reviews",
      hotel: "Varies across platforms",
    },
    {
      feature: "Legal Clarity for Guests",
      pratap: "Clear guest documentation & compliance",
      hotel: "Standardized hotel policies",
    },
  ];

  const testimonials = [
    {
      quote:
        "It was a wonderful stay. The place is very clean, and both the caretaker and the owner are always reachable and helpful. The kitchen is spacious and convenient to use during the stay.",
      name: "Onkar",
      location: "Meguro, Japan",
    },
    {
      quote:
        "Had wonderful stay with friends.. Host is responsive and helpful. Nice balcony space for pleasant and peaceful time.",
      name: "Prasanna",
      location: "Dubai, United Arab Emirates",
    },
    {
      quote:
        "It's a beautiful, genuinely spacious place. I really enjoyed my stay, even though it was just for one night while travelling from Chandigarh to Bihar. Pratap Ji is a wonderful host. I would highly recommend this place to anyone looking for a peaceful and secure stay in Lucknow, with excellent connectivity to the Purvanchal Expressway.",
      name: "Rahul",
      location: "Chandigarh, India",
    },
  ];

  const faqs = [
    {
      question: "What makes Pratap Living different from traditional hotels?",
      answer:
        "We bridge the gap between a private home and a luxury hotel. You get the space and privacy of a fully furnished home, with an equipped kitchen. You also enjoy premium linens and personalized concierge service, like at luxury resorts.",
    },
    {
      question: "Are your properties suitable for weddings and large families?",
      answer:
        "Absolutely. Our premier 6BHK+ luxury villa in Sushant Golf City fits large groups with ease. Ideal for wedding parties, family reunions, and corporate retreats.",
    },
    {
      question: "Where exactly are your properties located?",
      answer:
        "We strategically locate our flagship properties across the city. We offer a luxury villa in Sushant Golf City, near Lulu Mall and Medanta Hospital. We also offer Executive Penthouses and Studio Apartments in Omaxe Hazratganj.",
    },
    {
      question: "Do you accommodate couples?",
      answer:
        "We design our studio apartments and penthouses for privacy and luxury. This makes us a top choice for couples seeking a premium, secure, and intimate getaway.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* H1 + subtitle */}
          <div className="mt-6 mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-about-heading">
              The Pratap Living Story: A Vision by Samiksha &amp; Pratap
            </h1>
            <p className="text-muted-foreground" data-testid="text-about-subtitle">Boutique luxury stays in the heart of Lucknow</p>
          </div>

          {/* Vision section */}
          <section className="mb-10" data-testid="section-vision">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
              The Vision of Pratap Adwait Singh &amp; Samiksha Singh: Redefining Premium Hotels in Lucknow
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When looking for the best hotel in Lucknow, modern travelers often must choose. They choose between the comfort of a private home and the amenities of a luxury resort. At Pratap Living, our vision is to eliminate that compromise entirely.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We created our brand from a shared passion to raise the standard of luxury places to stay. Co-founder Pratap Adwait Singh uses his Livin Company experience to oversee build quality and interior design. Co-founder Samiksha Singh leads guest relations and privacy-first operations. Together, we have created spaces that feel both truly luxurious and wonderfully familiar, redefining what it means to travel.
            </p>
          </section>

          {/* Experience the Comfort of Home with Hotel Luxury */}
          <section className="mb-10" data-testid="section-comfort-luxury">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Experience the Comfort of Home with Hotel Luxury
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {comfortCards.map((item, i) => (
                <Card key={i} data-testid={`card-comfort-${i}`}>
                  <CardContent className="p-5 flex gap-3">
                    <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-foreground mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison table */}
            <p className="font-medium text-sm text-foreground mb-3" data-testid="text-comparison-heading">
              At a Glance: Pratap Living vs. 5-Star Hotels
            </p>
            <div className="overflow-x-auto rounded-lg border" data-testid="table-comparison">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Feature</th>
                    <th className="text-left px-4 py-3 font-semibold text-primary">Pratap Living</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Typical 5-Star Hotel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors" data-testid={`row-comparison-${i}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{row.feature}</td>
                      <td className="px-4 py-3 text-foreground">{row.pratap}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.hotel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-10" data-testid="section-testimonials">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Loved by Our Guests</h2>
            <div className="space-y-4">
              {testimonials.map((t, i) => (
                <Card key={i} data-testid={`card-testimonial-${i}`}>
                  <CardContent className="p-5">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-sm text-muted-foreground leading-relaxed italic mb-3" data-testid={`text-testimonial-quote-${i}`}>
                      "{t.quote}"
                    </blockquote>
                    <p className="text-sm font-medium text-foreground" data-testid={`text-testimonial-name-${i}`}>{t.name}</p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-testimonial-location-${i}`}>{t.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10" data-testid="section-about-faqs">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqItem key={i} index={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          {/* Privacy-First Legal Advantage */}
          <section className="mb-10" data-testid="section-privacy-first">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">Privacy-First Legal Advantage</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  At Pratap Living, we make your privacy a top priority. Clear, guest-friendly rules protect every stay. You can relax knowing your booking follows local laws. Your information stays safe.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact Us */}
          <section data-testid="section-about-contact">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Contact Us</h2>
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Founder:</span> Samiksha Singh
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <a href="tel:+917460985009" className="hover:text-primary transition-colors" data-testid="link-about-phone">
                    +91 7460985009
                  </a>
                  <span className="text-xs">(Call / WhatsApp)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  <a href="https://www.pratapliving.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" data-testid="link-about-website">
                    www.pratapliving.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span data-testid="text-about-locations">Sushant Golf City | Omaxe Hazratganj, Lucknow</span>
                </div>
                <div className="flex flex-wrap gap-3 pt-3">
                  <a href="tel:+917460985009">
                    <Button data-testid="button-about-call">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                  <Link href="/properties">
                    <Button variant="outline" data-testid="button-about-view-properties">
                      View Properties
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
