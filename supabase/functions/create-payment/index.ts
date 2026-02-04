import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface PaymentRequest {
    serviceSlug: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
        const accessToken = Deno.env.get("ACCESS_TOKEN_PRD") || Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
        if (!accessToken) throw new Error("Missing ACCESS_TOKEN_PRD");

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const body: PaymentRequest & { bookingDate?: string; bookingTime?: string; origin?: string } = await req.json();
        const { serviceSlug, customerName, customerEmail, customerPhone, bookingDate, bookingTime, origin } = body;

        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("slug", serviceSlug)
            .eq("active", true)
            .single();

        if (serviceError || !service) throw new Error(`Service not found: ${serviceSlug}`);

        // Determine Base URL (Prioritize origin from frontend, then SITE_URL secret, then fallback)
        let siteUrl = origin || Deno.env.get("SITE_URL") || "http://localhost:5173";
        // Clean trailing slash if any
        siteUrl = siteUrl.replace(/\/$/, "");

        // Webhook URL (Must be a public URL)
        const functionUrl = `${supabaseUrl}/functions/v1/mercadopago-webhook`;

        // Construct metadata
        const metadata = {
            service_slug: serviceSlug,
            customer_email: customerEmail,
            booking_date: bookingDate,
            booking_time: bookingTime
        };

        const successUrl = `${siteUrl}/pago-exitoso?service=${serviceSlug}&calendar=${encodeURIComponent(service.calendly_url || "")}`;
        const failureUrl = `${siteUrl}/pago-fallido?service=${serviceSlug}`;
        const pendingUrl = `${siteUrl}/pago-pendiente?service=${serviceSlug}`;

        const preferenceData = {
            items: [
                {
                    id: service.slug,
                    title: service.name,
                    quantity: 1,
                    currency_id: "ARS",
                    unit_price: Number(service.price),
                },
            ],
            payer: {
                name: customerName,
                email: customerEmail,
            },
            back_urls: {
                success: successUrl,
                failure: failureUrl,
                pending: pendingUrl,
            },
            notification_url: functionUrl,
            external_reference: `${serviceSlug}_${Date.now()}`,
            metadata: metadata,
        };

        const mpResponse = await fetch(
            "https://api.mercadopago.com/checkout/preferences",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(preferenceData),
            }
        );

        if (!mpResponse.ok) {
            const errorText = await mpResponse.text();
            throw new Error(`MercadoPago validation failed: ${errorText}`);
        }

        const preference = await mpResponse.json();

        // Construct full booking ISO string if date/time exist
        let bookingIso = null;
        if (bookingDate && bookingTime) {
            bookingIso = new Date(`${bookingDate}T${bookingTime}:00-03:00`).toISOString();
        }

        // Save to DB initially as pending
        const { data: payment } = await supabase
            .from("payments")
            .insert({
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone || null,
                service_type: serviceSlug,
                service_name: service.name,
                amount: service.price,
                mp_preference_id: preference.id,
                mp_status: "pending",
                booking_date: bookingIso,
                metadata: metadata
            })
            .select()
            .single();

        return new Response(
            JSON.stringify({
                preference_id: preference.id,
                init_point: preference.init_point,
                sandbox_init_point: preference.sandbox_init_point,
                payment_id: payment?.id
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
