import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Heart, Users, Star, Sparkles } from "lucide-react";
import therapistProfessional from "@/assets/therapist-professional.jpg";

const About = () => {
  const ref = useRef(null);
  const imageRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Parallax effect for image
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const stats = [
    { icon: Users, value: "+50", label: "Sesiones realizadas" },
    { icon: Award, value: "+3", label: "Años de experiencia" },
    { icon: Heart, value: "100%", label: "Compromiso" },
    { icon: Star, value: "5.0", label: "Calificación" },
  ];

  return (
    <section id="sobre-mi" className="section-padding bg-background section-glow overflow-hidden" ref={ref}>
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-primary w-80 h-80 -top-20 -right-20" />
      <div className="glow-orb glow-orb-secondary w-64 h-64 bottom-10 -left-10" style={{ animationDelay: '3s' }} />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Image with Parallax */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div style={{ y }} className="relative max-w-lg mx-auto">
              {/* Decorative background with glow effect on hover */}
              <div className="absolute -inset-4 bg-sage-light rounded-3xl -rotate-3 transition-all duration-300 group-hover:shadow-lg" />
              <div className="relative rounded-3xl overflow-hidden shadow-medium hover-glow transition-smooth group">
                <img
                  src={therapistProfessional}
                  alt="Terapeuta profesional"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 bg-background/95 backdrop-blur-sm rounded-xl shadow-medium p-3 hidden sm:flex items-center gap-2 hover-lift"
              >
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold text-foreground">Certificada</span>
              </motion.div>
            </motion.div>
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
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
              Tu guía en el camino hacia la{" "}
              <span className="text-primary">sanación familiar</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
              Soy Facilitadora egresada del Centro Latinoamericano de Constelaciones Familiares (CLCF) con más de Tres años de experiencia acompañando a personas en su proceso de sanación.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
              Llegue a las constelaciones familiares buscando una herramienta de sanacion en un momento trascendental de mi vida como la perdida física de mi madre y desde entonces se convirtió en una pasión y un proposito de vida.
            </p>
            <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
              Creo firmemente que cada familia tiene su propia historia y su propio
              camino hacia el equilibrio. Mi rol es acompañarte con respeto, empatía
              y profesionalismo mientras descubres y liberas los patrones que te limitan.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-secondary rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center hover-lift cursor-default card-glow"
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1.5 sm:mb-2" />
                  <p className="font-display text-xl sm:text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
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
