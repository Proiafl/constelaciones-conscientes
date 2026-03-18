// Utility for Basic Rate Limiting (In-Memory per Isolate)
const rateLimitCache = new Map<string, { count: number, resetAt: number }>();

export const checkRateLimit = (req: Request, limit: number = 10, windowMs: number = 60000): { allowed: boolean, remaining: number, resetIn: number } => {
    // Extract IP address from Cloudflare/Supabase proxy headers
    const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    let record = rateLimitCache.get(ip);

    if (!record || now > record.resetAt) {
        // First request or window expired
        record = { count: 1, resetAt: now + windowMs };
        rateLimitCache.set(ip, record);
        return { allowed: true, remaining: limit - 1, resetIn: windowMs };
    }

    if (record.count >= limit) {
        return { allowed: false, remaining: 0, resetIn: record.resetAt - now };
    }

    record.count++;
    return { allowed: true, remaining: limit - record.count, resetIn: record.resetAt - now };
};

// Utility for basic Input Sanitization (Removing malicious tags/characters)
export const sanitizeInput = (input: string | undefined | null): string => {
    if (!input) return "";
    // Basic sanitization: encode HTML entities to prevent XSS securely
    return String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
};

// Validates emails
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
