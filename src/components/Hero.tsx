import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react"; import therapistHero from "@/assets/hero-photo.png";

const Hero = () => {
  return (
    <section
      id="inicio"
      className="min-h-screen min-h-[100dvh] flex items-center bg-gradient-hero relative overflow-hidden pt-20 pb-12 md:pt-24 md:pb-16 lg:py-0"
    >
      {/* Animated glow orbs with improved visibility */}
      <div className="glow-orb glow-orb-primary w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 -top-20 sm:-top-32 -left-20 sm:-left-32 opacity-50" />
      <div className="glow-orb glow-orb-secondary w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bottom-10 sm:bottom-20 right-5 sm:right-10 opacity-40" style={{ animationDelay: '3s' }} />
      <div className="glow-orb glow-orb-primary w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 top-1/2 right-1/4 opacity-30" style={{ animationDelay: '1.5s' }} />

      <div className="container-custom section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
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
              className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-4 sm:mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
              <span className="text-xs sm:text-sm text-muted-foreground">
                Terapia de Constelaciones Familiares
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-4 sm:mb-6 drop-shadow-sm"
            >
              Sana tu historia,{" "}
              <span className="text-primary drop-shadow-sm">transforma</span> tu presente
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Descubre los patrones ocultos en tu sistema familiar y libera los
              bloqueos que te impiden vivir plenamente. Acompañamiento profesional
              y cercano en tu camino hacia el bienestar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <a
                href="#servicios"
                className="btn-primary inline-flex items-center justify-center gap-2 text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 hover-lift transition-smooth active:scale-95"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                Agenda ya
              </a>
              <a
                href="#constelaciones"
                className="btn-secondary inline-flex items-center justify-center text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 hover-lift transition-smooth active:scale-95"
              >
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
            <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:max-w-none">
              {/* Decorative border with enhanced glow */}
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl animate-glow-pulse" />

              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-medium hover-glow transition-smooth">
                <img
                  src={therapistHero}
                  alt="Terapeuta en Constelaciones Familiares"
                  className="w-full h-auto object-cover aspect-[4/5] sm:aspect-[4/5] lg:aspect-[3/4]"
                />

                {/* Overlay gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
              </div>

              {/* Floating badge - responsive positioning */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-background/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-medium p-3 sm:p-4 hidden sm:block hover-lift transition-smooth"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sage-light rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm sm:text-base">Sesiones disponibles</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">No te quedes sin tu sesión</p>
                  </div>
                </div>
              </motion.div>

              {/* Mobile floating badge - shows on small screens */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm rounded-full shadow-medium px-4 py-2 sm:hidden"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Agenda ya</span>
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
