import { Link } from "wouter";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold text-primary mb-4">
              Pratap Living
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Experience exceptional hospitality with our curated collection of premium homestays, suites, apartments, and villas in Lucknow.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-social-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/properties">
                  <span className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer" data-testid="link-footer-properties">
                    Our Properties
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/partner">
                  <span className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer" data-testid="link-footer-partner">
                    Partner With Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer" data-testid="link-footer-contact">
                    Contact
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Property Types</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/properties?type=homestay">
                  <span className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer" data-testid="link-footer-homestay">
                    Homestays
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?type=suite">
                  <span className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer" data-testid="link-footer-suite">
                    Suites
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?type=apartment">
                  <span className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer" data-testid="link-footer-apartment">
                    Apartments
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/properties?type=villa">
                  <span className="text-muted-foreground hover:text-primary transition-colors text-sm cursor-pointer" data-testid="link-footer-villa">
                    Villas
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Hazratganj, Lucknow, Uttar Pradesh, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  +91 98765 43210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground text-sm">
                  hello@pratapliving.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Pratap Living. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
