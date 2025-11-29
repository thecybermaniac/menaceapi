import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AccessBlocked from "./pages/AccessBlocked";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useDeviceDetect } from "./hooks/useDeviceDetect";

const queryClient = new QueryClient();

const AppContent = () => {
  const isMobileOrTablet = useDeviceDetect();

  // Show nothing while detecting device
  if (isMobileOrTablet === null) {
    return null;
  }

  // Block non-PC devices
  if (isMobileOrTablet) {
    return <AccessBlocked />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
    <SpeedInsights />
    <Analytics />
  </QueryClientProvider>
);

export default App;
