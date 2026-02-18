import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Phone, MapPin, Globe, Users, Star, Home, ChevronDown } from "lucide-react";
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

  const whyChoose = [
    {
      icon: Users,
      title: "Unmatched Group Capacity",
      description: "We offer Lucknow's premier 6BHK+ Luxury Villa, specifically designed to keep large families and wedding groups together under one roof.",
    },
    {
      icon: MapPin,
      title: "Strategic Locations",
      description: "Our properties are situated near the city's most important landmarks, including The Centrum, Viviana Greens, Lulu Mall, Medanta Hospital, and the Hazratganj commercial hub.",
    },
    {
      icon: Star,
      title: 'The "Billboard Effect" Trust',
      description: "With a strong 5-star reputation on international platforms like Airbnb, we bring world-class hospitality standards to our direct-booking guests.",
    },
    {
      icon: Home,
      title: "Boutique Experience",
      description: "We bridge the gap between a private home and a luxury hotel, offering fully equipped kitchens, premium linens, and personalized concierge support.",
    },
  ];

  const faqs = [
    {
      question: "Who is the founder of Pratap Living?",
      answer: "Pratap Living was founded by Pratap Adwait Singh, a Lucknow-based entrepreneur dedicated to premium boutique hospitality.",
    },
    {
      question: "Is there a 6BHK villa available for wedding guests near The Centrum Lucknow?",
      answer: "Yes, Pratap Living operates a 6BHK+ Luxury Villa in Sushant Golf City, located just 5 minutes from The Centrum and Viviana Greens, perfect for wedding guest accommodations.",
    },
    {
      question: "Where can I find luxury corporate stays in central Lucknow?",
      answer: "We offer Executive Penthouse Suites and Studio Apartments in Omaxe Hazratganj, ideal for business travelers and digital nomads.",
    },
    {
      question: "How can I book a stay with Pratap Living directly?",
      answer: "You can book directly via our website pratapliving.com or contact us via WhatsApp at +917460985009 for exclusive rates.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mt-6 mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-about-heading">
              About Us: The Pratap Living Story
            </h1>
            <p className="text-muted-foreground" data-testid="text-about-subtitle">Boutique luxury stays in the heart of Lucknow</p>
          </div>

          <section className="mb-10" data-testid="section-vision">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">The Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Pratap Living, we believe that hospitality is more than just a place to stay; it is an experience rooted in comfort, privacy, and the unique warmth of Lucknow. In a world of generic hotel rooms, we provide curated, premium spaces that feel like home but offer the luxury of a boutique retreat. From the quiet expanse of Sushant Golf City to the urban pulse of Omaxe Hazratganj, our mission is to host your most important moments with excellence.
            </p>
          </section>

          <section className="mb-10" data-testid="section-founder-note">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-3">A Note from Our Founder</h2>
            <Card>
              <CardContent className="p-6">
                <blockquote className="text-muted-foreground leading-relaxed italic">
                  <p className="mb-4">
                    "Pratap Living was born out of a simple passion: to redefine the way people experience my home city. Whether it is our signature 6BHK+ Luxury Villa in Sushant Golf City or our Executive Penthouse in Omaxe Hazratganj, every detail has been personally curated by me.
                  </p>
                  <p>
                    When you book a stay with us, you aren't just getting a key; you are getting a commitment to quality and the true 'Nawabi' spirit of Lucknow. Whether you are here for a family reunion, a wedding, or a corporate milestone, I am honored to welcome you."
                  </p>
                </blockquote>
                <p className="mt-4 font-medium text-foreground text-sm" data-testid="text-founder-name">
                  — Pratap Adwait Singh, Founder, Pratap Living
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-10" data-testid="section-why-choose">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Why Choose Pratap Living?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyChoose.map((item, i) => (
                <Card key={i}>
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
          </section>

          <section className="mb-10" data-testid="section-about-faqs">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqItem key={i} index={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          <section data-testid="section-about-contact">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Contact Us</h2>
            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Founder:</span> Pratap Adwait Singh
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
