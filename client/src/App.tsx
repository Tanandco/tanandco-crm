import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import IconSidebar from "@/components/IconSidebar";

// Import main components
import TouchInterfaceComponent from "@/components/TouchInterface";
import FaceIdentification from "@/pages/FaceIdentification";
import Services from "@/pages/Services";
import ManualEntry from "@/pages/ManualEntry";
import CustomerManagement from "@/pages/CustomerManagement";
import AutomationDashboard from "@/pages/automation-dashboard";
import Shop from "@/pages/shop";
import ProductManagement from "@/pages/product-management";
import BioStarTest from "@/pages/biostar-test";
import RemoteDoor from "@/pages/remote-door";
import FaceRegistration from "@/pages/face-registration";
import HealthForm from "@/pages/health-form";
import Chat from "@/pages/chat";

// Import component examples for preview
import LogoExample from "@/components/examples/Logo";
import ServiceCardExample from "@/components/examples/ServiceCard";
import NavigationBarExample from "@/components/examples/NavigationBar";
import StatusDisplayExample from "@/components/examples/StatusDisplay";
import TouchInterfaceExample from "@/components/examples/TouchInterface";

function Router() {
  return (
    <Switch>
      {/* Main Tan & Co CRM Interface */}
      <Route path="/" component={() => <TouchInterfaceComponent />} />
      <Route path="/face-id" component={FaceIdentification} />
      <Route path="/services" component={Services} />
      <Route path="/manual-entry" component={ManualEntry} />
      <Route path="/customers" component={CustomerManagement} />
      <Route path="/automation" component={AutomationDashboard} />
      <Route path="/shop" component={Shop} />
      <Route path="/products" component={ProductManagement} />
      <Route path="/biostar-test" component={BioStarTest} />
      <Route path="/remote-door" component={RemoteDoor} />
      <Route path="/face-registration/:customerId" component={FaceRegistration} />
      <Route path="/health-form/:customerId" component={HealthForm} />
      <Route path="/chat" component={Chat} />
      
      {/* Component Examples for Development/Preview */}
      <Route path="/examples/logo" component={LogoExample} />
      <Route path="/examples/service-card" component={ServiceCardExample} />
      <Route path="/examples/navigation" component={NavigationBarExample} />
      <Route path="/examples/status" component={StatusDisplayExample} />
      <Route path="/examples/touch-interface" component={TouchInterfaceExample} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
          <IconSidebar />
          <div className="pl-16">
            <Router />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
