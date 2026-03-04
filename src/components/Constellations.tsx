import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, MessageCircle, Calendar, Sparkles, Heart } from "lucide-react";
import therapistConstellation from "@/assets/therapist-constellation.jpg";

const Constellations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    "Liberar patrones familiares limitantes",
    "Sanar relaciones con padres e hijos",
    "Resolver conflictos de pareja",
    "Superar duelos y pérdidas",
    "Desbloquear aspectos laborales y económicos",
    "Encontrar tu lugar en el sistema familiar",
  ];

  const steps = [
    {
      icon: MessageCircle,
      step: "01",
      title: "Contacto Inicial",
      description: "Conversamos sobre tu situación y lo que deseas trabajar. Resolvemos tus dudas y evaluamos juntos el mejor enfoque.",
    },
    {
      icon: Calendar,
      step: "02",
      title: "Agenda tu Sesión",
      description: "Elegimos la fecha y modalidad ideal para ti: individual, grupal, presencial u online.",
    },
    {
      icon: Sparkles,
      step: "03",
      title: "La Constelación",
      description: "En un espacio seguro y contenedor, trabajamos tu tema. La constelación revela dinámicas ocultas y abre caminos de solución.",
    },
    {
      icon: Heart,
      step: "04",
      title: "Integración",
      description: "El proceso continúa después de la sesión. Te acompaño en la integración de los movimientos sanadores.",
    },
  ];

  return (
    <section
      id="constelaciones"
      className="section-padding bg-gradient-warm section-glow overflow-hidden"
      ref={ref}
    >
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-primary w-72 h-72 top-20 right-10" />
      <div className="glow-orb glow-orb-secondary w-80 h-80 bottom-1/4 -left-20" style={{ animationDelay: '4s' }} />

      <div className="container-custom relative z-10">
        {/* Main Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Constelaciones Familiares
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            ¿Qué son las <span className="text-primary">Constelaciones Familiares</span>?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Las Constelaciones Familiares son una herramienta terapéutica desarrollada
            por Bert Hellinger que permite visualizar las dinámicas ocultas en nuestro
            sistema familiar y encontrar soluciones que traigan paz y equilibrio.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Beneficios de las Constelaciones
            </h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              A través de las constelaciones podemos acceder a información del
              inconsciente familiar que nos afecta sin que lo sepamos. Al traer
              luz a estos patrones, podemos liberarlos y vivir de manera más plena.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="relative max-w-lg mx-auto">
              <div className="absolute -inset-4 bg-terracotta-light rounded-3xl rotate-3" />
              <div className="relative rounded-3xl overflow-hidden shadow-medium">
                <img
                  src={therapistConstellation}
                  alt="Terapeuta trabajando con figuras de constelación"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Process Section - Cómo Trabajamos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Proceso
          </span>
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
            ¿Cómo <span className="text-primary">trabajamos</span>?
          </h3>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Un proceso claro y acompañado, desde el primer contacto hasta
            la integración de tu experiencia.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              className="relative group"
            >
              {/* Connector Line (desktop) */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1.2 + index * 0.2 }}
                  className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-accent/50 origin-left z-0"
                />
              )}

              <div className="relative z-10 text-center">
                {/* Animated Icon Container */}
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-sage-light mb-5 hover-lift cursor-pointer relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Glow ring on hover */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-300" />

                  {/* Rotating ring animation */}
                  <motion.div
                    className="absolute inset-1 rounded-full border-2 border-dashed border-primary/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Icon with unique animation per step */}
                  {index === 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <step.icon className="text-primary relative z-10" size={32} />
                    </motion.div>
                  )}
                  {index === 1 && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <step.icon className="text-primary relative z-10" size={32} />
                    </motion.div>
                  )}
                  {index === 2 && (
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <step.icon className="text-primary relative z-10" size={32} />
                    </motion.div>
                  )}
                  {index === 3 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <step.icon className="text-primary relative z-10" size={32} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Step Number Badge */}
                <motion.span
                  className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-3"
                  whileHover={{ scale: 1.1 }}
                >
                  Paso {step.step}
                </motion.span>

                {/* Content */}
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-lg mb-6">
            ¿Listo para dar el primer paso hacia tu transformación?
          </p>
          <a href="#reservar" className="btn-accent inline-flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Comenzar mi sanación
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Constellations;
