import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Link } from "wouter";

export default function About() {
  useDocumentTitle(
    "Pratap Living: Premium Hotels & Boutique Stays in Lucknow",
    "Discover Pratap Living's premium hotels in Lucknow. Enjoy privacy-first, couple-friendly boutique stays and luxury villas. Book your getaway today!"
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mt-6 mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4" data-testid="text-about-heading">
              The Pratap Living Story: Premium Hotels in Lucknow
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Skip the compromise between a private residence and a five-star hotel in Lucknow. Experience private boutique stays, from executive penthouses to spacious villas. We design each stay for comfort and peace of mind.
            </p>
            <a
              href="https://wa.me/917460985009"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              data-testid="link-about-book-top"
            >
              Book your luxury stay today
            </a>
          </div>

          <hr className="border-border mb-8" />

          <article>
            <section className="mb-8" data-testid="section-vision">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                The Vision of Pratap Adwait Singh & Samiksha Singh: Redefining Premium Hotels in Lucknow
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                When looking for the best hotel in Lucknow, modern travelers often must choose between the comfort of a private home and the amenities of a luxury resort. At Pratap Living, our vision is to eliminate that compromise entirely.
              </p>

              <h3 className="font-serif text-xl font-medium text-foreground mb-3" data-testid="text-about-h3-privacy">
                Privacy-First Legal Advantage
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  At Pratap Living, we make your privacy a top priority. Clear, guest-friendly rules protect every stay. You can relax knowing your booking follows local laws. Your information stays safe.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Co-founder <strong className="text-foreground">Pratap Adwait Singh</strong> uses his <em>Livin Company</em> experience to oversee build quality and interior design. Co-founder <strong className="text-foreground">Samiksha Singh</strong> leads guest relations and privacy-first operations. Together, we have created spaces that feel both truly luxurious and wonderfully familiar.
                </p>
              </div>
            </section>

            <section className="mb-8" data-testid="section-comfort">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                Experience the Comfort of Home with Hotel Luxury
              </h2>

              <h3 className="font-serif text-xl font-medium text-foreground mb-3" data-testid="text-about-h3-couple">
                Couple Friendly Hotels Lucknow
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Experience true privacy and comfort at Pratap Living—your trusted choice for <strong className="text-foreground">couple friendly hotels Lucknow</strong>. Our boutique stays offer a safe, cozy setting for couples to relax near Ekana Stadium and Phoenix Palassio.
              </p>

              <h3 className="font-serif text-xl font-medium text-foreground mb-3" data-testid="text-about-h3-locations">
                Exclusive Boutique Properties & Prime Locations
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Choose from our sprawling luxury villa in <strong className="text-foreground">Sushant Golf City</strong> or our Executive Penthouse in <strong className="text-foreground">Omaxe Hazratganj</strong>. Strategically located within 5 minutes of <strong className="text-foreground">Lulu Mall</strong> and <strong className="text-foreground">Medanta Hospital</strong>, we serve the Gomti Nagar Extension micro-market with ease.
              </p>
            </section>

            <section className="mb-8" data-testid="section-reputation">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                A Proven 5-Star Reputation
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Pratap Living is proud to maintain a <strong className="text-foreground">4.9-star rating across over 100 verified reviews</strong> in just 90 days. View our high-velocity growth on our{" "}
                <a
                  href="https://www.airbnb.co.in/users/profile/1470674723986469804"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-about-airbnb"
                >
                  Verified Airbnb Profile
                </a>.
              </p>
            </section>

            <section className="mb-8" data-testid="section-comparison">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                At a Glance: Pratap Living vs. 5-Star Hotels
              </h2>
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
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">Privacy-First</td>
                      <td className="px-4 py-3 text-foreground">Legally compliant, private stays</td>
                      <td className="px-4 py-3 text-muted-foreground">Often shared amenities</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">Couple Friendly</td>
                      <td className="px-4 py-3 text-foreground">Secure, discreet, and welcoming</td>
                      <td className="px-4 py-3 text-muted-foreground">Varies by property</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">Location Proximity</td>
                      <td className="px-4 py-3 text-foreground">5 mins from Ekana & Lulu Mall</td>
                      <td className="px-4 py-3 text-muted-foreground">Standard city center</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8" data-testid="section-faqs">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-5">
                Frequently Asked Questions
              </h2>
              <dl className="space-y-5" data-testid="list-about-faqs">
                <div>
                  <dt className="font-medium text-foreground mb-1.5" data-testid="text-faq-q-1">
                    What makes Pratap Living different from traditional hotels?
                  </dt>
                  <dd className="text-muted-foreground leading-relaxed text-sm" data-testid="text-faq-a-1">
                    We bridge the gap between a private home and a luxury hotel, offering equipped kitchens and spaciousness alongside premium resort-style linens.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground mb-1.5" data-testid="text-faq-q-2">
                    Are your properties suitable for weddings?
                  </dt>
                  <dd className="text-muted-foreground leading-relaxed text-sm" data-testid="text-faq-a-2">
                    Yes, our 6BHK+ luxury villa in Sushant Golf City fits large groups for wedding parties and corporate retreats.
                  </dd>
                </div>
              </dl>
            </section>

            <footer className="border-t pt-8 mt-8" data-testid="section-about-footer">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                Elevate your next stay with Pratap Living
              </h2>
              <a
                href="https://wa.me/917460985009"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                data-testid="link-about-book-bottom"
              >
                Book your luxury stay today
              </a>
            </footer>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
