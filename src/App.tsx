import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import PostProperty from "./pages/PostProperty";
import EMICalculator from "./pages/EMICalculator";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminContacts from "./pages/admin/AdminContacts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<PageTransition><Index /></PageTransition>} />
              <Route path="/properties" element={<PageTransition><Properties /></PageTransition>} />
              <Route path="/property/:id" element={<PageTransition><PropertyDetails /></PageTransition>} />
              <Route path="/post-property" element={<PageTransition><PostProperty /></PageTransition>} />
              <Route path="/emi-calculator" element={<PageTransition><EMICalculator /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
              <Route path="/sign-in" element={<PageTransition><SignIn /></PageTransition>} />
              <Route path="/sign-up" element={<PageTransition><SignUp /></PageTransition>} />
              <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
              <Route path="/admin/properties" element={<AdminRoute><PageTransition><AdminProperties /></PageTransition></AdminRoute>} />
              <Route path="/admin/contacts" element={<AdminRoute><PageTransition><AdminContacts /></PageTransition></AdminRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </main>
          <Footer />
        </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
