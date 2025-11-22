import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import IconSidebar from "@/components/IconSidebar";
import TouchInterface from "@/components/TouchInterface";
import WelcomeScreen from "@/components/WelcomeScreen";
import SelfService from "@/pages/self-service";
import POS from "@/pages/POS";
import FaceIdentification from "@/pages/FaceIdentification";
import FaceRegistration from "@/pages/face-registration";
import ManualEntry from "@/pages/ManualEntry";
import Services from "@/pages/Services";
import QuickSearch from "@/pages/QuickSearch";
import Chat from "@/pages/chat";
import CustomerManagement from "@/pages/CustomerManagement";
import AITan from "@/pages/AITan";
import HairStudio from "@/pages/HairStudio";
import Shop from "@/pages/shop";
import Onboarding from "@/pages/onboarding";
import BidiTest from "@/pages/bidi-test";
import NotFound from "@/pages/not-found";
import Checkout from "@/pages/Checkout";
import Landing from "@/pages/Landing";
import PaymentSuccess from "@/pages/payment-success";
import PaymentError from "@/pages/payment-error";
import InventoryManagement from "@/pages/InventoryManagement";
import Reports from "@/pages/Reports";
import WhatsAppTest from "@/pages/WhatsAppTest";
import EmergencyDoorButton from "@/components/EmergencyDoorButton";

export default function App() {
  const [location] = useLocation();
  const [showWelcome, setShowWelcome] = useState(() => {
    // Show welcome only on first visit (check sessionStorage)
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome;
  });

  const publicPages = [
    "/self-service",
    "/onboarding",
    "/face-id",
    "/face-registration",
    "/manual-entry",
    "/services",
    "/quick-search",
    "/shop",
    "/ai-tan",
    "/hair-studio",
    "/landing",
    "/checkout",
    "/payment-success",
    "/payment-error",
    "/inventory",
    "/reports",
    "/whatsapp-test",
  ];
  const isPublicPage = publicPages.some((page) => location.startsWith(page));

  const handleWelcomeComplete = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
          {showWelcome && <WelcomeScreen onContinue={handleWelcomeComplete} />}
          {!isPublicPage && <IconSidebar />}
          {/* כפתור חירום - תמיד נגיש */}
          {!isPublicPage && <EmergencyDoorButton />}
          <Switch>
            <Route path="/" component={TouchInterface} />
            <Route path="/landing" component={Landing} />
            <Route path="/checkout/:customerId" component={Checkout} />
            <Route path="/payment-success" component={PaymentSuccess} />
            <Route path="/payment-error" component={PaymentError} />
            <Route path="/inventory" component={InventoryManagement} />
            <Route path="/reports" component={Reports} />
            <Route path="/whatsapp-test" component={WhatsAppTest} />
            <Route path="/self-service" component={SelfService} />
            <Route path="/pos" component={POS} />
            <Route path="/face-id" component={FaceIdentification} />
            <Route path="/face-registration" component={FaceRegistration} />
            <Route path="/manual-entry" component={ManualEntry} />
            <Route path="/services" component={Services} />
            <Route path="/quick-search" component={QuickSearch} />
            <Route path="/chat" component={Chat} />
            <Route path="/customers" component={CustomerManagement} />
            <Route path="/ai-tan" component={AITan} />
            <Route path="/hair-studio" component={HairStudio} />
            <Route path="/shop" component={Shop} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/bidi-test" component={BidiTest} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
