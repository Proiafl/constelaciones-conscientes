import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const topic = url.searchParams.get("topic") || url.searchParams.get("type");
        const id = url.searchParams.get("id") || url.searchParams.get("data.id");

        let notificationData;
        try {
            notificationData = await req.json();
        } catch (e) {
            notificationData = {};
        }

        console.log("Webhook received:", JSON.stringify({
            query: Object.fromEntries(url.searchParams),
            body: notificationData
        }));

        // Extract notification ID and type
        const notificationId = notificationData?.data?.id || notificationData?.id || id;
        const notificationType = notificationData?.type || topic;

        if (!notificationId || notificationType !== "payment") {
            console.log("Ignored non-payment notification");
            return new Response(JSON.stringify({ message: "Ignored" }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Initialize Supabase and MP Access
        const accessToken = Deno.env.get("ACCESS_TOKEN_PRD") || Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
        if (!accessToken) throw new Error("Missing ACCESS_TOKEN_PRD");

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Fetch Payment Details from MercadoPago
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${notificationId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!mpResponse.ok) {
            console.error("Failed to fetch payment from MP:", await mpResponse.text());
            throw new Error("Could not fetch payment details");
        }

        const paymentData = await mpResponse.json();
        const status = paymentData.status;
        const externalReference = paymentData.external_reference;
        const metadata = paymentData.metadata || {};
        const supabasePaymentId = metadata.supabase_payment_id || externalReference;

        console.log("Processing payment:", {
            id: notificationId,
            status,
            supabasePaymentId,
            externalReference
        });

        if (!supabasePaymentId) {
            console.warn("No linked Supabase Payment ID found");
            return new Response(JSON.stringify({ message: "No ID match" }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // Update Supabase payment record
        const { error: updateError } = await supabase
            .from("payments")
            .update({
                mp_payment_id: notificationId,
                mp_status: status,
                mp_payment_method: paymentData.payment_method_id || null,
                mp_status_detail: paymentData.status_detail || null,
            })
            .eq("id", supabasePaymentId);

        if (updateError) {
            console.error("Error updating payment in Supabase:", updateError);
            throw updateError;
        }

        console.log("Payment updated successfully");

        // If payment approved, create calendar event
        if (status === "approved") {
            console.log("Payment approved, creating calendar event...");

            try {
                const { data: eventData, error: eventError } = await supabase.functions.invoke(
                    "create-calendar-event",
                    {
                        body: { payment_id: supabasePaymentId }
                    }
                );

                if (eventError) {
                    console.error("Error creating calendar event:", eventError);
                } else {
                    console.log("Calendar event created:", eventData);
                }
            } catch (err) {
                console.error("Failed to invoke create-calendar-event:", err);
            }
        }

        return new Response(JSON.stringify({ message: "Payment processed" }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error("Webhook Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
