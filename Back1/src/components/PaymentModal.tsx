import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceSlug: string;
    serviceName: string;
    servicePrice: string;
}

export const PaymentModal = ({
    isOpen,
    onClose,
    serviceSlug,
    serviceName,
    servicePrice,
}: PaymentModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast.error("Por favor completa todos los campos obligatorios");
            return;
        }

        setIsLoading(true);

        try {
            console.log("Invoking create-payment function with:", {
                serviceSlug,
                customerName: formData.name,
                customerEmail: formData.email
            });

            // Call Supabase Edge Function to create payment
            const { data, error } = await supabase.functions.invoke("create-payment", {
                body: {
                    serviceSlug,
                    customerName: formData.name,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                },
            });

            if (error) {
                console.error("Supabase Invoke Error:", error);
                // Check if it's a context/auth error or execution error
                throw new Error(error.message || "Error al invocar la función de pago");
            }

            if (!data) {
                throw new Error("No data received from backend");
            }

            console.log("Response from backend:", data);

            if (data.error) {
                throw new Error(data.error);
            }

            if (data?.init_point) {
                // Production redirect (Priority)
                window.location.href = data.init_point;
            } else if (data?.sandbox_init_point) {
                // Return to sandbox if no production link (fallback)
                window.location.href = data.sandbox_init_point;
            } else {
                throw new Error("No redirect URL received. Response: " + JSON.stringify(data));
            }
        } catch (error: any) {
            console.error("Payment error detail:", error);
            // Show the actual error message to the user/developer
            toast.error(`Error: ${error.message || "Hubo un error al procesar el pago"}`);
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl">
                        Reservar {serviceName}
                    </DialogTitle>
                    <DialogDescription>
                        Completa tus datos para proceder al pago seguro con MercadoPago.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Service Summary */}
                    <div className="bg-secondary rounded-xl p-4 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total a pagar:</span>
                        <span className="font-display text-xl font-semibold text-primary">
                            {servicePrice}
                        </span>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo *</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Tu nombre completo"
                                required
                                disabled={isLoading}
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                                disabled={isLoading}
                                className="rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+54 9 11 7965-2013"
                                disabled={isLoading}
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>Continuar al pago seguro</>
                        )}
                    </button>

                    {/* Security Note */}
                    <p className="text-xs text-muted-foreground text-center">
                        🔒 Pago seguro procesado por MercadoPago
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
