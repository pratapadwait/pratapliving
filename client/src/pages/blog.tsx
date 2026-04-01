import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/page-head";
import { Link } from "wouter";
import { CalendarDays, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "/blog/couple-friendly-hotels-lucknow-safe-private",
    title: "Safe and Private Couple-Friendly Hotels in Lucknow",
    excerpt:
      "Finding safe hotels for unmarried couples in Lucknow that are judgment-free and high-quality shouldn't be stressful. At Pratap Living, we've built our brand on a \"Privacy-First\" philosophy — boutique luxury with privacy, discretion, and safety for every couple.",
    date: "March 30, 2026",
    dateISO: "2026-03-30T09:17:00+05:30",
    category: "Stays Guide",
  },
  {
    slug: "/blog/hourly-hotels-lucknow-unmarried-couples",
    title: "Safe Hourly Hotels in Lucknow for Unmarried Couples",
    excerpt:
      "Finding safe, comfortable, and secure hourly hotels in Lucknow for unmarried couples should never feel stressful. Day use hotels in Lucknow now provide flexible, judgment-free stays that prioritize comfort and safety — without the cost of an overnight stay.",
    date: "March 30, 2026",
    dateISO: "2026-03-30T10:43:00+05:30",
    category: "Stays Guide",
  },
  {
    slug: "/blog/best-hotels-gomti-nagar-lucknow",
    title: "The Ultimate Guide to the Best Hotels in Gomti Nagar Lucknow",
    excerpt:
      "Lucknow is famous for its stunning historical monuments, but it's also growing into a lively, modern city. In the heart of this growth is Lucknow Gomti Nagar. This vibrant district brings together major businesses, upscale shopping, and lively nightlife. For the modern luxury traveler, it offers an unmatched mix of convenience, culture, and high-end living.",
    date: "March 30, 2026",
    dateISO: "2026-03-30T11:58:00+05:30",
    category: "Travel Guide",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen">
      <PageHead
        title="Blog | Pratap Living"
        description="Insights, guides, and stories from Pratap Living — Lucknow's premier boutique stays platform."
        canonicalUrl="https://www.pratapliving.com/blog"
      />
      <Navigation />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mt-6 mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-blog-heading">
              Blog
            </h1>
            <p className="text-muted-foreground" data-testid="text-blog-subtitle">
              Travel guides, local insights, and stories from Pratap Living
            </p>
          </div>

          <div className="space-y-6" data-testid="list-blog-posts">
            {posts.map((post, i) => (
              <Card key={i} data-testid={`card-blog-post-${i}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full" data-testid={`text-blog-category-${i}`}>
                      {post.category}
                    </span>
                    <time dateTime={post.dateISO} className="flex items-center gap-1" data-testid={`text-blog-date-${i}`}>
                      <CalendarDays className="h-3 w-3" />
                      {post.date}
                    </time>
                  </div>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-3 leading-snug" data-testid={`text-blog-title-${i}`}>
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3" data-testid={`text-blog-excerpt-${i}`}>
                    {post.excerpt}
                  </p>
                  <Link href={post.slug}>
                    <Button variant="outline" size="sm" data-testid={`link-blog-read-${i}`}>
                      Read article
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
