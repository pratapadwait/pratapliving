export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  dateModified: string;
  category: string;
  keywords: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "couple-friendly-hotels-lucknow-safe-private",
    title: "Safe and Private Couple-Friendly Hotels in Lucknow",
    excerpt:
      "Finding safe hotels for unmarried couples in Lucknow that are judgment-free and high-quality shouldn't be stressful. At Pratap Living, we've built our brand on a \"Privacy-First\" philosophy — boutique luxury with privacy, discretion, and safety for every couple.",
    date: "March 30, 2026",
    dateISO: "2026-03-30T09:17:00+05:30",
    dateModified: "2026-04-02T10:00:00+05:30",
    category: "Stays Guide",
    keywords: "couple-friendly hotels in lucknow, safe hotels for unmarried couples lucknow, private places for couples in lucknow, boutique luxury lucknow",
  },
  {
    slug: "hourly-hotels-lucknow-unmarried-couples",
    title: "Safe Hourly Hotels in Lucknow for Unmarried Couples",
    excerpt:
      "Finding safe, comfortable, and secure hourly hotels in Lucknow for unmarried couples should never feel stressful. Day use hotels in Lucknow now provide flexible, judgment-free stays that prioritize comfort and safety — without the cost of an overnight stay.",
    date: "March 30, 2026",
    dateISO: "2026-03-30T10:43:00+05:30",
    dateModified: "2026-04-02T10:00:00+05:30",
    category: "Stays Guide",
    keywords: "hourly hotels in lucknow for unmarried couples, day use hotels lucknow, couple friendly hotels lucknow, safe stays lucknow",
  },
  {
    slug: "best-hotels-gomti-nagar-lucknow",
    title: "The Ultimate Guide to the Best Hotels in Gomti Nagar Lucknow",
    excerpt:
      "Lucknow is famous for its stunning historical monuments, but it's also growing into a lively, modern city. In the heart of this growth is Lucknow Gomti Nagar. This vibrant district brings together major businesses, upscale shopping, and lively nightlife. For the modern luxury traveler, it offers an unmatched mix of convenience, culture, and high-end living.",
    date: "March 30, 2026",
    dateISO: "2026-03-30T11:58:00+05:30",
    dateModified: "2026-04-02T10:00:00+05:30",
    category: "Travel Guide",
    keywords: "hotels in gomti nagar lucknow, best hotels in lucknow, boutique stays lucknow, couple friendly hotels lucknow, Pratap Living",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
