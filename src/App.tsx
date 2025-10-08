import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Queera from "./pages/Queera";
import BuddyMatch from "./pages/BuddyMatch";
import BuddyDetails from "./pages/BuddyDetails";
import SwipeMatch from "./pages/SwipeMatch";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/queera" element={<Queera />} />
          <Route path="/buddy-match" element={<BuddyMatch />} />
          <Route path="/buddy-details" element={<BuddyDetails />} />
          <Route path="/swipe-match" element={<SwipeMatch />} />
          <Route path="/search-results" element={<SearchResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
