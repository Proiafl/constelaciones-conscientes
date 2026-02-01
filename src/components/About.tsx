import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Heart, Users, Star } from "lucide-react";
import therapistProfessional from "@/assets/therapist-professional.jpg";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: Users, value: "+500", label: "Sesiones realizadas" },
    { icon: Award, value: "10+", label: "Años de experiencia" },
    { icon: Heart, value: "100%", label: "Compromiso" },
    { icon: Star, value: "5.0", label: "Calificación" },
  ];

  return (
    <section id="sobre-mi" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative max-w-lg mx-auto">
              <div className="absolute -inset-4 bg-sage-light rounded-3xl -rotate-3" />
              <div className="relative rounded-3xl overflow-hidden shadow-medium">
                <img
                  src={therapistProfessional}
                  alt="Terapeuta profesional"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
              Sobre Mí
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
              Tu guía en el camino hacia la{" "}
              <span className="text-primary">sanación familiar</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Soy terapeuta especializada en Constelaciones Familiares con más de una 
              década de experiencia acompañando a personas en su proceso de sanación. 
              Mi formación incluye estudios en diversas escuelas de constelaciones, 
              siempre buscando las herramientas más efectivas para ayudarte.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Creo firmemente que cada familia tiene su propia historia y su propio 
              camino hacia el equilibrio. Mi rol es acompañarte con respeto, empatía 
              y profesionalismo mientras descubres y liberas los patrones que te limitan.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-secondary rounded-2xl p-4 text-center"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
