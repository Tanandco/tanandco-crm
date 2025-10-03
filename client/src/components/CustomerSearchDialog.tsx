import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, User, Phone, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  healthFormSigned: boolean;
  faceRecognitionId?: string;
}

interface Membership {
  id: string;
  type: string;
  balance: number;
  totalPurchased: number;
  expiryDate?: string;
  isActive: boolean;
}

interface CustomerSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerSelect?: (customer: Customer) => void;
}

export default function CustomerSearchDialog({ open, onOpenChange, onCustomerSelect }: CustomerSearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

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

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
  };

  const selectedCustomer = customers.find((c: Customer) => c.id === selectedCustomerId);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-gradient-to-br from-slate-950 via-black to-slate-900 border-pink-500/30"
        style={{
          boxShadow: '0 0 60px rgba(236, 72, 153, 0.3)'
        }}
      >
        <DialogHeader className="border-b border-pink-500/20 pb-4">
          <DialogTitle className="text-2xl font-bold text-white text-right font-hebrew">
            חיפוש לקוח קיים
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6" dir="rtl">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="חיפוש לפי שם, טלפון או מייל..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-slate-900/50 border-pink-500/30 text-white placeholder:text-gray-500 text-right"
              data-testid="input-search-customer"
            />
          </div>

          {/* Search Results */}
          {searchQuery.length >= 2 && (
            <div className="space-y-4">
              {isSearching ? (
                <div className="text-center py-8 text-gray-400">
                  מחפש...
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto" />
                  <p className="text-gray-400">לא נמצאו לקוחות</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customers.map((customer: Customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerClick(customer)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedCustomerId === customer.id
                          ? 'bg-pink-500/20 border-pink-500'
                          : 'bg-slate-900/30 border-slate-700 hover:border-pink-500/50'
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
                              <Badge variant="outline" className="text-green-500 border-green-500/50">
                                ✓ טופס בריאות
                              </Badge>
                            )}
                            {customer.faceRecognitionId && (
                              <Badge variant="outline" className="text-blue-500 border-blue-500/50">
                                ✓ זיהוי פנים
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customer Details & Memberships */}
          {selectedCustomer && (
            <div className="border-t border-pink-500/20 pt-6 space-y-4">
              <h3 className="text-xl font-bold text-white font-hebrew">מנויים פעילים</h3>
              
              {memberships.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <CreditCard className="w-12 h-12 text-gray-500 mx-auto" />
                  <p className="text-gray-400">אין מנויים פעילים</p>
                  <p className="text-sm text-gray-500">הלקוח יכול לרכוש מנוי חדש</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {memberships.map((membership: Membership) => (
                    <div
                      key={membership.id}
                      className={`p-4 rounded-lg border ${
                        membership.isActive && membership.balance > 0
                          ? 'bg-green-500/10 border-green-500/50'
                          : 'bg-gray-500/10 border-gray-500/50'
                      }`}
                      data-testid={`membership-${membership.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-white">
                              {getMembershipTypeLabel(membership.type)}
                            </span>
                            {membership.isActive && membership.balance > 0 ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                                פעיל
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">
                                לא פעיל
                              </Badge>
                            )}
                          </div>
                          
                          <div className="mt-2 flex gap-4 text-sm text-gray-400">
                            <span>יתרה: <span className="text-pink-400 font-semibold">{membership.balance}</span> כניסות</span>
                            <span>נרכשו: {membership.totalPurchased} כניסות</span>
                            {membership.expiryDate && (
                              <span>תוקף עד: {new Date(membership.expiryDate).toLocaleDateString('he-IL')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-pink-500/20 p-4 flex justify-center">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="bg-slate-900/50 border-pink-500/30 text-white hover:bg-pink-500/20"
            data-testid="button-close-search"
          >
            <X className="w-4 h-4 ml-2" />
            סגור
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
