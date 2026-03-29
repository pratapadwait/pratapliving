import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Properties from "@/pages/properties";
import Partner from "@/pages/partner";
import Contact from "@/pages/contact";
import AdminProperties from "@/pages/admin-properties";
import PropertyDetail from "@/pages/property-detail";
import About from "@/pages/about";
import Blog from "@/pages/blog";
import BlogBestHotelsGomtiNagar from "@/pages/blog-best-hotels-gomti-nagar";
import BlogHourlyHotelsLucknowUnmarriedCouples from "@/pages/blog-hourly-hotels-lucknow-unmarried-couples";
import BlogCoupleFriendlyHotelsLucknow from "@/pages/blog-couple-friendly-hotels-lucknow";

function RedirectTo({ to }: { to: string }) {
  const [, navigate] = useLocation();
  useEffect(() => { navigate(to, { replace: true }); }, []);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties" component={Properties} />
      <Route path="/villa-homestay-golf-city" component={PropertyDetail} />
      <Route path="/luxe-studio-omaxe-hazratganj" component={PropertyDetail} />
      <Route path="/properties/villa-homestay-golf-city">
        <RedirectTo to="/villa-homestay-golf-city" />
      </Route>
      <Route path="/properties/luxe-studio-omaxe-hazratganj">
        <RedirectTo to="/luxe-studio-omaxe-hazratganj" />
      </Route>
      <Route path="/properties/1a271a78-285d-4f70-9c34-647847097b32">
        <RedirectTo to="/luxe-studio-omaxe-hazratganj" />
      </Route>
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/best-hotels-gomti-nagar-lucknow" component={BlogBestHotelsGomtiNagar} />
      <Route path="/blog/hourly-hotels-lucknow-unmarried-couples" component={BlogHourlyHotelsLucknowUnmarriedCouples} />
      <Route path="/blog/couple-friendly-hotels-lucknow-safe-private" component={BlogCoupleFriendlyHotelsLucknow} />
      <Route path="/partner" component={Partner} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/properties" component={AdminProperties} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
