import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { Link } from "wouter";
import { CalendarDays, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "/blog/best-hotels-gomti-nagar-lucknow",
    title: "The Ultimate Guide to the Best Hotels in Gomti Nagar Lucknow",
    excerpt:
      "Lucknow is famous for its stunning historical monuments, but it's also growing into a lively, modern city. In the heart of this growth is Lucknow Gomti Nagar. This vibrant district brings together major businesses, upscale shopping, and lively nightlife. For the modern luxury traveler, it offers an unmatched mix of convenience, culture, and high-end living.",
    date: "June 10, 2025",
    category: "Travel Guide",
  },
];

export default function Blog() {
  useDocumentTitle(
    "Blog | Pratap Living",
    "Insights, guides, and stories from Pratap Living — Lucknow's premier boutique stays platform."
  );

  return (
    <div className="min-h-screen">
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
                    <span className="flex items-center gap-1" data-testid={`text-blog-date-${i}`}>
                      <CalendarDays className="h-3 w-3" />
                      {post.date}
                    </span>
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
