/**
 * Booking Form Component
 * Handles customer information input and booking confirmation
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Download, Mail } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { bookingFormSchema, type BookingFormData } from '@/lib/validations/bookingSchema';

interface BookingFormProps {
  initialEmail?: string;
  initialName?: string;
  isConfirming: boolean;
  isGeneratingPDF: boolean;
  onConfirm: (data: BookingFormData) => void;
  onDownloadPDF: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialEmail = '',
  initialName = '',
  isConfirming,
  isGeneratingPDF,
  onConfirm,
  onDownloadPDF,
}) => {
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      email: initialEmail,
      name: initialName,
    },
  });

  const handleSubmit = (data: BookingFormData) => {
    onConfirm(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Your Booking</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        {...field}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full ocean-gradient hover:opacity-90 card-shadow animate-bounce-in"
                  size="lg"
                  disabled={isConfirming || isGeneratingPDF}
                  aria-label="Confirm booking and send email"
                >
                  {isConfirming ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" aria-hidden="true" />
                      Confirm Booking
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={onDownloadPDF}
                  disabled={isGeneratingPDF}
                  aria-label="Download itinerary as PDF"
                >
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  {isGeneratingPDF ? 'Generating...' : 'Download Itinerary'}
                </Button>
              </div>

              {/* Consent Notice */}
              <p className="text-xs text-muted-foreground text-center">
                By confirming, you agree to receive booking details via email
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Resend Configuration Notice */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Mail className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold mb-1">Resend Test Mode</p>
              <p className="text-muted-foreground text-xs">
                Emails can only be sent to verified addresses.
                To send to any email, verify a domain at{' '}
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                  aria-label="Verify domain on Resend (opens in new tab)"
                >
                  resend.com/domains
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
