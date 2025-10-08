import { useState } from 'react';
import { CreditCard, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertCustomerSchema } from '@shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { z } from 'zod';

const registrationSchema = insertCustomerSchema.omit({ dateOfBirth: true, email: true }).extend({
  dateOfBirth: z.string()
    .min(1, 'תאריך לידה הוא שדה חובה')
    .regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך לידה חייב להיות בפורמט YYYY-MM-DD"),
  email: z.string().email("כתובת אימייל לא תקינה").or(z.literal('')).optional(),
  membershipType: z.string().min(1, 'יש לבחור סוג כרטיסיה'),
  membershipSessions: z.string().min(1, 'יש לבחור מספר כניסות'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewCustomerDialog({ open, onOpenChange }: NewCustomerDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'membership' | 'payment' | 'success'>('details');
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [age, setAge] = useState<string>('');

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (months === 0) {
      return `${years} שנים`;
    }
    
    return `${years} שנים ו-${months} חודשים`;
  };

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      dateOfBirth: '',
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
        email: data.email || null,
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
    setStep('success');
    toast({
      title: '✅ תשלום בוצע בהצלחה',
      description: 'לקוח נרשם בהצלחה!',
    });
  };

  const handleClose = () => {
    setStep('details');
    form.reset();
    setCustomerId(null);
    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[600px] bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95 border-2 text-white backdrop-blur-xl"
        style={{
          borderColor: 'rgba(236, 72, 153, 0.6)',
          boxShadow: '0 0 40px rgba(236, 72, 153, 0.3)',
        }}
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle 
            className="text-3xl font-bold text-center"
            style={{
              textShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
              color: '#fff'
            }}
          >
            הרשמת לקוח חדש
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between mb-6 px-4">
          {[
            { key: 'details', label: 'פרטים', icon: User },
            { key: 'membership', label: 'כרטיסיה', icon: CreditCard },
            { key: 'payment', label: 'תשלום', icon: CreditCard },
          ].map((s, idx) => (
            <div key={s.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                  step === s.key
                    ? 'bg-pink-500 text-white shadow-lg'
                    : ['details', 'membership', 'payment', 'success'].indexOf(step) > idx
                    ? 'bg-pink-500/30 text-pink-300'
                    : 'bg-gray-700 text-gray-400'
                }`}
                style={step === s.key ? {
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.6)',
                } : {}}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="px-2">
          {/* Step 1: Details */}
          {step === 'details' && (
            <div className="space-y-4">
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
                            className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white h-12"
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
                            className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white h-12"
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormDescription className="text-pink-300/70 text-sm">
                          מספר זה ישמש לתקשורת WhatsApp
                        </FormDescription>
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
                            className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white h-12"
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
                        <FormLabel className="text-white">תאריך לידה *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            type="date"
                            className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white h-12"
                            data-testid="input-dob"
                            onChange={(e) => {
                              field.onChange(e);
                              setAge(calculateAge(e.target.value));
                            }}
                          />
                        </FormControl>
                        {age && (
                          <div className="mt-2 text-pink-400 text-sm font-bold">
                            גיל: {age}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={createCustomerMutation.isPending}
                    className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg"
                    style={{
                      boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
                    }}
                    data-testid="button-continue-membership"
                  >
                    {createCustomerMutation.isPending ? 'שומר...' : 'המשך →'}
                  </Button>
                </form>
              </Form>
            </div>
          )}

          {/* Step 2: Membership */}
          {step === 'membership' && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="membershipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">סוג כרטיסיה *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger 
                          className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white h-12" 
                          data-testid="select-membership-type"
                        >
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
                          <SelectTrigger 
                            className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 border-pink-500/30 text-white h-12" 
                            data-testid="select-sessions"
                          >
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
                style={{
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
                }}
                data-testid="button-continue-payment"
              >
                {createMembershipMutation.isPending ? 'יוצר כרטיסיה...' : 'המשך לתשלום →'}
              </Button>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div 
                className="bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-800/90 p-6 rounded-lg border border-pink-500/30"
                style={{
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)',
                }}
              >
                <p className="text-white text-2xl font-bold mb-2">₪350</p>
                <p className="text-gray-400 text-sm">
                  {membershipOptions[form.watch('membershipType')]?.label} - {form.watch('membershipSessions')} כניסות
                </p>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg"
                style={{
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
                }}
                data-testid="button-pay"
              >
                בצע תשלום
              </Button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 
                className="w-20 h-20 mx-auto mb-4" 
                style={{
                  color: '#10b981',
                  filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
                }}
              />
              <h2 
                className="text-2xl font-bold mb-2"
                style={{
                  textShadow: '0 0 20px rgba(236, 72, 153, 0.6)',
                  color: '#fff'
                }}
              >
                נרשמת בהצלחה!
              </h2>
              <p className="text-gray-300 mb-6">הכרטיסיה שלך פעילה ומוכנה לשימוש</p>
              
              <Button
                onClick={handleClose}
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg"
                style={{
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
                }}
                data-testid="button-close"
              >
                סגור
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
