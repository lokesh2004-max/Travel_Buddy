import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { BookingConfirmationEmail } from './_templates/booking-confirmation.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, trip, buddy }: BookingEmailRequest = await req.json();

    console.log("Sending booking confirmation email to:", userEmail);

    // Render the React Email template
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

    console.log("Email sent successfully:", data);

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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
