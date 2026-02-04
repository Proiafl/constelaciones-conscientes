import { useState, useEffect } from "react";
import { Loader2, Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, CreditCard, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Step 1: Date & Time
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    // Step 2: Details
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setDate(undefined);
            setSelectedTime(null);
            setAvailableSlots([]);
        }
    }, [isOpen]);

    // Fetch availability when date changes
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!date) return;

            setIsCheckingAvailability(true);
            setSelectedTime(null);

            try {
                // Format YYYY-MM-DD
                const dateStr = format(date, 'yyyy-MM-dd');

                const { data, error } = await supabase.functions.invoke('get-availability', {
                    body: { date: dateStr, serviceSlug }
                });

                if (error) throw error;

                if (data && data.error) {
                    throw new Error(data.error);
                }

                if (data && data.slots) {
                    setAvailableSlots(data.slots);
                } else {
                    setAvailableSlots([]); // Fallback or empty
                }
            } catch (err: any) {
                console.error("Error fetching availability:", err);

                let errorMessage = "No se pudo cargar la disponibilidad";

                // If it's a Supabase FunctionsError, try to get the message
                if (err.context && typeof err.context.json === 'function') {
                    try {
                        const body = await err.context.json();
                        errorMessage = body.error || errorMessage;
                    } catch (e) {
                        errorMessage = err.message || errorMessage;
                    }
                } else {
                    errorMessage = err.message || errorMessage;
                }

                toast.error(`Error: ${errorMessage}`);
                setAvailableSlots([]);
            } finally {
                setIsCheckingAvailability(false);
            }
        };

        fetchAvailability();
    }, [date, serviceSlug]);

    const handleNext = () => {
        if (step === 1) {
            if (!date || !selectedTime) {
                toast.error("Por favor selecciona una fecha y un horario");
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.name || !formData.email) {
                toast.error("Por favor completa los campos obligatorios");
                return;
            }
            setStep(3);
        }
    };

    const handleBack = () => {
        setStep(p => p - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const dateStr = date ? format(date, 'yyyy-MM-dd') : null;

            // Call Supabase Edge Function to create payment with booking data
            const { data, error } = await supabase.functions.invoke("create-payment", {
                body: {
                    serviceSlug,
                    customerName: formData.name,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    bookingDate: dateStr,
                    bookingTime: selectedTime,
                    origin: window.location.origin
                },
            });

            if (error) {
                console.error("Supabase Invoke Error:", error);
                throw new Error(error.message || "Error al invocar la función de pago");
            }

            if (!data) throw new Error("No data received from backend");

            if (data.error) throw new Error(data.error);

            if (data?.init_point) {
                window.location.href = data.init_point;
            } else if (data?.sandbox_init_point) {
                window.location.href = data.sandbox_init_point;
            } else {
                throw new Error("No redirect URL received.");
            }
        } catch (error: any) {
            console.error("Payment error detail:", error);
            toast.error(`Error: ${error.message || "Hubo un error al procesar el pago"}`);
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg md:max-w-xl transition-all duration-300">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        {step > 1 && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={handleBack}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        )}
                        <DialogTitle className="font-display text-xl">
                            {step === 1 && "Seleccionar Fecha y Hora"}
                            {step === 2 && "Tus Datos"}
                            {step === 3 && "Confirmar y Pagar"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        Reservando: <span className="font-semibold text-primary">{serviceName}</span>
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Indicators */}
                <div className="flex gap-2 mb-4">
                    <div className={cn("h-1 flex-1 rounded-full transition-all", step >= 1 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-1 flex-1 rounded-full transition-all", step >= 2 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-1 flex-1 rounded-full transition-all", step >= 3 ? "bg-primary" : "bg-muted")} />
                </div>

                <div className="mt-2 min-h-[300px]">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="border rounded-xl p-3 bg-secondary/20">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border-0 w-full flex justify-center"
                                        disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                                        initialFocus
                                        locale={es}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>Horarios disponibles</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                                        {!date ? (
                                            <p className="col-span-2 text-sm text-muted-foreground text-center py-8">
                                                Selecciona un día para ver horarios
                                            </p>
                                        ) : isCheckingAvailability ? (
                                            <div className="col-span-2 flex justify-center py-8">
                                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                            </div>
                                        ) : availableSlots.length === 0 ? (
                                            <p className="col-span-2 text-sm text-muted-foreground text-center py-8">
                                                No hay horarios disponibles para esta fecha.
                                            </p>
                                        ) : (
                                            availableSlots.map((slot) => (
                                                <Button
                                                    key={slot}
                                                    variant={selectedTime === slot ? "default" : "outline"}
                                                    className={cn("w-full h-9", selectedTime === slot && "bg-primary text-primary-foreground")}
                                                    onClick={() => setSelectedTime(slot)}
                                                >
                                                    {slot}
                                                </Button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-secondary/30 rounded-xl p-4 flex items-center gap-3 mb-6">
                                <CalendarIcon className="w-5 h-5 text-primary" />
                                <div>
                                    <p className="text-sm font-medium">
                                        {date && format(date, "EEEE d 'de' MMMM", { locale: es })}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        a las {selectedTime} hs
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre completo *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Tu nombre completo"
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
                                        placeholder="+54 9 11..."
                                        className="rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    Resumen de reserva
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Servicio</span>
                                        <span className="font-medium text-right">{serviceName}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground flex items-center gap-1"><CalendarIcon className="w-3 h-3" /> Fecha</span>
                                        <span className="font-medium">{date && format(date, "d 'de' MMMM", { locale: es })}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> Hora</span>
                                        <span className="font-medium">{selectedTime} hs</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> Cliente</span>
                                        <span className="font-medium">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="font-semibold text-lg">Total</span>
                                        <span className="font-display font-bold text-2xl text-primary">{servicePrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex gap-3">
                    {step < 3 ? (
                        <Button
                            className="w-full rounded-xl"
                            size="lg"
                            onClick={handleNext}
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            className="w-full rounded-xl btn-primary"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                "Pagar y Confirmar"
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
