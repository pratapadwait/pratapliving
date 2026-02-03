import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPartnerInquirySchema, type InsertPartnerInquiry } from "@shared/schema";
import { TrendingUp, Shield, Users, Home, Sparkles, Phone } from "lucide-react";
import { z } from "zod";
import { useDocumentTitle } from "@/hooks/use-document-title";

const partnerFormSchema = insertPartnerInquirySchema.extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

const benefits = [
  {
    icon: TrendingUp,
    title: "Higher Earnings",
    description: "Earn up to 30% more with our dynamic pricing and marketing expertise.",
  },
  {
    icon: Shield,
    title: "Property Protection",
    description: "Comprehensive damage protection and guest screening for peace of mind.",
  },
  {
    icon: Users,
    title: "Full Management",
    description: "We handle everything from guest communication to cleaning services.",
  },
  {
    icon: Home,
    title: "Free Listing",
    description: "No upfront costs. List your property for free and start earning.",
  },
  {
    icon: Sparkles,
    title: "Premium Marketing",
    description: "Professional photography and marketing across multiple platforms.",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Dedicated support team for you and your guests around the clock.",
  },
];

export default function Partner() {
  useDocumentTitle(
    "Partner With Us | Pratap Living - List Your Property",
    "Join Lucknow's premier hospitality network. List your property with Pratap Living and enjoy hassle-free earnings while we handle everything."
  );

  const { toast } = useToast();

  const form = useForm<InsertPartnerInquiry>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyType: "",
      propertyLocation: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertPartnerInquiry) => {
      return apiRequest("POST", "/api/partner-inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you for your interest. Our team will contact you within 24 hours.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPartnerInquiry) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <section className="bg-primary py-16 mb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Partner With Pratap Living
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Join Lucknow's premier hospitality network. List your property with us and enjoy hassle-free earnings while we handle everything.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              Why Partner With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex gap-4 p-6 rounded-lg bg-card border"
                    data-testid={`benefit-${index}`}
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Submit Your Inquiry</h3>
                    <p className="text-muted-foreground text-sm">
                      Fill out the form with your property details. Our team will review your submission.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Property Assessment</h3>
                    <p className="text-muted-foreground text-sm">
                      We visit your property, assess its potential, and discuss partnership terms.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Professional Setup</h3>
                    <p className="text-muted-foreground text-sm">
                      We photograph your property, create listings, and prepare it for guests.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Start Earning</h3>
                    <p className="text-muted-foreground text-sm">
                      Your property goes live and starts receiving bookings. Enjoy monthly payouts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Get Started Today</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} data-testid="input-partner-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} data-testid="input-partner-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 98765 43210" {...field} data-testid="input-partner-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-property-type">
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="homestay">Homestay</SelectItem>
                              <SelectItem value="suite">Suite</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="villa">Villa</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="propertyLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Area, City" {...field} data-testid="input-property-location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your property..."
                              rows={4}
                              {...field}
                              value={field.value || ""}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitMutation.isPending}
                      data-testid="button-submit-partner"
                    >
                      {submitMutation.isPending ? "Submitting..." : "Submit Inquiry"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
