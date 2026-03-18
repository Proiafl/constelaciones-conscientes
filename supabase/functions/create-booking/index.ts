import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit, sanitizeInput, isValidEmail, corsHeaders } from "../_shared/utils.ts";

interface BookingRequest {
    serviceSlug: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    bookingDate: string;
    bookingTime: string;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
        // Enforce Rate Limiting (max 10 requests per minute)
        const rateLimit = checkRateLimit(req, 10, 60000);
        if (!rateLimit.allowed) {
            return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
                status: 429,
                headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString() }
            });
        }

        const supabaseUrl = Deno.env.get("SELF_HOSTED_DB_URL") || Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SELF_HOSTED_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const body: BookingRequest = await req.json();

        // Sanitize and Validate Inputs
        const serviceSlug = sanitizeInput(body.serviceSlug);
        const customerName = sanitizeInput(body.customerName);
        const customerEmail = sanitizeInput(body.customerEmail).toLowerCase();
        const customerPhone = sanitizeInput(body.customerPhone);
        const bookingDate = sanitizeInput(body.bookingDate);
        const bookingTime = sanitizeInput(body.bookingTime);

        if (!isValidEmail(customerEmail)) {
            throw new Error("Invalid email format");
        }

        console.log("Creating booking for:", { serviceSlug, customerName, customerEmail, bookingDate, bookingTime });

        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("slug", serviceSlug)
            .eq("active", true)
            .single();

        if (serviceError || !service) {
            console.error("Service not found:", serviceError);
            throw new Error(`Service not found: ${serviceSlug}`);
        }

        const bookingIso = new Date(`${bookingDate}T${bookingTime}:00-03:00`).toISOString();

        console.log("Creating booking record with date:", bookingIso);

        let serviceType = 'individual';
        if (serviceSlug === 'constelacion-presencial') {
            serviceType = 'presencial';
        } else if (serviceSlug === 'taller-grupal') {
            serviceType = 'taller';
        } else {
            serviceType = 'individual';
        }

        const { data: booking, error: bookingError } = await supabase
            .from("payments")
            .insert({
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone || null,
                service_type: serviceType,
                service_name: service.name,
                amount: service.price,
                mp_status: "approved",
                booking_date: bookingIso,
                metadata: {
                    bypass_mode: true,
                    service_slug: serviceSlug,
                    customer_email: customerEmail,
                    booking_date: bookingDate,
                    booking_time: bookingTime
                }
            })
            .select()
            .single();

        if (bookingError || !booking) {
            console.error("Failed to create booking:", bookingError);
            throw new Error("Failed to create booking record");
        }

        console.log("Booking created with ID:", booking.id);

        // Create calendar event using direct HTTP call
        console.log("Calling create-calendar-event...");
        const calendarResponse = await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/create-calendar-event`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({ payment_id: booking.id })
            }
        );

        if (!calendarResponse.ok) {
            const errorText = await calendarResponse.text();
            console.error("Calendar event error:", errorText);
            throw new Error(`Failed to create calendar event: ${errorText}`);
        }

        const eventData = await calendarResponse.json();
        console.log("Calendar event created successfully:", eventData);

        return new Response(
            JSON.stringify({
                success: true,
                booking_id: booking.id,
                event_url: eventData.event_url,
                meet_link: eventData.meet_link,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error: any) {
        console.error("Booking error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});