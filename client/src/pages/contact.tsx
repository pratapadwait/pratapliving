import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertContactInquirySchema, type InsertContactInquiry } from "@shared/schema";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { z } from "zod";
import { useDocumentTitle } from "@/hooks/use-document-title";

const contactFormSchema = insertContactInquirySchema.extend({
  email: z.string().email("Please enter a valid email address"),
});

export default function Contact() {
  useDocumentTitle(
    "Contact Us | Pratap Living - Get in Touch",
    "Have questions about our properties or services? Contact Pratap Living. We're here to help with your accommodation needs in Lucknow."
  );

  const { toast } = useToast();

  const form = useForm<InsertContactInquiry>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContactInquiry) => {
      return apiRequest("POST", "/api/contact-inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
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

  const onSubmit = (data: InsertContactInquiry) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions about our properties or services? We're here to help. Reach out to us and we'll respond as soon as we can.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Our Office</h3>
                    <p className="text-muted-foreground text-sm">
                      Hazratganj, Lucknow<br />
                      Uttar Pradesh, India 226001
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground text-sm">
                      +91 98765 43210<br />
                      +91 12345 67890
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm">
                      hello@pratapliving.com<br />
                      support@pratapliving.com
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                    <p className="text-muted-foreground text-sm">
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg overflow-hidden border h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.5234536387604!2d80.94559031504363!3d26.8569547831394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sHazratganj%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Pratap Living Location"
                ></iframe>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Send Us a Message</CardTitle>
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
                            <Input placeholder="Your name" {...field} data-testid="input-contact-name" />
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
                              <Input type="email" placeholder="your@email.com" {...field} data-testid="input-contact-email" />
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
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 98765 43210" {...field} value={field.value || ""} data-testid="input-contact-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="How can we help you?" {...field} data-testid="input-contact-subject" />
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
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more about your inquiry..."
                              rows={5}
                              {...field}
                              data-testid="textarea-contact-message"
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
                      data-testid="button-submit-contact"
                    >
                      {submitMutation.isPending ? "Sending..." : "Send Message"}
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
