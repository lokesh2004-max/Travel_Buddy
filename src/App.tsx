import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Queera from "./pages/Queera";
import BuddyMatch from "./pages/BuddyMatch";
import BuddyDetails from "./pages/BuddyDetails";
import DestinationRecommendations from "./pages/DestinationRecommendations";
import SwipeMatch from "./pages/SwipeMatch";
import SearchResults from "./pages/SearchResults";
import BookingPage from "./pages/BookingPage";
import MessagesPage from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyRequests from "./pages/MyRequests";
import PackingAssistant from "./pages/PackingAssistant";
import Moments from "./pages/Moments";

const queryClient = new QueryClient();

/**
 * Route map (navigation flow):
 * / → /dashboard → /queera → /buddy-match → /buddy-details
 *   → /destination-recommendations → /booking
 *
 * Aliases: /search → /search-results (legacy redirect)
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ── Main flow ── */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/profile" element={<Profile />} />

          {/* ── Search ── */}
          <Route path="/search-results" element={<SearchResults />} />
          {/* Legacy alias: /search → /search-results */}
          <Route path="/search" element={<Navigate to="/search-results" replace />} />

          {/* ── Buddy matching flow ── */}
          <Route path="/queera" element={<Queera />} />
          <Route path="/buddy-match" element={<BuddyMatch />} />
          <Route path="/buddy-details" element={<BuddyDetails />} />

          {/* ── Trip planning flow ── */}
          <Route path="/destination-recommendations" element={<DestinationRecommendations />} />
          <Route path="/booking" element={<BookingPage />} />

          {/* ── Extras ── */}
          <Route path="/swipe-match" element={<SwipeMatch />} />
          <Route path="/messages" element={<MessagesPage />} />

          {/* ── Catch-all (MUST be last) ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
