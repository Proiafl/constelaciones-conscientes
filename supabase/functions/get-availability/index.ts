import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SignJWT, importPKCS8 } from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { checkRateLimit, sanitizeInput } from "../_shared/utils.ts";

interface AvailabilityRequest {
    date: string; // YYYY-MM-DD
    serviceSlug: string;
}

// Google Auth Helpers
async function getAccessToken(serviceAccountEmail: string, privateKey: string) {
    const alg = "RS256";
    const pkcs8 = await importPKCS8(privateKey, alg);

    const jwt = await new SignJWT({
        scope: "https://www.googleapis.com/auth/calendar.readonly",
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
    if (!data.access_token) {
        console.error("Auth Error:", JSON.stringify(data));
        throw new Error(`Google Auth Failed: ${JSON.stringify(data)}`);
    }
    return data.access_token;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        // Enforce Rate Limiting (max 15 requests per minute for availability checks)
        const rateLimit = checkRateLimit(req, 15, 60000);
        if (!rateLimit.allowed) {
            return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
                status: 429,
                headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString() }
            });
        }

        const body = await req.json() as AvailabilityRequest;
        const date = sanitizeInput(body.date);
        const serviceSlug = sanitizeInput(body.serviceSlug);

        if (!date) throw new Error("Date is required");

        // 1. Environment Config
        const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
        const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT");

        console.log("Calendar ID:", calendarId);
        if (serviceAccountJson) {
            console.log("Service Account JSON length:", serviceAccountJson.length);
            console.log("Service Account JSON snippet:", serviceAccountJson.substring(0, 50) + "...");
        } else {
            console.log("Service Account JSON is MISSING");
        }

        if (!calendarId || !serviceAccountJson) {
            console.error("Missing Google Config");
            throw new Error("Server misconfiguration: GOOGLE_CALENDAR_ID or GOOGLE_SERVICE_ACCOUNT is missing");
        }

        let serviceAccount;
        try {
            serviceAccount = JSON.parse(serviceAccountJson);
            console.log("Service Account JSON parsed successfully. Email:", serviceAccount.client_email);
        } catch (e) {
            console.error("Failed to parse Service Account JSON:", e.message);
            throw new Error("Server misconfiguration: Invalid GOOGLE_SERVICE_ACCOUNT JSON format");
        }

        // 2. Get Google Token
        let accessToken;
        try {
            const accessTokenRaw = await getAccessToken(serviceAccount.client_email, serviceAccount.private_key);
            accessToken = accessTokenRaw.trim();
            console.log("Access token obtained successfully");
        } catch (e) {
            console.error("Error in getAccessToken:", e.message);
            throw e; // Rethrow to be caught by the main try-catch
        }
        
        const calendarIdClean = calendarId.trim();

        // 3. Define time range for the day in local timezone (-03:00)
        const timeMin = new Date(`${date}T00:00:00-03:00`).toISOString();
        const timeMax = new Date(`${date}T23:59:59-03:00`).toISOString();

        // 4. Fetch 'freeBusy' (Note: Case-sensitive 'freeBusy')
        const fbRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                timeMin,
                timeMax,
                items: [{ id: calendarIdClean }],
            }),
        });

        if (!fbRes.ok) {
            const errorText = await fbRes.text();
            console.error("Google Calendar Error Body:", errorText);
            throw new Error(`Google API ${fbRes.status}: ${errorText}`);
        }

        const busyData = await fbRes.json();
        console.log("Busy data:", JSON.stringify(busyData));

        if (!busyData.calendars || !busyData.calendars[calendarIdClean]) {
            throw new Error(`Calendar ID ${calendarIdClean} no encontrado en la respuesta de Google.`);
        }
        const busySlots = busyData.calendars[calendarIdClean].busy || [];

        // 5. Generate Available Slots based on Day of Week
        const dateObj = new Date(date + "T12:00:00-03:00");
        const day = dateObj.getDay();

        let possibleSlots: string[] = [];

        if (day >= 1 && day <= 5) {
            possibleSlots = ["18:30", "19:30", "20:30"];
        } else if (day === 6) {
            possibleSlots = ["10:00", "11:00", "12:00", "13:00"];
        }

        const availableSlots = possibleSlots.filter(slot => {
            const slotStart = new Date(`${date}T${slot}:00-03:00`);
            const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

            const isBusy = busySlots.some((busy: any) => {
                const busyStart = new Date(busy.start);
                const busyEnd = new Date(busy.end);
                return (slotStart < busyEnd && slotEnd > busyStart);
            });

            return !isBusy;
        });

        return new Response(JSON.stringify({ slots: availableSlots }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        console.error("Function Error:", error.message);
        return new Response(JSON.stringify({ slots: [], error: "DEPLOY_TEST_1: " + error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    }
});
