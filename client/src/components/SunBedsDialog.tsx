import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, X, Lightbulb, Search, User, Phone, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import Alin from "@/components/Alin";
import { NewClientDialog } from "@/components/NewClientDialog";
import { PurchaseOverlay } from "@/components/PurchaseOverlay";
import ZenCarousel from "@/components/ZenCarousel";
import { Badge } from "@/components/ui/badge";
import bronzerIcon from '@assets/4_1759474624696.png';
import packageIcon from '@assets/member-card-icon.png';
import newCustomerIcon from '@assets/עיצוב ללא שם (4)_1760090011932.png';
import blueAlinGif from '@assets/עיצוב ללא שם (5)_1760108712417.gif';

interface SunBedsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SunBedsDialog({ open, onOpenChange }: SunBedsDialogProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showPricingOverlay, setShowPricingOverlay] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [showProductCarousel, setShowProductCarousel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  
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
    queryKey: ['/api/customers/search', { q: searchQuery }],
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
    isFunction: boolean;
    testId?: string;
    onClick: () => void;
  }> = [
    {
      icon: newCustomerIcon,
      iconType: 'image' as const,
      title: "לקוח חדש - הרשמה",
      isFunction: false,
      onClick: () => {
        setShowNewClientDialog(true);
      }
    },
    {
      icon: bronzerIcon,
      iconType: 'image' as const,
      title: "רכישת ברונזרים",
      isFunction: false,
      onClick: () => {
        setShowProductCarousel(true);
      }
    },
    {
      icon: packageIcon,
      iconType: 'image' as const,
      title: "רכישת חבילה",
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
        window.open('https://preview--radiant-booth-studio.lovable.app/', '_blank');
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
            <div className="text-gray-300 space-y-0.5 md:space-y-1 text-[10px] md:text-sm" dir="rtl">
              <p>• ללא צורך בתיאום מראש או קביעת תורים</p>
              <p>• כניסה עצמאית בכל שעה של היום ובכל שעה של הלילה</p>
              <p>• מיטות השיזוף זמינות 24/7 ללקוחות הבוטיק</p>
              <p>• הכניסה למתחם השיזוף לאחר שעות הפעילות כרוך בהרשמה למערכת זיהוי פנים מתקדמת</p>
              <p>• צוות מקצועי ומנוסה שיעניק לכם שירות ברמה הגבוהה ביותר</p>
              <p>• שעות פעילות: 10:00-19:00, ימי שישי 10:00-14:00, ימי שבת סגור</p>
              <p className="text-[10px] md:text-xs text-gray-400 mr-2">* בשירות עצמי לאחר שעות הפעילות</p>
              <p>• שירות לקוחות זמין 24/7 • סביבה נקיה, בטוחה ומקצועית</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container - positioned lower to avoid overlap */}
      <div 
        className="relative w-full max-w-4xl flex items-center justify-center mt-24 md:mt-80"
      >
        {/* Close Button */}
        <Button 
          onClick={() => onOpenChange(false)} 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 text-white z-10"
          data-testid="button-close-sun-beds"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Service Fields - All in one row on desktop, two rows on mobile */}
        <div className="w-full max-w-6xl mx-auto pl-14 pr-6 md:px-4 space-y-2 mt-6 md:mt-0">
          {/* Service Buttons */}
          <div className="grid grid-cols-2 md:flex gap-2 justify-center md:flex-nowrap animate-scale-in max-w-[188px] md:max-w-none mx-auto">
            {tanningOptions.map((option, index) => (
              <div key={index} className="relative">
                {/* Solid black background */}
                <div className="absolute inset-0 bg-black rounded-md" />
                
                <button
                  onClick={option.onClick}
                  className="
                    group relative h-[85px] w-[90px] md:h-[160px] md:w-[150px]
                    bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90
                    border hover:border-2
                    rounded-md backdrop-blur-sm
                    flex flex-col items-center justify-between pb-2 md:pb-4
                    transition-all duration-150 ease-in-out
                    hover-elevate active-elevate-2
                    overflow-visible
                  "
                  style={{
                    borderColor: 'rgba(236, 72, 153, 0.6)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 1)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.6)'}
                  data-testid={(option as any).testId || `action-tile-${index}`}
                >
                <div className="h-14 md:h-32 flex items-center justify-center transition-all duration-150 group-hover:scale-110 overflow-visible">
                  {option.iconType === 'image' ? (
                    <img 
                      src={option.icon as string}
                      alt={option.title}
                      className={`${
                        option.title === "AI TAN"
                          ? "scale-[1.0] md:scale-[1.9] mt-2"
                          : option.title === "רכישת חבילה"
                          ? "w-16 h-16 md:w-40 md:h-40"
                          : option.title === "רכישת ברונזרים"
                          ? "w-14 h-14 md:w-30 md:h-30"
                          : option.title === "לקוח חדש - הרשמה"
                          ? "w-12 h-12 md:w-28 md:h-28"
                          : "w-14 h-14 md:w-32 md:h-32"
                      } object-contain ${
                        option.title === "AI TAN"
                          ? "group-hover:drop-shadow-[0_0_30px_rgb(59,130,246)]"
                          : "group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                      }`}
                      style={{
                        filter: option.title === "AI TAN"
                          ? 'contrast(1.15) brightness(1.05) drop-shadow(0 0 20px rgb(59, 130, 246)) drop-shadow(0 0 35px rgba(59, 130, 246, 0.8))'
                          : 'contrast(1.15) brightness(1.05) drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))'
                      }}
                    />
                  ) : option.iconType === 'component' ? (
                    <div className="scale-[0.85] md:scale-[1.4] flex items-center justify-center mt-2">
                      <option.icon size={160} className="max-w-[95px] md:max-w-[190px] max-h-[95px] md:max-h-[190px]" />
                    </div>
                  ) : option.icon && !option.isFunction && (
                    <option.icon 
                      className="w-14 h-14 md:w-32 md:h-32 text-pink-400 group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,1)]"
                      style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))' }}
                    />
                  )}
                </div>
                <span className="text-[14px] md:text-base font-medium text-white text-center font-hebrew px-1 md:px-2 leading-tight">
                  {option.title}
                </span>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-radial from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
              </div>
            ))}
          </div>

          {/* Customer Search Bar - Moved below buttons */}
          <div className="w-[188px] md:w-[308px] mx-auto" dir="rtl">
            <div className="relative">
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-pink-500" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.8))' }}
              />
              <Input
                type="text"
                placeholder="חיפוש לקוח קיים..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedCustomerId(null);
                }}
                className="pr-10 pl-3 h-10 text-sm bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-2 border-pink-500/60 hover:border-pink-500 focus:border-pink-500 text-white placeholder:text-gray-400 text-right backdrop-blur-md rounded-lg transition-all duration-200"
                style={{
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)'
                }}
                data-testid="input-search-existing-customer"
              />
            </div>

            {/* Search Results */}
            {searchQuery.length >= 2 && (
              <div className="mt-4 space-y-3 max-h-[280px] overflow-y-auto">
                {isSearching ? (
                  <div className="text-center py-6 text-gray-400 bg-slate-900/70 rounded-lg backdrop-blur-sm border border-pink-500/20">
                    מחפש...
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-6 space-y-2 bg-slate-900/70 rounded-lg backdrop-blur-sm border border-pink-500/20">
                    <p className="text-gray-400">לא נמצאו לקוחות</p>
                  </div>
                ) : (
                  <>
                    {customers.map((customer: any) => (
                      <div
                        key={customer.id}
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                          selectedCustomerId === customer.id
                            ? 'bg-pink-500/20 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                            : 'bg-slate-900/70 border-slate-700 hover:border-pink-500/50'
                        }`}
                        data-testid={`customer-result-${customer.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-pink-500" />
                              <span className="text-lg font-semibold text-white">{customer.fullName}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <span>{customer.phone}</span>
                              </div>
                              
                              {customer.email && (
                                <div className="flex items-center gap-1">
                                  <span>📧</span>
                                  <span>{customer.email}</span>
                                </div>
                              )}
                              
                              {customer.dateOfBirth && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(customer.dateOfBirth).toLocaleDateString('he-IL')}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {customer.healthFormSigned && (
                                <Badge variant="outline" className="text-green-500 border-green-500/50 text-xs">
                                  ✓ טופס בריאות
                                </Badge>
                              )}
                              {customer.faceRecognitionId && (
                                <Badge variant="outline" className="text-blue-500 border-blue-500/50 text-xs">
                                  ✓ זיהוי פנים
                                </Badge>
                              )}
                            </div>

                            {/* Customer Memberships */}
                            {selectedCustomerId === customer.id && memberships.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-pink-500/20">
                                <h4 className="text-sm font-bold text-white mb-2">מנויים פעילים:</h4>
                                <div className="space-y-2">
                                  {memberships.map((membership: any) => (
                                    <div
                                      key={membership.id}
                                      className={`p-2 rounded border text-xs ${
                                        membership.isActive && membership.balance > 0
                                          ? 'bg-green-500/10 border-green-500/50'
                                          : 'bg-gray-500/10 border-gray-500/50'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-white font-semibold">
                                          {getMembershipTypeLabel(membership.type)}
                                        </span>
                                        <span className="text-pink-400">
                                          יתרה: {membership.balance} כניסות
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
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
          <Alin className="scale-[1.05] md:scale-[1.35] max-w-[120px] max-h-[120px] md:max-w-[150px] md:max-h-[150px]" />
        </button>
      </div>

    </div>
  );
}
