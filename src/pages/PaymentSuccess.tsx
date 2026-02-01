import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, ArrowRight, Loader2, Home } from "lucide-react";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<{
        service: string;
        bookingUrl: string;
    } | null>(null);

    // Get payment info from URL params
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");
    const serviceType = searchParams.get("service") || "individual";
    const calendarUrl = searchParams.get("calendar");

    // Default Calendar URLs (fallback if not in URL param)
    const defaultCalendarUrl = "https://calendar.app.google/hQxfV7AcTpDrjdRPA";

    // Legacy support for specific envs, but defaulting to Google Calendar
    const bookingUrls: Record<string, string> = {
        individual: defaultCalendarUrl,
        taller: defaultCalendarUrl,
        presencial: defaultCalendarUrl,
    };

    const serviceNames: Record<string, string> = {
        individual: "Sesión Individual Online",
        taller: "Taller Grupal",
        presencial: "Constelación Presencial",
    };

    useEffect(() => {
        // Simulate loading while verifying payment
        const timer = setTimeout(() => {
            setPaymentData({
                service: serviceNames[serviceType] || "Sesión",
                bookingUrl: calendarUrl || bookingUrls[serviceType] || defaultCalendarUrl,
            });
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [serviceType]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
                    <p className="text-muted-foreground">Verificando tu pago...</p>
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
                className="bg-background rounded-3xl shadow-medium p-8 sm:p-12 max-w-lg w-full text-center"
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
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                    ¡Pago Exitoso!
                </h1>

                {/* Subtitle */}
                <p className="text-muted-foreground text-base sm:text-lg mb-6">
                    Tu pago ha sido procesado correctamente.
                </p>

                {/* Service Info */}
                <div className="bg-secondary rounded-2xl p-4 sm:p-6 mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Servicio adquirido:</p>
                    <p className="font-display text-lg font-semibold text-foreground">
                        {paymentData?.service}
                    </p>
                    {paymentId && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Referencia: {paymentId}
                        </p>
                    )}
                </div>

                {/* Next Step */}
                <div className="space-y-4">
                    <p className="text-foreground font-medium">
                        🎉 ¡Ahora agenda tu sesión!
                    </p>

                    <a
                        href={paymentData?.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4"
                    >
                        <Calendar className="w-5 h-5" />
                        Agendar mi sesión
                        <ArrowRight className="w-5 h-5" />
                    </a>

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
                    También recibirás un email de confirmación con el link para agendar.
                    Si tienes alguna duda, contáctanos.
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
