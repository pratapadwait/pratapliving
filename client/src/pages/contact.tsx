import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Contact() {
  useDocumentTitle(
    "Contact Us | Pratap Living - Get in Touch",
    "Have questions about our properties or services? Contact Pratap Living. We're here to help with your accommodation needs in Lucknow."
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-contact-title">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions about our properties or services? We're here to help. Reach out to us and we'll respond as soon as we can.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardContent className="flex gap-4 p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Our Office</h3>
                    <p className="text-muted-foreground text-sm" data-testid="text-contact-address">
                      Omaxe Hazratganj, Sec-7, Amar Shaheed Path,
                      Gomati Nagar Extension, Lucknow,
                      Uttar Pradesh 226002
                    </p>
                  </div>
                </CardContent>
              </Card>

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

              <Card>
                <CardContent className="flex gap-4 p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                    <p className="text-muted-foreground text-sm" data-testid="text-contact-hours">
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 5:00 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-card rounded-md overflow-hidden border h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.5234536387604!2d80.94559031504363!3d26.8569547831394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sHazratganj%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pratap Living Location"
                data-testid="iframe-map"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
