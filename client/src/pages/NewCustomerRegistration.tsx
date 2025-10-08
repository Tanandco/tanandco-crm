import { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, User, Phone, Calendar, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertCustomerSchema } from '@shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { z } from 'zod';

const registrationSchema = insertCustomerSchema.extend({
  membershipType: z.string().min(1, 'יש לבחור סוג כרטיסיה'),
  membershipSessions: z.string().min(1, 'יש לבחור מספר כניסות'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function NewCustomerRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'membership' | 'payment' | 'success'>('details');
  const [customerId, setCustomerId] = useState<string | null>(null);

  const { data: products } = useQuery<any>({
    queryKey: ['/api/products'],
  });

  const membershipProducts = products?.data?.filter((p: any) => p.productType === 'service') || [];

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: null,
      dateOfBirth: null,
      isNewClient: true,
      healthFormSigned: false,
      faceRecognitionId: null,
      notes: null,
      stage: 'lead_inbound',
      waOptIn: true,
      membershipType: '',
      membershipSessions: '',
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const customerData = {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        isNewClient: true,
        healthFormSigned: false,
        waOptIn: true,
      };
      
      const response = await apiRequest('POST', '/api/customers', customerData);
      return response;
    },
    onSuccess: (data: any) => {
      setCustomerId(data.data.id);
      setStep('membership');
      toast({
        title: '✅ פרטים נשמרו',
        description: 'עבור לבחירת כרטיסיה',
      });
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'נכשל בשמירת הפרטים',
        variant: 'destructive',
      });
    },
  });

  const createMembershipMutation = useMutation({
    mutationFn: async (data: { customerId: string; type: string; sessions: number }) => {
      const membershipData = {
        customerId: data.customerId,
        type: data.type,
        balance: data.sessions,
        totalPurchased: data.sessions,
        isActive: true,
      };
      
      const response = await apiRequest('POST', '/api/memberships', membershipData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/memberships'] });
      setStep('payment');
    },
    onError: (error: any) => {
      toast({
        title: '❌ שגיאה',
        description: error.message || 'נכשל ביצירת כרטיסיה',
        variant: 'destructive',
      });
    },
  });

  const onSubmitDetails = (data: RegistrationFormData) => {
    createCustomerMutation.mutate(data);
  };

  const onSubmitMembership = () => {
    const membershipType = form.getValues('membershipType');
    const sessions = parseInt(form.getValues('membershipSessions'));
    
    if (!customerId || !membershipType || !sessions) {
      toast({
        title: '❌ שגיאה',
        description: 'יש למלא את כל השדות',
        variant: 'destructive',
      });
      return;
    }

    createMembershipMutation.mutate({
      customerId,
      type: membershipType,
      sessions,
    });
  };

  const handlePayment = () => {
    // Here we would integrate with Cardcom
    // For now, simulate success
    setStep('success');
    toast({
      title: '✅ תשלום בוצע בהצלחה',
      description: 'לקוח נרשם בהצלחה!',
    });
  };

  const membershipOptions: { [key: string]: { label: string; sessions: number[] } } = {
    'sun-beds': {
      label: 'מיטות שיזוף',
      sessions: [5, 10, 15, 20],
    },
    'spray-tan': {
      label: 'שיזוף בהתזה',
      sessions: [1, 3, 5, 10],
    },
    'hair-salon': {
      label: 'מספרה',
      sessions: [1, 5, 10],
    },
    'massage': {
      label: 'עיסוי',
      sessions: [1, 5, 10],
    },
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
              data-testid="text-registration-title"
            >
              הרשמת לקוח חדש
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[
            { key: 'details', label: 'פרטים אישיים', icon: User },
            { key: 'membership', label: 'בחירת כרטיסיה', icon: CreditCard },
            { key: 'payment', label: 'תשלום', icon: CreditCard },
          ].map((s, idx) => (
            <div key={s.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                  step === s.key
                    ? 'bg-pink-500 text-white'
                    : ['details', 'membership', 'payment', 'success'].indexOf(step) > idx
                    ? 'bg-pink-500/30 text-pink-300'
                    : 'bg-slate-700 text-gray-400'
                }`}
              >
                <s.icon className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Details */}
        {step === 'details' && (
          <Card className="bg-gradient-to-br from-slate-800/90 to-purple-900/30 border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white">פרטים אישיים</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitDetails)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">שם מלא *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="הכנס שם מלא"
                            className="bg-slate-900/50 border-pink-500/30 text-white"
                            data-testid="input-fullname"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">מספר טלפון *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="972XXXXXXXXX"
                            className="bg-slate-900/50 border-pink-500/30 text-white"
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">אימייל (אופציונלי)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            placeholder="example@email.com"
                            className="bg-slate-900/50 border-pink-500/30 text-white"
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">תאריך לידה (אופציונלי)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            type="date"
                            className="bg-slate-900/50 border-pink-500/30 text-white"
                            data-testid="input-dob"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={createCustomerMutation.isPending}
                    className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg"
                    data-testid="button-continue-membership"
                  >
                    {createCustomerMutation.isPending ? 'שומר...' : 'המשך לבחירת כרטיסיה'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Membership */}
        {step === 'membership' && (
          <Card className="bg-gradient-to-br from-slate-800/90 to-purple-900/30 border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white">בחירת כרטיסיה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="membershipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">סוג כרטיסיה *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-slate-900/50 border-pink-500/30 text-white" data-testid="select-membership-type">
                          <SelectValue placeholder="בחר סוג כרטיסיה" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(membershipOptions).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('membershipType') && (
                <FormField
                  control={form.control}
                  name="membershipSessions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">מספר כניסות *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-900/50 border-pink-500/30 text-white" data-testid="select-sessions">
                            <SelectValue placeholder="בחר מספר כניסות" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {membershipOptions[form.watch('membershipType')]?.sessions.map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} כניסות
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                onClick={onSubmitMembership}
                disabled={createMembershipMutation.isPending}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg"
                data-testid="button-continue-payment"
              >
                {createMembershipMutation.isPending ? 'יוצר כרטיסיה...' : 'המשך לתשלום'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <Card className="bg-gradient-to-br from-slate-800/90 to-purple-900/30 border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-2xl text-white">תשלום</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <p className="text-white text-lg">סכום לתשלום: ₪350</p>
                <p className="text-gray-400 text-sm mt-2">
                  {membershipOptions[form.watch('membershipType')]?.label} - {form.watch('membershipSessions')} כניסות
                </p>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg"
                data-testid="button-pay"
              >
                בצע תשלום
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <Card className="bg-gradient-to-br from-slate-800/90 to-purple-900/30 border-pink-500/30">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-24 h-24 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">נרשמת בהצלחה!</h2>
              <p className="text-gray-300 mb-6">הכרטיסיה שלך פעילה ומוכנה לשימוש</p>
              
              <Button
                onClick={() => setLocation('/')}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg"
                data-testid="button-back-home"
              >
                חזרה לדף הבית
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
