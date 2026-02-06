import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { SignJWT, importPKCS8 } from "https://deno.land/x/jose@v4.14.4/index.ts";

Deno.serve(async (req) => {
    try {
        const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT");

        // ... auth logic same as before ... 
        const sa = JSON.parse(serviceAccountJson);
        const alg = "RS256";
        const pkcs8 = await importPKCS8(sa.private_key, alg);

        const jwt = await new SignJWT({
            scope: "https://www.googleapis.com/auth/calendar",
        })
            .setProtectedHeader({ alg })
            .setIssuer(sa.client_email)
            .setAudience("https://oauth2.googleapis.com/token")
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(pkcs8);

        const resToken = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion: jwt,
            }),
        });
        const tokenData = await resToken.json();
        const accessToken = tokenData.access_token;

        // Test 2: List Calendars
        const resCal = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const calData = await resCal.json();

        // Test 3: Check specific calendar access
        const targetCalId = "constelaxio@gmail.com";
        const resSpecific = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCalId)}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const specificData = await resSpecific.json();

        return new Response(JSON.stringify({
            calendars_found: calData.items ? calData.items.map(c => c.id) : [],
            target_calendar_access: specificData,
            error_if_any: calData.error || specificData.error
        }, null, 2), { headers: { "Content-Type": "application/json" } });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { headers: { "Content-Type": "application/json" } });
    }
});
