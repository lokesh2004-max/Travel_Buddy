/**
 * Booking Form Validation Schemas
 * Zod schemas for validating customer booking information
 */

import { z } from 'zod';

export const bookingFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
