import { useState } from 'react';
import { CreditCard, User, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { insertCustomerSchema } from '@shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { z } from 'zod';

// Schema for Step 1: Customer Details
const customerDetailsSchema = insertCustomerSchema.omit({ dateOfBirth: true, email: true }).extend({
  dateOfBirth: z.string()
    .min(1, 'תאריך לידה הוא שדה חובה')
    .regex(/^\d{4}-\d{2}-\d{2}$/, "תאריך לידה חייב להיות בפורמט YYYY-MM-DD"),
  email: z.string().email("כתובת אימייל לא תקינה").or(z.literal('')).optional(),
});

// Full schema including membership fields (for form state)
const registrationSchema = customerDetailsSchema.extend({
  membershipType: z.string().optional(),
  membershipSessions: z.string().optional(),
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
      const json = await response.json();
      return json;
    },
    onSuccess: (json: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      handleClose();
      toast({
        title: '✅ לקוח נרשם בהצלחה',
        description: 'עובר להצהרת בריאות...',
      });
      setTimeout(() => {
        window.location.href = `/health-form?customerId=${json.data.id}`;
      }, 500);
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
      const json = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/memberships'] });
      handleSkipPayment();
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
    const membershipSessions = form.getValues('membershipSessions');
    const sessions = parseInt(membershipSessions || '0');
    
    if (!customerId || !membershipType || !sessions || isNaN(sessions)) {
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

  const handleSkipPayment = () => {
    // Close dialog and navigate to POS with customer
    handleClose();
    toast({
      title: '✅ לקוח נרשם בהצלחה',
      description: 'ניתן כעת לבחור כרטיסיה בעמוד הקופה',
    });
    setTimeout(() => {
      window.location.href = '/pos';
    }, 500);
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
      sessions: [1, 8, 13],
    },
    'sun-beds-bronzer': {
      label: 'מיטות שיזוף + ברונזר',
      sessions: [3, 6, 10],
    },
    'sun-beds-custom': {
      label: 'בנה את השיזוף שלך (מינימום 4)',
      sessions: [4, 5, 6, 7, 8, 9, 10, 12, 15, 20],
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
          <div className="flex items-center justify-between mb-2">
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
              data-testid="button-back-new-customer"
            >
              <ArrowLeft className="w-5 h-5 ml-1" />
              חזרה
            </Button>
          </div>
          <DialogTitle 
            className="text-3xl font-bold text-center"
            style={{
              textShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
              color: '#fff'
            }}
          >
            הרשמת לקוח חדש
          </DialogTitle>
          <DialogDescription className="text-center text-white/70">
            מלא את הפרטים להרשמת לקוח חדש במערכת
          </DialogDescription>
        </DialogHeader>

        <div className="px-2">
          {/* Customer Details */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
