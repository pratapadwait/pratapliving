import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

import testimonialFamily from "@/assets/images/testimonial-family.png";
import testimonialBusiness from "@/assets/images/testimonial-business.png";
import testimonialCouple from "@/assets/images/testimonial-couple.png";

const testimonials = [
  {
    name: "Rajesh & Family",
    role: "Family Vacation",
    image: testimonialFamily,
    rating: 5,
    content: "Our stay at Pratap Living was absolutely wonderful. The villa was spacious, clean, and the staff went above and beyond to make our family feel at home. The kids loved the pool and we loved the peaceful environment.",
  },
  {
    name: "Priya Sharma",
    role: "Business Traveler",
    image: testimonialBusiness,
    rating: 5,
    content: "As a frequent business traveler, I appreciate properties that offer both comfort and convenience. Pratap Living's suites provide exactly that - excellent WiFi, quiet workspace, and impeccable service.",
  },
  {
    name: "Arjun & Meera",
    role: "Honeymoon Trip",
    image: testimonialCouple,
    rating: 5,
    content: "We chose Pratap Living for our honeymoon and it exceeded all expectations. The heritage homestay had such romantic charm, and the hosts arranged special surprises for us. Truly memorable!",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from travelers who have experienced Pratap Living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative"
              data-testid={`testimonial-${index}`}
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
