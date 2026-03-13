import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import { Resend } from "npm:resend@4.0.0";
import { z } from "npm:zod@3.22.4";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { BookingConfirmationEmail } from './_templates/booking-confirmation.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Zod schema for strict input validation
const EmailPayloadSchema = z.object({
  userEmail: z.string().email().max(255),
  userName: z.string().min(1).max(100),
  trip: z.object({
    name: z.string().min(1).max(200),
    duration: z.string().max(100),
    approximateCost: z.string().max(100),
    description: z.string().max(1000),
    tripHighlights: z.array(z.string().max(200)).max(10),
  }),
  buddy: z.object({
    name: z.string().min(1).max(100),
    age: z.number().int().min(18).max(120),
    location: z.string().max(200),
    bio: z.string().max(500),
    interests: z.array(z.string().max(100)).max(20),
    matchPercentage: z.number().int().min(0).max(100),
  }),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Authentication Check ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const userEmail_auth = claimsData.claims.email as string | undefined;

    // --- Validate and parse request body with Zod ---
    const rawBody = await req.json();
    const parseResult = EmailPayloadSchema.safeParse(rawBody);
    if (!parseResult.success) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { userEmail, userName, trip, buddy } = parseResult.data;

    // --- Email ownership validation ---
    if (userEmail_auth && userEmail.toLowerCase() !== userEmail_auth.toLowerCase()) {
      return new Response(JSON.stringify({ error: 'Email does not match authenticated user' }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // No PII in logs
    console.log("Sending booking confirmation email...");

    const html = await renderAsync(
      React.createElement(BookingConfirmationEmail, {
        userName,
        userEmail,
        tripName: trip.name,
        tripDuration: trip.duration,
        tripCost: trip.approximateCost,
        tripDescription: trip.description,
        buddyName: buddy.name,
        buddyAge: buddy.age,
        buddyLocation: buddy.location,
        buddyInterests: buddy.interests,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "Travel Buddy <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Booking Confirmed: ${trip.name} 🎉`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully.");

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email. Please try again.' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
