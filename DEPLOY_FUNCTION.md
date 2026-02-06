# Desplegar Función create-booking en Supabase

## ⚠️ IMPORTANTE: La función debe desplegarse manualmente

El servidor MCP de Supabase no está disponible actualmente. Por favor, sigue estos pasos para desplegar la función `create-booking`:

## Pasos para Desplegar

### 1. Acceder al Dashboard de Supabase
Ve a: https://supabase.com/dashboard/project/pqiknksrcbqyxvtkueqe/functions

### 2. Crear Nueva Función
- Click en "Deploy new function" o "New Edge Function"
- Nombre: `create-booking`

### 3. Copiar el Código
El código de la función está en: `supabase/functions/create-booking/index.ts`

O copia directamente desde aquí:

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const body: BookingRequest = await req.json();
        const { serviceSlug, customerName, customerEmail, customerPhone, bookingDate, bookingTime } = body;

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

        const { data: booking, error: bookingError } = await supabase
            .from("payments")
            .insert({
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone || null,
                service_type: serviceSlug,
                service_name: service.name,
                amount: service.price,
                mp_status: "bypass",
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

        console.log("Invoking create-calendar-event function...");
        const { data: eventData, error: eventError } = await supabase.functions.invoke(
            "create-calendar-event",
            {
                body: { payment_id: booking.id }
            }
        );

        if (eventError) {
            console.error("Error creating calendar event:", eventError);
            throw new Error("Failed to create calendar event");
        }

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
```

### 4. Desplegar
- Pega el código en el editor
- Click en "Deploy" o "Save"
- Espera a que se complete el despliegue

### 5. Verificar
Una vez desplegada, la función estará disponible en:
`https://pqiknksrcbqyxvtkueqe.supabase.co/functions/v1/create-booking`

## ✅ Después del Despliegue

Una vez desplegada la función, podrás probar el flujo completo de reserva:

1. Ve a http://192.168.0.183:8080/
2. Click en "Agendar ahora" en cualquier servicio
3. Completa el formulario
4. Al confirmar, deberías ver el modal de éxito
5. Verifica que se creó el evento en Google Calendar

## 📝 Notas

- La función usa `mp_status: "bypass"` para identificar reservas en modo prueba
- Llama automáticamente a `create-calendar-event` para crear el evento
- El título del evento será: "{nombre_servicio} con {nombre_cliente}"
