import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/simplify-tap/CartSidebar";

// Lazy Load Pages
const Index = lazy(() => import("./pages/Index"));
const CreateCard = lazy(() => import("./pages/CreateCard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Plus = lazy(() => import("./pages/Plus"));
const NFC = lazy(() => import("./pages/NFC"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PublicCard = lazy(() => import("./pages/PublicCard"));
const Teams = lazy(() => import("./pages/Teams"));
const ExchangedContacts = lazy(() => import("./pages/ExchangedContacts"));
const ActivateCard = lazy(() => import("./pages/ActivateCard"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Pricing = lazy(() => import("./pages/Pricing"));

const queryClient = new QueryClient();

const AppLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <Loader2 className="h-8 w-8 animate-spin text-[#0FA4AF]" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <ScrollToTop />
          <CartSidebar />
          <Suspense fallback={<AppLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create" element={<CreateCard />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/plus" element={<Plus />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/activate" element={<ActivateCard />} />
              <Route path="/nfc" element={<NFC />} />
              <Route path="/nfc/:id" element={<ProductDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/exchanged-contacts" element={<ExchangedContacts />} />
              <Route path="/card/:id" element={<PublicCard />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/pricing" element={<Pricing />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
