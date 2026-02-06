import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SignJWT, importPKCS8 } from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const { date, serviceSlug } = await req.json() as AvailabilityRequest;

        if (!date) throw new Error("Date is required");

        // 1. Environment Config
        const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");
        const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT");

        if (!calendarId || !serviceAccountJson) {
            console.error("Missing Google Config");
            throw new Error("Server misconfiguration");
        }

        const serviceAccount = JSON.parse(serviceAccountJson);

        // 2. Get Google Token
        const accessTokenRaw = await getAccessToken(serviceAccount.client_email, serviceAccount.private_key);
        const accessToken = accessTokenRaw.trim();
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
        return new Response(JSON.stringify({ slots: [], error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    }
});
