/**
 * Custom Hook: useBookingEmail
 * Handles email sending via Supabase Edge Function
 */

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailPayload {
  userEmail: string;
  userName: string;
  trip: {
    name: string;
    duration: string;
    approximateCost: string;
    description: string;
    tripHighlights: string[];
  };
  buddy: {
    name: string;
    age: number;
    location: string;
    bio: string;
    interests: string[];
    matchPercentage: number;
  };
}

export const useBookingEmail = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const sendBookingEmail = async (payload: EmailPayload): Promise<boolean> => {
    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: payload,
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      // Check for Resend-specific errors in response
      if (data?.data?.error) {
        const resendError = data.data.error;
        console.error('Resend error:', resendError);

        // Handle domain verification error
        if (
          resendError.name === 'validation_error' &&
          resendError.message.includes('verify a domain')
        ) {
          toast({
            title: 'Email Configuration Required',
            description:
              'Please verify your domain at resend.com/domains or use your verified email',
            variant: 'destructive',
          });
          return false;
        }

        throw new Error(resendError.message);
      }

      toast({
        title: 'Email Sent! ✉️',
        description: 'Booking confirmation sent to your email',
      });

      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      
      toast({
        title: 'Email Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Booking confirmed but email could not be sent',
        variant: 'destructive',
      });

      // Consider booking confirmed even if email fails
      return true;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendBookingEmail,
    isSending,
  };
};
