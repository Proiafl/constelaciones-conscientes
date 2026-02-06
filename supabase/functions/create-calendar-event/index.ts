import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SignJWT, importPKCS8 } from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateEventRequest {
    payment_id: string;
}

// Google Auth Helper
async function getAccessToken(serviceAccountEmail: string, privateKey: string) {
    const alg = "RS256";
    const pkcs8 = await importPKCS8(privateKey, alg);

    const jwt = await new SignJWT({
        scope: "https://www.googleapis.com/auth/calendar",
    })
        .setProtectedHeader({ alg })
        .setIssuer(serviceAccountEmail)
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
    if (!data.access_token) {
        console.error("=== GOOGLE AUTH ERROR ===");
        console.error("Status:", res.status);
        console.error("Response:", JSON.stringify(data, null, 2));
        console.error("Email used:", serviceAccountEmail);
        console.error("Private key starts with:", privateKey.substring(0, 50));
        throw new Error(`Google Auth Failed: ${JSON.stringify(data)}`);
    }
    return data.access_token;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    console.log("=== CREATE CALENDAR EVENT V2 FULL DEBUG - NO ATTENDEES ===");

    try {
        const { payment_id } = await req.json() as CreateEventRequest;

        if (!payment_id) throw new Error("payment_id is required");

        // Initialize Supabase
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get payment details
        const { data: payment, error: paymentError } = await supabase
            .from("payments")
            .select("*")
            .eq("id", payment_id)
            .single();

        if (paymentError || !payment) {
            throw new Error(`Payment not found: ${payment_id}`);
        }

        // Get service details for duration
        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("slug", payment.service_type)
            .single();

        if (serviceError || !service) {
            throw new Error(`Service not found: ${payment.service_type}`);
        }

        // Check if event already created
        if (payment.booking_confirmed && payment.calendly_event_url) {
            console.log("Event already created for this payment");
            return new Response(
                JSON.stringify({
                    message: "Event already exists",
                    event_url: payment.calendly_event_url
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Get Google credentials
        const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
        // const calendarId = "primary"; // FORCE PRIMARY
        const ownerEmail = Deno.env.get("GOOGLE_CALENDAR_ID");
        const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT");

        if (!calendarId || !serviceAccountJson) {
            throw new Error("Missing Google Calendar configuration");
        }

        const serviceAccount = JSON.parse(serviceAccountJson);
        const accessToken = await getAccessToken(serviceAccount.client_email, serviceAccount.private_key);

        // Parse booking date
        const bookingDate = new Date(payment.booking_date);
        const durationMinutes = service.duration_minutes || 60;
        const endDate = new Date(bookingDate.getTime() + durationMinutes * 60 * 1000);

        // Format dates for Google Calendar
        const startDateTime = bookingDate.toISOString();
        const endDateTime = endDate.toISOString();

        // Create event with FULL details but NO attendees
        const eventData = {
            summary: `${service.name} con ${payment.customer_name}`,
            description: `¡Bienvenido/a ${payment.customer_name}!\n\nGracias por confiar en nosotros para acompañarte en este proceso de sanación y autoconocimiento.\n\n📅 Detalles de tu sesión:\n- Servicio: ${service.name}\n- Duración: ${durationMinutes} minutos\n- Fecha: ${bookingDate.toLocaleDateString('es-AR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}\n- Hora: ${bookingDate.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            })}\n\nLINK DE GOOGLE MEET (Generado automáticamente):\n(Ver enlace en la invitación)\n\n💚 Preparación para la sesión:\n- Busca un espacio tranquilo y privado\n- Asegúrate de tener buena conexión a internet\n- Ten a mano papel y lápiz si deseas tomar notas\n- Llega con el corazón abierto y sin expectativas\n\nSi tienes alguna pregunta o necesitas reprogramar, no dudes en contactarnos.\n\n¡Te esperamos con mucho amor y luz! ✨`,
            start: {
                dateTime: startDateTime,
                timeZone: "America/Argentina/Buenos_Aires",
            },
            end: {
                dateTime: endDateTime,
                timeZone: "America/Argentina/Buenos_Aires",
            },
            attendees: [
                { email: payment.customer_email }
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: "email", minutes: 24 * 60 },
                    { method: "popup", minutes: 30 }
                ]
            },
            guestsCanModify: false,
            guestsCanInviteOthers: false,
            guestsCanSeeOtherGuests: false,
        };

        // Create event in Google Calendar (removed sendUpdates=all)
        const calendarResponse = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventData),
            }
        );

        if (!calendarResponse.ok) {
            const errorText = await calendarResponse.text();
            console.error("Google Calendar Error:", errorText);
            throw new Error(`Failed to create calendar event: ${errorText}`);
        }

        const createdEvent = await calendarResponse.json();
        console.log("Event created:", createdEvent.id);

        // Update payment record
        const { error: updateError } = await supabase
            .from("payments")
            .update({
                calendly_event_url: createdEvent.htmlLink,
                booking_confirmed: true,
            })
            .eq("id", payment_id);

        if (updateError) {
            console.error("Error updating payment:", updateError);
        }

        return new Response(
            JSON.stringify({
                message: "Event created successfully",
                event_id: createdEvent.id,
                event_url: createdEvent.htmlLink,
                meet_link: createdEvent.hangoutLink,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );

    } catch (error: any) {
        console.error("Function Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
