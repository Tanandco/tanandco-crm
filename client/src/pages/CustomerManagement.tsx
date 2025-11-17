import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserPlus, Edit, Trash2, Phone, Mail, Calendar, Star, ScanFace, Link, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import CustomerForm from '@/components/CustomerForm';
import type { Customer, Membership } from '@shared/schema';

interface CustomerWithMemberships extends Customer {
  memberships?: Membership[];
}

export default function CustomerManagement() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithMemberships | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { toast} = useToast();
  const queryClient = useQueryClient();

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
    select: (response: any) => response.data || []
  });

  // Search customers
  const { data: searchResults = [] } = useQuery<Customer[]>({
    queryKey: ['/api/customers/search', searchQuery],
    enabled: searchQuery.length > 2,
    select: (response: any) => response.data || []
  });

  const displayedCustomers = searchQuery.length > 2 ? searchResults : customers;

  // Create customer mutation
  const createCustomerMutation = useMutation<any, Error, any>({
    mutationFn: (data: any) => apiRequest('POST', '/api/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: 'הצלחה',
        description: 'הלקוח נוצר בהצלחה'
      });
      setIsCreateModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה',
        description: error.message || 'שגיאה ביצירת הלקוח',
        variant: 'destructive'
      });
    }
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation<any, Error, { id: string; data: any }>({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest('PUT', `/api/customers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: 'הצלחה',
        description: 'הלקוח עודכן בהצלחה'
      });
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה',
        description: error.message || 'שגיאה בעדכון הלקוח',
        variant: 'destructive'
      });
    }
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation<any, Error, string>({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: 'הצלחה',
        description: 'הלקוח נמחק בהצלחה'
      });
      setSelectedCustomer(null);
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה',
        description: error.message || 'שגיאה במחיקת הלקוח',
        variant: 'destructive'
      });
    }
  });

  // Face identification mutation
  const identifyFaceMutation = useMutation<any, Error, void>({
    mutationFn: () => apiRequest('POST', '/api/customers/identify-by-face'),
    onSuccess: (data) => {
      if (data.success && data.data) {
        setSelectedCustomer(data.data);
        setIsEditModalOpen(true);
        toast({
          title: 'זיהוי הצליח!',
          description: `לקוח זוהה: ${data.data.fullName}`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'זיהוי נכשל',
        description: error.message || 'לא ניתן לזהות פנים',
        variant: 'destructive',
      });
    }
  });

  // Associate face with customer mutation
  const associateFaceMutation = useMutation<any, Error, string>({
    mutationFn: (customerId: string) => apiRequest('POST', `/api/customers/${customerId}/associate-face`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: 'הצלחה',
        description: 'זיהוי פנים נקשר בהצלחה',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'שגיאה',
        description: error.message || 'קישור זיהוי הפנים נכשל',
        variant: 'destructive',
      });
    }
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('he-IL');
  };

  const getCustomerStatusBadge = (customer: Customer) => {
    if (customer.isNewClient) {
      return <Badge variant="secondary">לקוח חדש</Badge>;
    }
    if (!customer.healthFormSigned) {
      return <Badge variant="destructive">חסר הצהרת בריאות</Badge>;
    }
    return <Badge variant="default">פעיל</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
              size="icon"
              data-testid="button-back"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ניהול לקוחות
              </h1>
              <p className="text-slate-400 mt-2">
                מערכת ניהול לקוחות מתקדמת עם זיהוי פנים
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => identifyFaceMutation.mutate()}
              disabled={identifyFaceMutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              data-testid="button-identify-face"
            >
              <ScanFace className="ml-2 h-4 w-4" />
              {identifyFaceMutation.isPending ? 'מזהה...' : 'זיהוי פנים'}
            </Button>
            
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              data-testid="button-add-customer"
            >
              <UserPlus className="ml-2 h-4 w-4" />
              הוסף לקוח חדש
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="חפש לקוח לפי שם, טלפון או אימייל..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-pink-500"
            data-testid="input-search-customers"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Star className="ml-2 h-5 w-5 text-pink-500" />
                רשימת לקוחות ({displayedCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="text-slate-400 mt-2">טוען לקוחות...</p>
                </div>
              ) : displayedCustomers.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    {searchQuery ? 'לא נמצאו לקוחות' : 'אין לקוחות במערכת'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedCustomers.map((customer: Customer) => (
                    <div
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-pink-500/50 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      data-testid={`customer-card-${customer.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg">
                            {customer.fullName}
                          </h3>
                          <div className="flex items-center mt-1 text-slate-400">
                            <Phone className="h-4 w-4 ml-1" />
                            <span className="text-sm">{customer.phone}</span>
                            {customer.email && (
                              <>
                                <Mail className="h-4 w-4 mr-3 ml-1" />
                                <span className="text-sm">{customer.email}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center mt-2 text-xs text-slate-500">
                            <Calendar className="h-3 w-3 ml-1" />
                            נרשם ב-{formatDate(customer.createdAt)}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getCustomerStatusBadge(customer)}
                          {customer.faceRecognitionId && (
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              זיהוי פנים
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Details Panel */}
        <div>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">פרטי לקוח</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-2">
                      {selectedCustomer.fullName}
                    </h3>
                    {getCustomerStatusBadge(selectedCustomer)}
                  </div>

                  <Separator className="bg-slate-600" />

                  <div className="space-y-3">
                    <div className="flex items-center text-slate-300">
                      <Phone className="h-4 w-4 ml-2 text-pink-500" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    
                    {selectedCustomer.email && (
                      <div className="flex items-center text-slate-300">
                        <Mail className="h-4 w-4 ml-2 text-pink-500" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                    )}

                    <div className="flex items-center text-slate-300">
                      <Calendar className="h-4 w-4 ml-2 text-pink-500" />
                      <span>נרשם ב-{formatDate(selectedCustomer.createdAt)}</span>
                    </div>
                  </div>

                  {selectedCustomer.notes && (
                    <>
                      <Separator className="bg-slate-600" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">הערות</h4>
                        <p className="text-slate-300 text-sm">{selectedCustomer.notes}</p>
                      </div>
                    </>
                  )}

                  <Separator className="bg-slate-600" />

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      data-testid="button-edit-customer"
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      עריכה
                    </Button>
                    
                    {!selectedCustomer.faceRecognitionId ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => associateFaceMutation.mutate(selectedCustomer.id)}
                        disabled={associateFaceMutation.isPending}
                        data-testid="button-link-face-customer"
                      >
                        <Link className="h-4 w-4 ml-1" />
                        קישור זיהוי פנים
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <ScanFace className="h-3 w-3 ml-1" />
                        זיהוי פנים מקושר
                      </Badge>
                    )}
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCustomerMutation.mutate(selectedCustomer.id)}
                      disabled={deleteCustomerMutation.isPending}
                      data-testid="button-delete-customer"
                    >
                      <Trash2 className="h-4 w-4 ml-1" />
                      מחיקה
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">בחר לקוח לצפייה בפרטים</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Creation Modal */}
      <CustomerForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createCustomerMutation.mutate(data)}
        isLoading={createCustomerMutation.isPending}
      />

      {/* Customer Edit Modal */}
      <CustomerForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => updateCustomerMutation.mutate({ 
          id: selectedCustomer!.id, 
          data 
        })}
        customer={selectedCustomer}
        isLoading={updateCustomerMutation.isPending}
      />
    </div>
  );
}
