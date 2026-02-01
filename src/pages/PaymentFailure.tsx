import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, RefreshCw, Home, MessageCircle } from "lucide-react";

const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");

    const getErrorMessage = () => {
        switch (status) {
            case "rejected":
                return "Tu pago fue rechazado. Por favor, verifica los datos de tu tarjeta o intenta con otro medio de pago.";
            case "cancelled":
                return "El pago fue cancelado. Si cambiaste de opinión, puedes intentarlo nuevamente.";
            case "pending":
                return "Tu pago está pendiente de confirmación. Te notificaremos cuando se procese.";
            default:
                return "El pago no fue procesado y el servicio no fue agendado.";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-3xl shadow-medium p-8 sm:p-12 max-w-lg w-full text-center border border-border/50"
            >
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600" />
                </motion.div>

                {/* Title */}
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                    Pago No Procesado
                </h1>

                {/* Error Message */}
                <p className="text-muted-foreground text-base sm:text-lg mb-6">
                    {getErrorMessage()}
                </p>

                {/* Reference Info */}
                {paymentId && paymentId !== "null" && (
                    <div className="bg-secondary rounded-2xl p-4 mb-6">
                        <p className="text-xs text-muted-foreground">
                            Referencia: {paymentId}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        to="/#servicios"
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Intentar nuevamente
                    </Link>

                    <a
                        href="https://wa.me/5491179652013?text=Hola, tuve un problema con mi pago"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary w-full inline-flex items-center justify-center gap-2 py-3"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Contactar por WhatsApp
                    </a>

                    <Link
                        to="/"
                        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 justify-center w-full py-2"
                    >
                        <Home className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-xs text-muted-foreground mt-6">
                    Si el problema persiste, no dudes en contactarnos.
                    Estamos aquí para ayudarte.
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentFailure;
