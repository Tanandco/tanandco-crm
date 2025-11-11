import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, Fingerprint, ArrowRight, CheckCircle2, User, Phone, Mail, Calendar, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function QuickSearch() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedMembership, setSelectedMembership] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const { data: customersResponse } = useQuery<{success: boolean; data: any[]}>({
    queryKey: ['/api/customers'],
  });

  const { data: membershipsResponse } = useQuery<{success: boolean; data: any[]}>({
    queryKey: ['/api/memberships'],
  });

  const customers = customersResponse?.data;
  const memberships = membershipsResponse?.data;

  const filteredCustomers = customers?.filter(customer => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    return (
      customer.fullName?.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query)
    );
  });

  // Get active memberships for selected customer
  const customerMemberships = selectedCustomer
    ? memberships?.filter(m => m.customerId === selectedCustomer.id && m.isActive && m.balance > 0)
    : [];

  const handleFaceRecognition = async () => {
    setIsScanning(true);
    try {
      const response: any = await apiRequest('POST', '/api/biostar/identify');
      
      if (response.user && customers) {
        const customer = customers.find(c => c.faceRecognitionId === response.user.user_id);
        if (customer) {
          setSelectedCustomer(customer);
          toast({
            title: '✅ זוהה בהצלחה',
            description: `${customer.fullName} - זוהה בהצלחה`,
          });
        } else {
          toast({
            title: '❌ לא נמצא',
            description: 'הפנים זוהו אך הלקוח לא נמצא במערכת',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: '❌ זיהוי נכשל',
          description: response.message || 'לא הצלחנו לזהות פנים',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'שגיאה בזיהוי פנים',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleMarkMembership = () => {
    if (!selectedMembership || !selectedCustomer) return;
    
    // Store selected membership and customer in localStorage for other pages to use
    localStorage.setItem('markedMembership', JSON.stringify({
      membership: selectedMembership,
      customer: selectedCustomer
    }));
    
    toast({
      title: '✅ כרטיסיה סומנה בהצלחה',
      description: `${selectedCustomer.fullName} - ${getMembershipLabel(selectedMembership.type)} (יתרה: ${selectedMembership.balance} כניסות)`,
    });
    
    // Navigate back to home
    setLocation('/');
  };

  const getMembershipLabel = (type: string) => {
    const labels: Record<string, string> = {
      'sun-beds': 'מיטות שיזוף',
      'spray-tan': 'שיזוף בהתזה',
      'hair-salon': 'מספרה',
      'massage': 'עיסוי',
      'facial': 'טיפולי פנים',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-950/95 via-purple-950/40 to-slate-950/95 backdrop-blur-lg border-b border-pink-500/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center gap-2">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
              className="border-pink-500/30 hover:border-pink-500/50 hover:bg-pink-500/10"
              data-testid="button-back"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <h1 
              className="text-3xl font-bold text-white flex-1"
              style={{
                textShadow: '0 0 20px rgba(236, 72, 153, 0.6)',
              }}
              data-testid="text-quick-search-title"
            >
              חיפוש מהיר - סימון כרטיסיה
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search & Face Recognition */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש לקוח לפי שם, טלפון או אימייל..."
              className="pr-10 bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white placeholder:text-gray-500 backdrop-blur-sm h-14 text-lg"
              data-testid="input-search"
              autoFocus
            />
          </div>

          {/* Face Recognition Button */}
          <Button
            onClick={handleFaceRecognition}
            disabled={isScanning}
            className="w-full h-16 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg"
            data-testid="button-face-recognition"
          >
            <Fingerprint className="w-6 h-6 ml-2" />
            {isScanning ? 'מזהה...' : 'זיהוי פנים'}
          </Button>
        </div>

        {/* Search Results */}
        {searchQuery && filteredCustomers && filteredCustomers.length > 0 && (
          <div className="space-y-3 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">תוצאות חיפוש</h2>
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.id}
                className={`cursor-pointer transition-all ${
                  selectedCustomer?.id === customer.id
                    ? 'bg-pink-500/20 border-pink-500'
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70'
                }`}
                onClick={() => {
                  setSelectedCustomer(customer);
                  setSelectedMembership(null);
                }}
                data-testid={`card-customer-${customer.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-pink-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{customer.fullName}</h3>
                        <p className="text-sm text-gray-400">{customer.phone}</p>
                      </div>
                    </div>
                    {selectedCustomer?.id === customer.id && (
                      <CheckCircle2 className="w-6 h-6 text-pink-400" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Selected Customer & Memberships */}
        {selectedCustomer && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/90 to-purple-900/30 border-pink-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-pink-400" />
                  {selectedCustomer.fullName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-pink-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  )}
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-pink-400" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                  )}
                  {selectedCustomer.dateOfBirth && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-pink-400" />
                      <span>{new Date(selectedCustomer.dateOfBirth).toLocaleDateString('he-IL')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Memberships */}
            {customerMemberships && customerMemberships.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">כרטיסיות פעילות</h2>
                <div className="space-y-3">
                  {customerMemberships.map((membership: any) => (
                    <Card
                      key={membership.id}
                      className={`cursor-pointer transition-all ${
                        selectedMembership?.id === membership.id
                          ? 'bg-pink-500/20 border-pink-500'
                          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/70'
                      }`}
                      onClick={() => setSelectedMembership(membership)}
                      data-testid={`card-membership-${membership.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                              <Ticket className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{getMembershipLabel(membership.type)}</h3>
                              <p className="text-sm text-gray-400">
                                יתרה: {membership.balance} כניסות
                              </p>
                              {membership.expiryDate && (
                                <p className="text-xs text-gray-500">
                                  תוקף עד: {new Date(membership.expiryDate).toLocaleDateString('he-IL')}
                                </p>
                              )}
                            </div>
                          </div>
                          {selectedMembership?.id === membership.id && (
                            <CheckCircle2 className="w-6 h-6 text-pink-400" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedMembership && (
                  <Button
                    onClick={handleMarkMembership}
                    className="w-full h-16 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xl mt-6"
                    data-testid="button-mark-membership"
                  >
                    <CheckCircle2 className="w-6 h-6 ml-2" />
                    סמן כרטיסיה זו
                  </Button>
                )}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-400">אין כרטיסיות פעילות</p>
                  <p className="text-sm text-gray-500 mt-2">ללקוח זה אין כרטיסיות פעילות עם יתרה</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {searchQuery && filteredCustomers && filteredCustomers.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-400">לא נמצאו לקוחות</p>
              <p className="text-sm text-gray-500 mt-2">נסה לחפש בשם, טלפון או אימייל אחר</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
