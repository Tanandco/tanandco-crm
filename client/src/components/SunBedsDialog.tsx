import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, X, Lightbulb, Search, User, Phone, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import Alin from "@/components/Alin";
import { NewClientDialog } from "@/components/NewClientDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";
import ZenCarousel from "@/components/ZenCarousel";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import bronzerIcon from '@assets/4_1759474624696.png';
import packageIcon from '@assets/member-card-icon.png';
import newCustomerIcon from '@assets/עיצוב ללא שם (4)_1760090011932.png';
import blueAlinGif from '@assets/עיצוב ללא שם (5)_1760108712417.gif';
import searchIconImage from '@assets/Dהורדותfreepik__spray-tan-variation-b-modern-flatbadge-3d-spray-gu__47717.png_1760198215208.png';

interface SunBedsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ActionTile Component for consistent mobile sizing
interface ActionTileProps {
  children: React.ReactNode;
  onClick?: () => void;
  isBlue?: boolean;
  className?: string;
  testId?: string;
}

function ActionTile({ children, onClick, isBlue = false, className = "", testId }: ActionTileProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black rounded-md" />
      <button
        onClick={onClick}
        className={`
          group relative h-[95px] w-[68px] md:h-[160px] md:w-[170px]
          bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
          border hover:border-2
          rounded-md backdrop-blur-sm
          grid grid-rows-[60px_1fr] md:grid-rows-[115px_1fr]
          transition-all duration-150 ease-in-out
          hover-elevate active-elevate-2
          overflow-hidden
          ${className}
        `}
        style={{
          borderColor: isBlue ? 'rgba(59, 130, 246, 0.6)' : 'rgba(236, 72, 153, 0.6)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = isBlue ? 'rgba(59, 130, 246, 1)' : 'rgba(236, 72, 153, 1)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = isBlue ? 'rgba(59, 130, 246, 0.6)' : 'rgba(236, 72, 153, 0.6)'}
        data-testid={testId}
      >
        {children}
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-md overflow-hidden pointer-events-none">
          <div className={`absolute inset-0 bg-gradient-radial ${isBlue ? "from-blue-400/20" : "from-pink-400/20"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
      </button>
    </div>
  );
}

export default function SunBedsDialog({ open, onOpenChange }: SunBedsDialogProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showPricingOverlay, setShowPricingOverlay] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showProductCarousel, setShowProductCarousel] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const [editingUsageId, setEditingUsageId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string>('');
  
  const fullText = "היי אני אלין , אני פה לעזור לכם בכל שלב בכל שעה , מבטיחה לא לחפור";
  
  useEffect(() => {
    if (open) {
      setTypedText("");
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 80);
      
      return () => clearInterval(typingInterval);
    }
  }, [open]);

  // Fetch bed bronzer products for carousel
  const { data: bedBronzers, isLoading: loadingBedBronzers } = useQuery<any[]>({
    queryKey: ['/api/products', { tanningType: 'bed-bronzer' }],
    queryFn: async () => {
      const res = await fetch(`/api/products?tanningType=bed-bronzer`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch bed bronzers');
      return res.json();
    },
    enabled: showProductCarousel,
  });

  // Search customers query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['/api/customers/search', searchQuery],
    enabled: searchQuery.length >= 2,
  });

  // Get customer memberships when customer is selected
  const { data: membershipsData } = useQuery({
    queryKey: ['/api/customers', selectedCustomerId, 'memberships'],
    enabled: !!selectedCustomerId,
  });

  const customers = (searchResults as any)?.data || [];
  const memberships = (membershipsData as any)?.data || [];

  // Transform bed bronzer products for ZenCarousel
  const bedBronzerProducts = bedBronzers?.filter(p => p.is_featured || p.isFeatured).map((p) => ({
    id: p.id,
    name: p.name_he || p.nameHe || p.name,
    price: parseFloat(p.sale_price || p.salePrice || p.price),
    image: p.images?.[0] || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    images: p.images || [],
    category: (p.brand && p.brand !== 'OTHER') ? p.brand : 'ברונזרים למיטות שיזוף',
    description: p.description_he || p.descriptionHe || p.description,
    badge: p.badge,
    bronzerStrength: p.bronzer_strength || p.bronzerStrength,
  })) || [];

  const handleAddToCart = (productId: string) => {
    const product = bedBronzerProducts.find(p => p.id === productId);
    toast({
      title: '✨ נוסף!',
      description: `${product?.name} נוסף בהצלחה`,
      duration: 2000,
    });
  };

  if (!open) return null;

  const tanningOptions: Array<{
    icon: string | any;
    iconType: 'image' | 'component' | 'lucide';
    title: string;
    mobileTitle?: string;
    isFunction: boolean;
    testId?: string;
    onClick: () => void;
  }> = [
    {
      icon: searchIconImage,
      iconType: 'image' as const,
      title: "חיפוש לקוח קיים",
      mobileTitle: "חיפוש לקוח\nקיים",
      isFunction: false,
      testId: "button-search-customer",
      onClick: () => {
        setShowQuickSearch(true);
      }
    },
    {
      icon: newCustomerIcon,
      iconType: 'image' as const,
      title: "לקוח חדש - הרשמה",
      mobileTitle: "לקוח חדש\nהרשמה",
      isFunction: false,
      onClick: () => {
        setShowNewClientDialog(true);
      }
    },
    {
      icon: bronzerIcon,
      iconType: 'image' as const,
      title: "רכישת ברונזרים",
      mobileTitle: "רכישת\nברונזרים",
      isFunction: false,
      onClick: () => {
        setShowProductCarousel(true);
      }
    },
    {
      icon: packageIcon,
      iconType: 'image' as const,
      title: "רכישת חבילה",
      mobileTitle: "רכישת\nחבילה",
      isFunction: false,
      testId: "button-purchase-overlay",
      onClick: () => {
        setShowPricingOverlay(true);
      }
    },
    {
      icon: blueAlinGif,
      iconType: 'image' as const,
      title: "AI TAN",
      isFunction: false,
      onClick: () => {
        navigate('/ai-tan');
      }
    }
  ];

  const getMembershipTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'sun-beds': 'מיטות שיזוף',
      'spray-tan': 'שיזוף בריסוס',
      'hair-salon': 'מספרה',
      'massage': 'עיסוי',
      'facial': 'טיפולי פנים'
    };
    return labels[type] || type;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Purple Neon Overlay Background */}
      <div className="absolute inset-0">
        {/* Purple background */}
        <div className="absolute inset-0 bg-purple-500/50 backdrop-blur-sm" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-70" />
      </div>
      
      {/* Back to Self Service Button - moved to top corner */}
      <div className="absolute top-4 right-4 z-30">
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="outline" 
          size="icon" 
          className="bg-white/10 border-white/20 text-white backdrop-blur-sm h-8 w-8"
          data-testid="button-back-to-self-service"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>

      {/* Welcome Header */}
      <div className={`absolute top-2 left-0 right-0 z-20 transition-opacity duration-300 ${searchQuery.length >= 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="text-center space-y-2 md:space-y-4 px-4">
          <div className="flex items-center justify-center mb-1">
            <h1 
              className="text-sm md:text-xl font-bold text-white font-varela tracking-wide" 
              style={{ fontFamily: "'Varela Round', sans-serif !important" }}
            >
              ברוכים הבאים לעולם המחר של תעשיית השיזוף
            </h1>
          </div>
          
          {/* Pink Neon Separator */}
          <div className="relative py-1 flex justify-center">
            <div 
              className="w-1/2 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" 
              style={{
                filter: 'drop-shadow(0 0 16px rgba(236, 72, 153, 1)) drop-shadow(0 0 32px rgba(236, 72, 153, 1)) drop-shadow(0 0 48px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 64px rgba(236, 72, 153, 0.6))',
                boxShadow: '0 0 35px rgba(236, 72, 153, 1), 0 0 60px rgba(236, 72, 153, 0.8), 0 0 80px rgba(236, 72, 153, 0.6), inset 0 0 20px rgba(236, 72, 153, 0.5)'
              }}
            />
            <div className="absolute inset-0 flex justify-center">
              <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-80 blur-sm animate-pulse" />
            </div>
          </div>
          
          {/* About Us Section */}
          <div className="px-2 mx-[9px]">
            <p className="text-xs md:text-sm font-semibold text-white mb-2 md:mb-3 text-center font-varela">
              גאים להוביל את המודל ההייברידי של עולם השיזוף
            </p>
            <div className="text-gray-300 space-y-0.5 md:space-y-1 text-xs md:text-base" dir="rtl">
              <p>• ללא צורך בתיאום מראש או קביעת תורים</p>
              <p>• כניסה עצמאית בכל שעה של היום ובכל שעה של הלילה</p>
              <p>• מיטות השיזוף זמינות 24/7 ללקוחות הבוטיק</p>
              <p>• הכניסה למתחם השיזוף לאחר שעות הפעילות כרוך בהרשמה למערכת זיהוי פנים מתקדמת</p>
              <p>• צוות מקצועי ומנוסה שיעניק לכם שירות ברמה הגבוהה ביותר</p>
              <p>• שעות פעילות: 10:00-19:00, ימי שישי 10:00-14:00, ימי שבת סגור</p>
              <p className="text-xs md:text-sm text-gray-400 mr-2">* בשירות עצמי לאחר שעות הפעילות</p>
              <p>• שירות לקוחות זמין 24/7 • סביבה נקיה, בטוחה ומקצועית</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container - repositioned with more space */}
      <div 
        className="relative w-full max-w-4xl flex items-center justify-center mt-16 md:mt-72"
      >
        {/* Service Fields - All in one row on both mobile and desktop */}
        <div className="w-full max-w-6xl mx-auto space-y-2 mt-6 md:mt-0">
          {/* Service Buttons */}
          <div className="flex gap-1.5 md:gap-2 justify-center flex-nowrap animate-scale-in px-2 md:px-0">
            {tanningOptions.map((option, index) => (
              <ActionTile
                key={index}
                onClick={option.onClick}
                isBlue={option.title === "AI TAN"}
                testId={(option as any).testId || `action-tile-${index}`}
              >
                {/* Icon row */}
                <div className="flex items-center justify-center transition-all duration-150 group-hover:scale-105">
                  {option.iconType === 'image' ? (
                    <img 
                      src={option.icon as string}
                      alt={option.title}
                      className={`object-contain ${
                        option.title === "AI TAN"
                          ? "w-[110%] h-[110%] group-hover:drop-shadow-[0_0_30px_rgb(59,130,246)]"
                          : option.title === "רכישת חבילה"
                          ? "w-[105%] h-[105%] group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                          : option.title === "לקוח חדש - הרשמה"
                          ? "w-[85%] h-[85%] group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                          : option.title === "חיפוש לקוח קיים"
                          ? "w-[90%] h-[90%] group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                          : "w-full h-full group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                      }`}
                      style={{
                        filter: option.title === "AI TAN"
                          ? 'contrast(1.15) brightness(1.05) drop-shadow(0 0 20px rgb(59, 130, 246)) drop-shadow(0 0 35px rgba(59, 130, 246, 0.8))'
                          : 'contrast(1.15) brightness(1.05) drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
                      }}
                    />
                  ) : option.iconType === 'component' ? (
                    <div className="scale-[0.65] md:scale-[1.2] flex items-center justify-center">
                      <option.icon size={120} />
                    </div>
                  ) : option.icon && !option.isFunction && (
                    <option.icon 
                      className="w-full h-full text-pink-400 group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                      style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}
                    />
                  )}
                </div>
                
                {/* Text row */}
                <div className="flex items-center justify-center px-0.5 md:px-1">
                  <span className="text-[8px] md:text-sm font-medium text-white text-center font-hebrew leading-tight">
                    {option.title}
                  </span>
                </div>
              </ActionTile>
            ))}
          </div>

        </div>
      </div>

      {/* New Client Dialog */}
      <NewClientDialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog} />

      {/* Purchase Overlay */}
      {showPricingOverlay && (
        <PurchaseOverlay 
          open={showPricingOverlay} 
          onClose={() => setShowPricingOverlay(false)} 
        />
      )}

      {/* Product Carousel */}
      {showProductCarousel && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto" dir="rtl">
          <div className="relative w-full max-w-5xl">
            <Button 
              onClick={() => setShowProductCarousel(false)} 
              variant="outline" 
              size="lg" 
              className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20"
              data-testid="button-close-carousel"
            >
              <X className="w-6 h-6 ml-2" />
              סגור
            </Button>
            
            {/* Carousel Title */}
            <h2 className="text-xl md:text-2xl font-semibold text-center mt-6 mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              ברונזרים למיטות שיזוף
            </h2>
            
            <div className="mt-12">
              {bedBronzerProducts.length > 0 ? (
                <ZenCarousel 
                  products={bedBronzerProducts} 
                  onAddToCart={handleAddToCart}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-white">טוען מוצרים...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alin Chatbot - Bottom right */}
      <div className="fixed bottom-0 right-4 z-30 flex items-center justify-end -space-x-12 translate-y-4">
        {/* Text bubble with typing animation */}
        {typedText && (
          <div 
            className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2 border-pink-500/60 text-white px-4 py-2 rounded-lg backdrop-blur-md animate-in slide-in-from-left duration-700 max-w-[75vw] md:max-w-2xl transition-all duration-200"
            style={{ 
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            <p className="text-[10px] md:text-sm font-hebrew leading-snug whitespace-nowrap">
              {typedText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
        )}
        
        {/* Alin avatar - clickable chatbot */}
        <button
          onClick={() => window.open('https://preview--radiant-booth-studio.lovable.app/', '_blank')}
          className="hover:scale-110 transition-transform duration-200 relative z-10"
          data-testid="button-alin-chatbot"
          style={{ filter: 'contrast(1.15) brightness(1.05) drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))' }}
        >
          <Alin className="scale-[1.05] md:scale-[1.1] max-w-[120px] max-h-[120px] md:max-w-[140px] md:max-h-[140px]" />
        </button>
      </div>

      {/* Quick Search Overlay */}
      {showQuickSearch && (
        <div className="fixed inset-0 z-[60] bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900/95 to-black/95 rounded-lg flowing-border p-6">
            <Button 
              onClick={() => setShowQuickSearch(false)} 
              variant="outline" 
              size="icon" 
              className="absolute top-4 -left-10 border-white/60 hover:border-white bg-gradient-to-br from-white/20 to-gray-200/20 hover:from-white/30 hover:to-gray-200/30 transition-all duration-300"
              style={{ 
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
              }}
              data-testid="button-close-quick-search"
            >
              <X className="w-5 h-5 text-white" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
            </Button>
            
            <h1 
              className="text-2xl md:text-3xl font-bold text-white text-center mb-6"
              style={{
                textShadow: '0 0 20px rgba(236, 72, 153, 0.6)',
              }}
            >
              חיפוש מהיר - סימון כרטיסיה
            </h1>

            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" 
                  style={{ filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))' }}
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חפש לקוח לפי שם או טלפון..."
                  className="pr-10 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white placeholder:text-gray-500 backdrop-blur-sm h-14 text-lg"
                  data-testid="input-quick-search"
                />
              </div>

              {/* Search Results */}
              {isSearching && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="text-gray-400 mt-4">מחפש לקוחות...</p>
                </div>
              )}

              {!isSearching && searchQuery.length >= 2 && customers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">לא נמצאו לקוחות התואמים לחיפוש</p>
                </div>
              )}

              {!isSearching && customers.length > 0 && (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {customers.map((customer: any) => (
                    <div
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomerId(customer.id);
                        setSearchQuery('');
                      }}
                      className="p-4 bg-gradient-to-br from-gray-800/60 to-black/60 border border-pink-500/30 rounded-lg cursor-pointer hover:border-pink-500/60 transition-all duration-200"
                      style={{
                        boxShadow: selectedCustomerId === customer.id 
                          ? '0 0 20px rgba(236, 72, 153, 0.4)' 
                          : 'none'
                      }}
                      data-testid={`customer-result-${customer.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-pink-400" />
                            <span className="text-white font-semibold">{customer.fullName}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Phone className="w-3 h-3" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                        {selectedCustomerId === customer.id && (
                          <div className="text-pink-400 text-sm">✓ נבחר</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedCustomerId && memberships.length > 0 && (
                <div className="mt-6 pt-6 border-t border-pink-500/30 space-y-3">
                  {memberships
                    .sort((a: any, b: any) => {
                      // Active memberships first, then expired
                      if (a.balance > 0 && b.balance === 0) return -1;
                      if (a.balance === 0 && b.balance > 0) return 1;
                      return 0;
                    })
                    .map((membership: any) => {
                    const totalPurchased = membership.total_purchased || membership.totalPurchased || 10;
                    const used = totalPurchased - membership.balance;
                    const usageHistory = membership.usageHistory || [];
                    const isExpired = membership.balance === 0;
                    
                    return (
                      <div
                        key={membership.id}
                        className={`p-3 border rounded-lg ${
                          isExpired 
                            ? 'bg-gradient-to-br from-gray-900/60 to-black/60 border-gray-600/40 opacity-70' 
                            : 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-pink-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-semibold text-sm whitespace-nowrap">{getMembershipTypeLabel(membership.membership_type)}</span>
                          {isExpired && (
                            <span className="text-xs text-gray-500 bg-gray-800/60 px-2 py-0.5 rounded">נגמרה</span>
                          )}
                          <Button
                            onClick={async () => {
                              try {
                                const response = await fetch(`/api/memberships/${membership.id}/use`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                });
                                if (!response.ok) {
                                  const error = await response.json();
                                  throw new Error(error.error || 'Failed to mark usage');
                                }
                                toast({
                                  title: '✅ סומן',
                                  description: `כניסה ${used + 1}`,
                                  duration: 2000,
                                });
                                queryClient.invalidateQueries({ queryKey: ['/api/customers', selectedCustomerId, 'memberships'] });
                              } catch (error: any) {
                                toast({
                                  title: '❌ שגיאה',
                                  description: error.message || 'נכשל',
                                  variant: 'destructive',
                                  duration: 3000,
                                });
                              }
                            }}
                            disabled={membership.balance === 0}
                            size="sm"
                            className="mr-auto bg-pink-500/20 hover:bg-pink-500/30 text-white text-xs disabled:opacity-50"
                            data-testid={`button-mark-usage-${membership.id}`}
                          >
                            ✓ סמן
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: totalPurchased }).map((_, index) => {
                            const isPunched = index >= (totalPurchased - used);
                            const usageIndex = isPunched ? ((totalPurchased - 1) - index) : -1;
                            const usage = usageIndex >= 0 && usageHistory[usageIndex] ? usageHistory[usageIndex] : null;
                            
                            return (
                              <div key={index} className="flex flex-col items-center group/slot relative">
                                <div
                                  className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all ${
                                    isPunched
                                      ? 'bg-gray-700/40 text-gray-500' 
                                      : 'bg-pink-500/40 text-pink-300'
                                  }`}
                                >
                                  {index + 1}
                                  
                                  {/* Edit/Delete buttons - only show on hover for punched slots */}
                                  {isPunched && usage && (
                                    <div className="absolute -top-1 -right-1 opacity-0 group-hover/slot:opacity-100 transition-opacity flex gap-0.5 z-10">
                                      <button
                                        onClick={async () => {
                                          const date = new Date(usage.createdAt);
                                          setEditingUsageId(usage.id);
                                          setEditingDate(date.toISOString().split('T')[0]);
                                        }}
                                        className="w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
                                        title="ערוך תאריך"
                                        data-testid={`button-edit-usage-${usage.id}`}
                                      >
                                        <Edit className="w-1.5 h-1.5 text-white" />
                                      </button>
                                      <button
                                        onClick={async () => {
                                          if (!confirm('האם אתה בטוח שברצונך לבטל סימון זה?')) return;
                                          
                                          try {
                                            await apiRequest('DELETE', `/api/session-usage/${usage.id}`);
                                            // Force refetch to get updated data
                                            await queryClient.refetchQueries({ 
                                              queryKey: ['/api/customers', selectedCustomerId, 'memberships']
                                            });
                                            toast({
                                              title: '✅ בוטל',
                                              description: 'הסימון בוטל בהצלחה',
                                              duration: 2000,
                                            });
                                          } catch (error: any) {
                                            toast({
                                              title: '❌ שגיאה',
                                              description: error.message || 'נכשל',
                                              variant: 'destructive',
                                              duration: 3000,
                                            });
                                          }
                                        }}
                                        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                                        title="בטל סימון"
                                        data-testid={`button-delete-usage-${usage.id}`}
                                      >
                                        <X className="w-1.5 h-1.5 text-white" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {usage && (
                                  <span className="text-[8px] text-gray-400 mt-0.5 whitespace-nowrap">
                                    {new Date(usage.createdAt).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="text-center py-12 text-gray-400">
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>הקלד לפחות 2 תווים לחיפוש</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Date Dialog */}
      <Dialog open={!!editingUsageId} onOpenChange={(open) => !open && setEditingUsageId(null)}>
        <DialogContent className="bg-gradient-to-br from-gray-900/95 to-black/95 border-pink-500/30" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-white text-center" style={{ textShadow: '0 0 20px rgba(236, 72, 153, 0.6)' }}>
              עריכת תאריך כניסה
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">תאריך</label>
              <Input
                type="date"
                value={editingDate}
                onChange={(e) => setEditingDate(e.target.value)}
                className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white"
                data-testid="input-edit-date"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setEditingUsageId(null)}
                variant="outline"
                className="flex-1 border-gray-500/30 text-gray-300 hover:bg-gray-700/50"
                data-testid="button-cancel-edit"
              >
                ביטול
              </Button>
              <Button
                onClick={async () => {
                  if (!editingUsageId || !editingDate) return;
                  
                  try {
                    await apiRequest('PATCH', `/api/session-usage/${editingUsageId}`, { date: editingDate });
                    // Force refetch to get updated data
                    await queryClient.refetchQueries({ 
                      queryKey: ['/api/customers', selectedCustomerId, 'memberships']
                    });
                    toast({
                      title: '✅ עודכן',
                      description: 'התאריך עודכן בהצלחה',
                      duration: 2000,
                    });
                    setEditingUsageId(null);
                    setEditingDate('');
                  } catch (error: any) {
                    toast({
                      title: '❌ שגיאה',
                      description: error.message || 'נכשל',
                      variant: 'destructive',
                      duration: 3000,
                    });
                  }
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                data-testid="button-save-edit"
              >
                שמור
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
