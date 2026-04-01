import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHead } from "@/components/page-head";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { CalendarDays, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Pratap Living Blog",
  "description": "Travel guides, local insights, and stories from Pratap Living — Lucknow's premier boutique stays platform.",
  "publisher": {
    "@id": "https://www.pratapliving.com/#organization"
  },
  "blogPost": blogPosts.map((post) => ({
    "@type": "BlogPosting",
    "headline": post.title,
    "author": { "@id": "https://www.pratapliving.com/#author-samiksha" },
    "datePublished": post.dateISO,
    "url": `https://www.pratapliving.com/blog/${post.slug}`,
  })),
};

export default function Blog() {
  return (
    <div className="min-h-screen">
      <PageHead
        title="Blog | Pratap Living"
        description="Insights, guides, and stories from Pratap Living — Lucknow's premier boutique stays platform."
        canonicalUrl="https://www.pratapliving.com/blog"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogJsonLd)}</script>
      </Helmet>
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
            {blogPosts.map((post, i) => (
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
                  <Link href={`/blog/${post.slug}`}>
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
