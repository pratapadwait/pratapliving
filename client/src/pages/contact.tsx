import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";
import { PageHead } from "@/components/page-head";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <PageHead
        title="Contact Us | Pratap Living - Get in Touch"
        description="Have questions about our properties or services? Contact Pratap Living. We're here to help with your accommodation needs in Lucknow."
        canonicalUrl="https://www.pratapliving.com/contact"
      />
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-contact-title">Hotels in Lucknow & Gomti Nagar</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you are comparing the best hotels in Lucknow for a business trip, looking for top-rated hotels in Gomti Nagar Lucknow, or seeking the exclusive comfort of a private villa at Golf City Lucknow, our team will guide you to the right accommodation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardContent className="flex gap-4 p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <a href="tel:+917460985009" className="text-muted-foreground hover:text-primary text-sm transition-colors" data-testid="link-contact-phone">
                      +91 7460985009
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex gap-4 p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm" data-testid="text-contact-email">
                      hello@pratapliving.com
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-sm text-foreground mb-2">The Villa &amp; Homestay — Golf City</p>
                <div className="bg-card rounded-md overflow-hidden border h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56955.49880375895!2d80.9503807!3d26.8488988!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be598449e523f%3A0xbc372f2db9199fbe!2sPratap%20Living%20-%20The%20Villa%20and%20Homestay%20Golf%20City!5e0!3m2!1sen!2sin!4v1774929081742!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Pratap Living Villa Golf City"
                    data-testid="iframe-map-villa"
                  ></iframe>
                </div>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground mb-2">Luxe Studio Stays — Omaxe Hazratganj</p>
                <div className="bg-card rounded-md overflow-hidden border h-64">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.883042114598!2d80.99536187494394!3d26.81185246441857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be301f2925f53%3A0xaea797774f5019cb!2sPratap%20Living%20%7C%20Luxe%20Studio%20Stays%20-%20Omaxe%20Hazratganj!5e0!3m2!1sen!2sin!4v1774929285273!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Pratap Living Luxe Studio Omaxe Hazratganj"
                    data-testid="iframe-map-studio"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
