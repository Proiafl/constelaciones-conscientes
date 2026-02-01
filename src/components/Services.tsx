import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Video, Users, Heart, Sparkles } from "lucide-react";

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: Video,
      title: "Sesión Individual Online",
      description:
        "Sesiones personalizadas desde la comodidad de tu hogar. Trabajamos tus temas específicos con total privacidad y profundidad.",
      price: "Consultar",
      duration: "90 minutos",
      features: ["Vía Zoom o Google Meet", "Grabación disponible", "Material de apoyo"],
    },
    {
      icon: Users,
      title: "Taller Grupal",
      description:
        "Participa como representante o constelante en un grupo. Una experiencia transformadora donde todos sanan.",
      price: "Consultar",
      duration: "4 horas",
      features: ["Grupos reducidos", "Presencial u online", "Certificado de participación"],
    },
    {
      icon: Heart,
      title: "Sesión de Pareja",
      description:
        "Trabaja los vínculos y dinámicas de tu relación. Descubre qué patrones familiares afectan tu pareja.",
      price: "Consultar",
      duration: "120 minutos",
      features: ["Ambos participan", "Dinámicas específicas", "Seguimiento incluido"],
    },
    {
      icon: Sparkles,
      title: "Constelación Presencial",
      description:
        "Sesión en consultorio con representantes físicos. La experiencia más profunda e inmersiva.",
      price: "Consultar",
      duration: "120 minutos",
      features: ["Consultorio privado", "Uso de figuras", "Ambiente cálido"],
    },
  ];

  return (
    <section id="servicios" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Servicios
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Opciones de <span className="text-primary">acompañamiento</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Elige la modalidad que mejor se adapte a tus necesidades y preferencias.
            Todas las sesiones incluyen seguimiento post-sesión.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-card rounded-3xl p-6 shadow-soft card-hover border border-border/50"
            >
              <div className="w-14 h-14 bg-sage-light rounded-2xl flex items-center justify-center mb-5">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {service.description}
              </p>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-display text-2xl font-semibold text-primary">
                  {service.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {service.duration}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#reservar"
                className="w-full btn-secondary text-center text-sm py-3 block"
              >
                Reservar
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
