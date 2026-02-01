import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
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

  return (
    <section
      id="constelaciones"
      className="section-padding bg-gradient-warm"
      ref={ref}
    >
      <div className="container-custom">
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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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

            <motion.a
              href="#reservar"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="btn-accent inline-block mt-8"
            >
              Comenzar mi sanación
            </motion.a>
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
      </div>
    </section>
  );
};

export default Constellations;
