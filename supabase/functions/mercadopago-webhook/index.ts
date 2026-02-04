import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { SignJWT, importPKCS8 } from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Google Auth Helpers
async function getAccessToken(serviceAccountEmail: string, privateKey: string) {
    const alg = "RS256";
    const pkcs8 = await importPKCS8(privateKey, alg);

    const jwt = await new SignJWT({
        scope: "https://www.googleapis.com/auth/calendar",
    })
        .setProtectedHeader({ alg })
        .setIssuer(serviceAccountEmail)
        .setSubject(serviceAccountEmail)
        .setAudience("https://oauth2.googleapis.com/token")
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(pkcs8);

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: jwt,
        }),
    });

    const data = await res.json();
    return data.access_token;
}

// Function to create Google Calendar Event
async function createCalendarEvent(payment: any, accessToken: string) {
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
    if (!calendarId) {
        console.error("Missing GOOGLE_CALENDAR_ID");
        return null;
    }

    if (!payment.booking_date) {
        console.log("No booking date found for payment", payment.id);
        return null;
    }

    const startTime = new Date(payment.booking_date);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    const event = {
        summary: `Sesión: ${payment.service_name} - ${payment.customer_name}`,
        description: `Cliente: ${payment.customer_name}\nEmail: ${payment.customer_email}\nTel: ${payment.customer_phone || "N/A"}\nServicio: ${payment.service_name}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [{ email: payment.customer_email }],
    };

    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
    });

    if (!res.ok) {
        console.error("Failed to create calendar event", await res.text());
        return null;
    }

    const data = await res.json();
    return data.htmlLink;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const accessToken = Deno.env.get("ACCESS_TOKEN_PRD") || Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Parse data from query or body
        const url = new URL(req.url);
        let id = url.searchParams.get("data.id") || url.searchParams.get("id");
        let type = url.searchParams.get("type") || url.searchParams.get("topic");

        // If not in URL, check body
        if (!id || !type) {
            try {
                const body = await req.json();
                console.log("Webhook body:", JSON.stringify(body));
                id = id || body.data?.id || body.id;
                type = type || body.type || body.topic;
            } catch (e) {
                console.log("No JSON body found or could not parse.");
            }
        }

        console.log(`Notification received: type=${type}, id=${id}`);

        if (type === "payment" && id) {
            const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!mpResponse.ok) {
                const errText = await mpResponse.text();
                console.error(`MP API Error for payment ${id}:`, errText);
                return new Response(JSON.stringify({ error: "MP API Error" }), { status: 200, headers: corsHeaders });
            }

            const paymentData = await mpResponse.json();
            const status = paymentData.status;
            const preferenceId = paymentData.preference_id;

            console.log(`Processing payment ${id}. Status: ${status}, Preference: ${preferenceId}`);

            // First retrieve the payment record to get booking details
            const { data: currentPayment, error: fetchError } = await supabase
                .from("payments")
                .select("*")
                .eq("mp_preference_id", preferenceId)
                .single();

            if (fetchError) {
                console.error("Error fetching payment record:", fetchError);
                // Don't throw, try to update anyway if possible, but we need booking_date
            }

            let calendarUrl = null;

            // Create Calendar Event if approved and not already created
            if (status === "approved" && currentPayment && !currentPayment.calendly_event_url) {
                try {
                    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT");
                    if (serviceAccountJson) {
                        const serviceAccount = JSON.parse(serviceAccountJson);
                        const googleToken = await getAccessToken(serviceAccount.client_email, serviceAccount.private_key);
                        calendarUrl = await createCalendarEvent(currentPayment, googleToken);
                        console.log("Calendar event created:", calendarUrl);
                    }
                } catch (calError: any) {
                    console.error("Error creating calendar event:", calError);
                }
            }

            // Update payment record
            const updateData: any = {
                mp_status: status,
                mp_payment_id: id.toString(),
                mp_status_detail: paymentData.status_detail,
                mp_payment_method: paymentData.payment_method_id,
                updated_at: new Date().toISOString()
            };

            if (calendarUrl) {
                updateData.calendly_event_url = calendarUrl; // Reusing this field for Google Calendar URL
            }

            const { data: updated, error: updateError } = await supabase
                .from("payments")
                .update(updateData)
                .eq("mp_preference_id", preferenceId)
                .select();

            if (updateError) {
                console.error("DB Update Error:", updateError);
                throw updateError;
            }

            console.log(`Update result for preference ${preferenceId}:`, JSON.stringify(updated));
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Webhook Global Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200, // MP requires 200 to stop retrying even if we fail internally
        });
    }
});
