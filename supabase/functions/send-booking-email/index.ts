import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              text-align: center;
              margin-bottom: 30px;
            }
            .section {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .section h2 {
              color: #667eea;
              margin-top: 0;
            }
            .highlight {
              background: white;
              padding: 15px;
              border-radius: 6px;
              margin: 10px 0;
            }
            .buddy-info {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .match-badge {
              background: #10b981;
              color: white;
              padding: 5px 15px;
              border-radius: 20px;
              font-weight: bold;
            }
            ul {
              list-style: none;
              padding-left: 0;
            }
            li:before {
              content: "✓ ";
              color: #10b981;
              font-weight: bold;
              margin-right: 8px;
            }
            .footer {
              text-align: center;
              color: #666;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your adventure awaits, ${userName}!</p>
          </div>

          <div class="section">
            <h2>📍 Trip Details</h2>
            <div class="highlight">
              <h3>${trip.name}</h3>
              <p><strong>Duration:</strong> ${trip.duration}</p>
              <p><strong>Budget:</strong> ${trip.approximateCost}</p>
              <p>${trip.description}</p>
              
              <h4>Trip Highlights:</h4>
              <ul>
                ${trip.tripHighlights.map(highlight => `<li>${highlight}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div class="section">
            <h2>👥 Your Travel Buddy</h2>
            <div class="highlight">
              <div class="buddy-info">
                <div>
                  <h3>${buddy.name}</h3>
                  <p><strong>Age:</strong> ${buddy.age} | <strong>From:</strong> ${buddy.location}</p>
                  <p>${buddy.bio}</p>
                  <p><strong>Interests:</strong> ${buddy.interests.join(', ')}</p>
                </div>
                <span class="match-badge">${buddy.matchPercentage}% Match</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>✅ Next Steps</h2>
            <div class="highlight">
              <ol>
                <li>Check your email for trip itinerary PDF</li>
                <li>Connect with your travel buddy</li>
                <li>Pack your bags and get ready!</li>
              </ol>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for booking with Travel Buddy!</p>
            <p>Safe travels and enjoy your adventure! 🌍✨</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Travel Buddy <onboarding@resend.dev>",
      to: [userEmail],
      subject: `🎉 Booking Confirmed: ${trip.name}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending booking email:", error);
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
