import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, User, Phone, Mail, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Customer } from '@shared/schema';
import { insertCustomerSchema } from '@shared/schema';

// Form validation schema extending shared schema
const customerFormSchema = insertCustomerSchema.extend({
  email: z.string().email('כתובת אימייל לא תקינה').optional().or(z.literal('')),
  faceRecognitionId: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  customer?: Customer | null;
  isLoading?: boolean;
}

export default function CustomerForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  customer, 
  isLoading = false 
}: CustomerFormProps) {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer ? {
      fullName: customer.fullName,
      phone: customer.phone,
      email: customer.email || '',
      isNewClient: customer.isNewClient,
      healthFormSigned: customer.healthFormSigned,
      faceRecognitionId: customer.faceRecognitionId || '',
      notes: customer.notes || ''
    } : {
      fullName: '',
      phone: '',
      email: '',
      isNewClient: true,
      healthFormSigned: false,
      faceRecognitionId: '',
      notes: ''
    }
  });

  const handleSubmit = (data: CustomerFormData) => {
    // Clean up empty strings to undefined
    const cleanData = {
      ...data,
      email: data.email || undefined,
      faceRecognitionId: data.faceRecognitionId || undefined,
      notes: data.notes || undefined
    };
    onSubmit(cleanData);
  };

  const isEditMode = !!customer;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <User className="ml-2 h-5 w-5 text-pink-500" />
            {isEditMode ? 'עריכת לקוח' : 'לקוח חדש'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? 'עדכן את פרטי הלקוח' : 'הוסף לקוח חדש למערכת'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 flex items-center">
                    <User className="ml-1 h-4 w-4" />
                    שם מלא *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="הזן שם מלא"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-pink-500"
                      data-testid="input-customer-fullname"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 flex items-center">
                    <Phone className="ml-1 h-4 w-4" />
                    טלפון *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="05X-XXXXXXX"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-pink-500"
                      data-testid="input-customer-phone"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 flex items-center">
                    <Mail className="ml-1 h-4 w-4" />
                    אימייל
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="customer@example.com"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-pink-500"
                      data-testid="input-customer-email"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Face Recognition ID */}
            <FormField
              control={form.control}
              name="faceRecognitionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 flex items-center">
                    זיהוי פנים ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="מזהה זיהוי פנים (אוטומטי)"
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-pink-500"
                      data-testid="input-customer-face-id"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 flex items-center">
                    <FileText className="ml-1 h-4 w-4" />
                    הערות
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="הערות נוספות על הלקוח..."
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-pink-500 resize-none"
                      rows={3}
                      data-testid="textarea-customer-notes"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Checkboxes */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="isNewClient"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-slate-600 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                        data-testid="checkbox-customer-new-client"
                      />
                    </FormControl>
                    <FormLabel className="text-slate-300 font-normal">
                      לקוח חדש
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="healthFormSigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-slate-600 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                        data-testid="checkbox-customer-health-form"
                      />
                    </FormControl>
                    <FormLabel className="text-slate-300 font-normal">
                      הצהרת בריאות נחתמה
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                data-testid="button-cancel-customer"
              >
                <X className="ml-1 h-4 w-4" />
                ביטול
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                data-testid="button-save-customer"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-1"></div>
                ) : (
                  <Save className="ml-1 h-4 w-4" />
                )}
                {isLoading ? 'שומר...' : (isEditMode ? 'עדכן' : 'צור לקוח')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
