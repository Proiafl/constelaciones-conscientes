import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, ArrowRight, Loader2, Home, Sparkles } from "lucide-react";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<{
        service: string;
        eventUrl: string | null;
        customerName: string;
    } | null>(null);

    const paymentId = searchParams.get("payment_id");
    const serviceType = searchParams.get("service") || "individual";

    const serviceNames: Record<string, string> = {
        individual: "Sesión Individual Online",
        taller: "Taller Grupal",
        presencial: "Constelación Presencial",
    };

    useEffect(() => {
        const verifyPayment = async () => {
            if (!paymentId) {
                setPaymentData({
                    service: serviceNames[serviceType] || "Sesión",
                    eventUrl: null,
                    customerName: "Cliente",
                });
                setIsLoading(false);
                return;
            }

            try {
                const { supabase } = await import("@/lib/supabase");

                // Poll for payment confirmation and calendar event
                let attempts = 0;
                const maxAttempts = 10;

                const checkStatus = async () => {
                    const { data, error } = await supabase
                        .from("payments")
                        .select("mp_status, service_name, customer_name, calendly_event_url, booking_confirmed")
                        .eq("id", paymentId)
                        .maybeSingle();

                    if (error) {
                        console.error("Error fetching payment:", error);
                        return false;
                    }

                    if (data) {
                        // Update state with current data
                        setPaymentData({
                            service: data.service_name || serviceNames[serviceType] || "Sesión",
                            eventUrl: data.calendly_event_url,
                            customerName: data.customer_name || "Cliente",
                        });

                        // If event is confirmed, stop polling
                        if (data.booking_confirmed && data.calendly_event_url) {
                            setIsLoading(false);
                            return true;
                        }
                    }

                    return false;
                };

                // Initial check
                const isReady = await checkStatus();
                if (isReady) return;

                // Poll every 2 seconds
                const interval = setInterval(async () => {
                    attempts++;
                    const ready = await checkStatus();

                    if (ready || attempts >= maxAttempts) {
                        clearInterval(interval);
                        setIsLoading(false);
                    }
                }, 2000);

            } catch (err) {
                console.error("Error verifying payment:", err);
                setPaymentData({
                    service: serviceNames[serviceType] || "Sesión",
                    eventUrl: null,
                    customerName: "Cliente",
                });
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [paymentId, serviceType]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
                    <p className="text-muted-foreground">Confirmando tu reserva...</p>
                    <p className="text-sm text-muted-foreground mt-2">Estamos creando tu evento en el calendario</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-3xl shadow-medium p-8 sm:p-12 max-w-2xl w-full text-center"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                </motion.div>

                {/* Title */}
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3">
                    ¡Felicitaciones por dar este paso! 🎉
                </h1>

                {/* Personalized greeting */}
                <p className="text-lg text-muted-foreground mb-6">
                    {paymentData?.customerName}, tu pago ha sido confirmado exitosamente.
                </p>

                {/* Inspiring message */}
                <div className="bg-sage-light/30 rounded-2xl p-6 mb-6 border border-sage/20">
                    <div className="flex items-start gap-3 mb-4">
                        <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div className="text-left">
                            <p className="text-foreground leading-relaxed mb-3">
                                Este es el comienzo de un viaje de <span className="font-semibold text-primary">sanación y autoconocimiento</span>.
                            </p>
                            <p className="text-foreground leading-relaxed mb-3">
                                Estamos aquí para acompañarte en cada paso del camino hacia tu bienestar emocional y espiritual.
                            </p>
                            <p className="text-foreground leading-relaxed">
                                Prepárate para una experiencia <span className="font-semibold text-primary">transformadora</span> que te ayudará a conectar con tu esencia más profunda.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Service Info */}
                <div className="bg-secondary rounded-2xl p-6 mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Servicio reservado:</p>
                    <p className="font-display text-xl font-semibold text-foreground mb-4">
                        {paymentData?.service}
                    </p>

                    {paymentData?.eventUrl ? (
                        <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-medium">Tu sesión ha sido agendada</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Recibirás un email con el link de Google Meet
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Creando tu evento en el calendario...</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="space-y-4">
                    {paymentData?.eventUrl && (
                        <a
                            href={paymentData.eventUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4"
                        >
                            <Calendar className="w-5 h-5" />
                            Ver mi evento en Google Calendar
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    )}

                    <Link
                        to="/"
                        className="btn-secondary w-full inline-flex items-center justify-center gap-2 py-3"
                    >
                        <Home className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-xs text-muted-foreground mt-6">
                    💚 Revisa tu email (incluyendo spam) para la invitación al evento.
                    <br />
                    Si tienes alguna duda, no dudes en contactarnos.
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;

