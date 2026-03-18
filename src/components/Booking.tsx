import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, Clock, Video, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const Booking = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    modality: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check for bots
    if (honeypot) {
      setIsSuccess(true);
      toast.success("¡Consulta enviada! Te contactaré pronto.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor ingresa un email válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_interest: formData.service,
          modality: formData.modality,
          message: formData.message,
        });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("¡Consulta enviada! Te contactaré pronto.");

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          modality: "",
          message: "",
        });
        setIsSubmitting(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error("Hubo un error al enviar tu consulta. Intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const infoItems = [
    {
      icon: Calendar,
      title: "Horarios de Atención",
      description: "Lunes a Viernes 18:30 - 20:30 | Sábados 10:00 - 12:00",
    },
    {
      icon: Video,
      title: "Sesiones Online",
      description: "Zoom o Google Meet con grabación disponible",
    },
    {
      icon: MapPin,
      title: "Sesiones Presenciales",
      description: "Consultorio en zona céntrica (a confirmar ubicación)",
    },
    {
      icon: Clock,
      title: "Respuesta Rápida",
      description: "Te contacto en menos de 24 horas",
    },
  ];

  return (
    <section id="reservar" className="section-padding bg-gradient-warm section-glow overflow-hidden" ref={ref}>
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-primary w-80 h-80 -top-20 right-1/4" />
      <div className="glow-orb glow-orb-secondary w-96 h-96 bottom-1/4 -left-20" style={{ animationDelay: '3.5s' }} />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
              ¿Tienes dudas?
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
              Pregunta antes de tu <span className="text-primary">primera sesión</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
              Completa el formulario y me pondré en contacto contigo en las próximas 24 horas para responder tus dudas y darte los detalles de tu sesión. La primera consulta incluye una breve entrevista para conocer tu situación.
            </p>

            <div className="space-y-4 sm:space-y-6">
              {infoItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 sm:gap-4 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage-light rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 hover-glow transition-smooth">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-background rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-medium card-glow"
            >
              <div style={{ display: "none" }} aria-hidden="true">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nombre completo *
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email *
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Teléfono / WhatsApp *
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+54 11 1234-5678"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-sm font-medium">
                    Tipo de sesión *
                  </Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => handleSelectChange("service", value)}
                    required
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Sesión Individual</SelectItem>
                      <SelectItem value="pareja">Sesión de Pareja</SelectItem>
                      <SelectItem value="taller">Taller Grupal</SelectItem>
                      <SelectItem value="presencial">Constelación Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <Label htmlFor="modality" className="text-sm font-medium">
                  Modalidad preferida *
                </Label>
                <Select
                  value={formData.modality}
                  onValueChange={(value) => handleSelectChange("modality", value)}
                  required
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online (Zoom/Meet)</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="cualquiera">Sin preferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6 space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  ¿Qué te gustaría trabajar? (opcional)
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Cuéntame brevemente sobre tu situación..."
                  className="rounded-xl resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover-lift transition-smooth active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    ¡Enviado!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Solicitar Cita
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Tu información es confidencial y está protegida.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
