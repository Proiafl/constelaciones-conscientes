import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Home, MessageCircle } from "lucide-react";

const PaymentPending = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get("payment_id");

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-background rounded-3xl shadow-medium p-8 sm:p-12 max-w-lg w-full text-center"
            >
                {/* Pending Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />
                </motion.div>

                {/* Title */}
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-3">
                    Pago Pendiente
                </h1>

                {/* Message */}
                <p className="text-muted-foreground text-base sm:text-lg mb-6">
                    Tu pago está siendo procesado. Esto puede tomar unos minutos dependiendo del método de pago elegido.
                </p>

                {/* Reference Info */}
                {paymentId && (
                    <div className="bg-secondary rounded-2xl p-4 mb-6">
                        <p className="text-sm text-muted-foreground mb-1">Referencia:</p>
                        <p className="font-mono text-foreground">{paymentId}</p>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
                    <h3 className="font-semibold text-amber-800 mb-2">¿Qué sucede ahora?</h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Te enviaremos un email cuando el pago se confirme</li>
                        <li>• Una vez confirmado, podrás agendar tu sesión</li>
                        <li>• Los pagos en efectivo pueden demorar hasta 48h</li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link
                        to="/"
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 py-4"
                    >
                        <Home className="w-5 h-5" />
                        Volver al inicio
                    </Link>

                    <a
                        href="https://wa.me/5491112345678?text=Hola, tengo una consulta sobre mi pago pendiente"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary w-full inline-flex items-center justify-center gap-2 py-3"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Consultar por WhatsApp
                    </a>
                </div>

                {/* Help Text */}
                <p className="text-xs text-muted-foreground mt-6">
                    Guarda esta referencia para cualquier consulta.
                </p>
            </motion.div>
        </div>
    );
};

export default PaymentPending;
