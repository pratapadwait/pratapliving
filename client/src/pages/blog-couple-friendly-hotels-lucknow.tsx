import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageHead } from "@/components/page-head";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getBlogPost } from "@/lib/blog-data";

const post = getBlogPost("couple-friendly-hotels-lucknow-safe-private")!;

const blogPostingJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://www.pratapliving.com/blog/${post.slug}`,
  },
  "headline": post.title,
  "description": post.excerpt,
  "image": `https://ik.imagekit.io/livincompany/pratapliving-com/blog/${post.slug}-banner.jpg`,
  "author": {
    "@id": "https://www.pratapliving.com/#author-samiksha",
  },
  "publisher": {
    "@id": "https://www.pratapliving.com/#organization",
  },
  "datePublished": post.dateISO,
  "dateModified": post.dateModified,
  "keywords": post.keywords,
  "articleSection": post.category,
};

export default function BlogCoupleFriendlyHotelsLucknow() {
  return (
    <div className="min-h-screen">
      <PageHead
        title="Couple-Friendly Hotels in Lucknow | Safe, Private & Affordable Stays – Pratap Living"
        description="Discover safe and private couple-friendly hotels in Lucknow with Pratap Living. Enjoy boutique luxury, secure locations, and affordable stays starting at ₹2500/-."
        keywords={post.keywords}
        canonicalUrl="https://www.pratapliving.com/blog/couple-friendly-hotels-lucknow-safe-private"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogPostingJsonLd)}</script>
      </Helmet>
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mt-6 mb-6">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb" data-testid="nav-breadcrumb">
              <Link href="/">
                <span className="hover:text-primary cursor-pointer transition-colors" data-testid="link-breadcrumb-home">Home</span>
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <Link href="/blog">
                <span className="hover:text-primary cursor-pointer transition-colors" data-testid="link-breadcrumb-blog">Blog</span>
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
              <span className="text-foreground/70 truncate" data-testid="text-breadcrumb-current">Couple-Friendly Hotels in Lucknow</span>
            </nav>

            <Link href="/blog">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors mb-6" data-testid="link-back-to-blog">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Blog
              </span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full" data-testid="text-article-category">{post.category}</span>
              <time dateTime={post.dateISO} data-testid="text-article-date">{post.date}</time>
            </div>
          </div>

          <article data-testid="article-couple-friendly-hotels-lucknow">
            <header className="mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight" data-testid="text-article-h1">
                Safe and Private Couple-Friendly Hotels in Lucknow
              </h1>
            </header>

            <section className="mb-8 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Finding <strong className="text-foreground">safe hotels for unmarried couples in Lucknow</strong> that are judgment-free and high-quality shouldn't be stressful. Many couples still struggle with outdated rules or poor options when looking for <strong className="text-foreground">couple-friendly hotels in Lucknow</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                At <strong className="text-foreground">Pratap Living</strong>, we've built our brand on a "Privacy-First" philosophy. Our goal is to provide boutique luxury with privacy, discretion, and safety—a vision introduced by founder <strong className="text-foreground">Pratap Adwait Singh</strong>. Our Studio Collection is perfect for local couples on a staycation or visitors exploring the city.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4" data-testid="text-article-h2-1">
                The Legal Reality for Couples in Lucknow
              </h2>
              <blockquote className="border-l-4 border-primary pl-4 py-1 mb-4 bg-muted/30 rounded-r-md" data-testid="blockquote-legal-rights">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  <strong className="text-foreground">Know Your Rights:</strong> In India, the law allows two consenting adults (18+) to stay together in a hotel. Both guests must simply present valid government-issued IDs.
                </p>
              </blockquote>
              <p className="text-muted-foreground leading-relaxed">
                Despite this, many traditional hotels enforce "No Local ID" or "Unmarried Couple" restrictions. At Pratap Living, we strictly follow the law—not outdated social norms. We are proud to be one of the most trusted <strong className="text-foreground">safe hotels for unmarried couples in Lucknow</strong>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4" data-testid="text-article-h2-2">
                Why Pratap Living is the Best Choice for Private Places for Couples in Lucknow
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Privacy is more than just a locked door—it's about the entire experience. Here's why we stand out:
              </p>
              <ul className="space-y-2.5 ml-4" data-testid="list-why-us">
                <li className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Professional Management:</strong> Unlike random guest houses, our properties are run as a premium boutique brand with consistent, high-quality standards.</span>
                </li>
                <li className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Secure, Premium Locations:</strong> Our studios are located in gated, upscale areas like <strong className="text-foreground">Gomti Nagar</strong>, providing unmatched security compared to busy city-center hotels.</span>
                </li>
                <li className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Self-Contained Studio Spaces:</strong> Every unit is fully equipped and self-contained, ensuring more privacy and fewer interruptions.</span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4" data-testid="text-article-h2-3">
                The Studio Collection Experience
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our designer studio apartments at <strong className="text-foreground">Omaxe Hazratganj</strong> offer a peaceful retreat just minutes from <strong className="text-foreground">Phoenix Palassio</strong> and <strong className="text-foreground">Ekana Stadium</strong>. Each unit features:
              </p>
              <ul className="space-y-2.5 ml-4" data-testid="list-studio-features">
                <li className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Beautiful Interiors:</strong> Designer furniture and high-quality finishes.</span>
                </li>
                <li className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Smart Tech:</strong> Fast Wi-Fi and Google Smart TVs for your entertainment.</span>
                </li>
                <li className="text-muted-foreground text-sm flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span><strong className="text-foreground">Complete Autonomy:</strong> Dedicated pantries with mini-fridges and electric kettles.</span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4" data-testid="text-article-h2-4">
                Affordable Luxury with Transparent Pricing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe luxury should be simple. Our <strong className="text-foreground">couple-friendly rooms in Lucknow start at just ₹2500/-</strong>, offering significantly better value and exclusivity than standard 5-star hotels.
              </p>
            </section>

            <footer className="border-t pt-8 mt-8">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4" data-testid="text-article-h2-footer">
                Book Directly for Exclusive Member Rates
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Avoid third-party platform fees and secure the best available rates by contacting us directly. Experience the "Privacy-First" difference today.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">WhatsApp / Direct Booking:</strong>{" "}
                  <a href="tel:+917460985009" className="text-primary hover:underline" data-testid="link-article-phone">
                    +91 7460985009
                  </a>
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/917460985009"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                    data-testid="link-article-whatsapp-cta"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
