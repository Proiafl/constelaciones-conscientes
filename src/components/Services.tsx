import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Video, Users, Sparkles, Star, Clock, Check, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PaymentModal from "@/components/PaymentModal";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    slug: string;
    name: string;
    price: string;
  } | null>(null);

  const services = [
    {
      slug: "individual",
      icon: Video,
      title: "Sesión Individual Online",
      description:
        "Sesiones personalizadas desde tu hogar con total privacidad y profundidad.",
      price: "$40.000",
      duration: "90 minutos",
      features: ["Vía Zoom o Google Meet", "Grabación disponible", "Material de apoyo"],
      popular: true,
      ctaText: "Agendar ahora",
      ctaIcon: Calendar,
    },
    {
      slug: "taller",
      icon: Users,
      title: "Taller Grupal",
      description:
        "Participa en grupo como representante o constelante. Una experiencia transformadora.",
      price: "$50.000",
      duration: "4 horas",
      features: ["Grupos reducidos", "Presencial u online", "Privacidad y confidencialidad"],
      popular: false,
      ctaText: "Completar Formulario",
      ctaIcon: FileText,
    },
    {
      slug: "presencial",
      icon: Sparkles,
      title: "Constelación Presencial",
      description:
        "Sesión en consultorio con representantes físicos. La experiencia más inmersiva.",
      price: "$1.000",
      duration: "90 minutos",
      features: ["Total privacidad", "Uso de figuras", "Ambiente cálido"],
      popular: false,
      ctaText: "Agendar ahora",
      ctaIcon: Calendar,
    },
  ];

  const handleBooking = (service: any) => {
    setSelectedService({
      slug: service.slug,
      name: service.title,
      price: service.price,
    });
    setIsPaymentModalOpen(true);
  };

  return (
    <section id="servicios" className="section-padding bg-background section-glow overflow-hidden" ref={ref}>
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-primary w-96 h-96 top-1/4 -left-32" />
      <div className="glow-orb glow-orb-secondary w-72 h-72 bottom-20 right-0" style={{ animationDelay: '2s' }} />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Servicios
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            Opciones de <span className="text-primary">acompañamiento</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Elige la modalidad que mejor se adapte a tus necesidades y preferencias.
            Todas las sesiones incluyen seguimiento post-sesión.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className={`relative bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-soft card-glow hover-lift border border-border/50 transition-all duration-300 flex flex-col ${service.popular ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
                }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Popular
                </Badge>
              )}

              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sage-light rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 hover-glow transition-smooth">
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>

              <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                {/* Price hidden as requested */}
                {/* <span className="font-display text-xl sm:text-2xl font-semibold text-primary">
                  {service.price}
                </span> */}
                <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {service.duration}
                </span>
              </div>

              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 flex-grow">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBooking(service)}
                className="w-full btn-primary text-center text-xs sm:text-sm py-2.5 sm:py-3 inline-flex items-center justify-center gap-2 hover-lift transition-smooth active:scale-95 mt-auto"
              >
                <service.ctaIcon className="w-4 h-4" />
                {service.ctaText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedService && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          serviceSlug={selectedService.slug}
          serviceName={selectedService.name}
          servicePrice={selectedService.price}
        />
      )}
    </section>
  );
};

export default Services;
