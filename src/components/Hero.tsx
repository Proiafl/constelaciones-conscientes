import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import therapistHero from "@/assets/therapist-hero.jpg";

const Hero = () => {
  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center bg-gradient-hero relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-sage-light rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-terracotta-light rounded-full blur-3xl opacity-40" />

      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                Terapia de Constelaciones Familiares
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6"
            >
              Sana tu historia,{" "}
              <span className="text-primary">transforma</span> tu presente
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Descubre los patrones ocultos en tu sistema familiar y libera los
              bloqueos que te impiden vivir plenamente. Acompañamiento profesional
              y cercano en tu camino hacia el bienestar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a href="#reservar" className="btn-primary inline-flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Agendar Sesión
              </a>
              <a href="#constelaciones" className="btn-secondary inline-flex items-center justify-center">
                Conocer Más
              </a>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Decorative border */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-medium">
                <img
                  src={therapistHero}
                  alt="Terapeuta en Constelaciones Familiares"
                  className="w-full h-auto object-cover aspect-[4/5] lg:aspect-[3/4]"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-background rounded-2xl shadow-medium p-4 hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">+500</p>
                    <p className="text-sm text-muted-foreground">Sesiones realizadas</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
