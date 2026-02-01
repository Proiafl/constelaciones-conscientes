import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, Clock, Video, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const Booking = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    modality: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("¡Solicitud enviada! Te contactaré pronto para confirmar tu cita.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      modality: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="reservar" className="section-padding bg-gradient-warm" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
              Reservar
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
              Agenda tu <span className="text-primary">primera sesión</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Completa el formulario y me pondré en contacto contigo en las próximas
              24 horas para coordinar los detalles de tu sesión. La primera consulta
              incluye una breve entrevista para conocer tu situación.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sage-light rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">
                    Horarios Flexibles
                  </h4>
                  <p className="text-muted-foreground">
                    Lunes a Viernes de 9:00 a 20:00 | Sábados de 10:00 a 15:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sage-light rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">
                    Sesiones Online
                  </h4>
                  <p className="text-muted-foreground">
                    Zoom o Google Meet con grabación disponible
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sage-light rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">
                    Sesiones Presenciales
                  </h4>
                  <p className="text-muted-foreground">
                    Consultorio en zona céntrica (a confirmar ubicación)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sage-light rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">
                    Respuesta Rápida
                  </h4>
                  <p className="text-muted-foreground">
                    Te contacto en menos de 24 horas
                  </p>
                </div>
              </div>
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
              className="bg-background rounded-3xl p-8 shadow-medium"
            >
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    placeholder="+54 11 1234-5678"
                  />
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Tipo de sesión *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="individual">Sesión Individual</option>
                    <option value="pareja">Sesión de Pareja</option>
                    <option value="taller">Taller Grupal</option>
                    <option value="presencial">Constelación Presencial</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="modality"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Modalidad preferida *
                </label>
                <select
                  id="modality"
                  name="modality"
                  value={formData.modality}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                >
                  <option value="">Seleccionar...</option>
                  <option value="online">Online (Zoom/Meet)</option>
                  <option value="presencial">Presencial</option>
                  <option value="cualquiera">Sin preferencia</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  ¿Qué te gustaría trabajar? (opcional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  placeholder="Cuéntame brevemente sobre tu situación..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Enviando..."
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
