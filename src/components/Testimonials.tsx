import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "María Elena",
      role: "Sesión Individual",
      content:
        "Después de años de terapia tradicional, una sola sesión de constelación me ayudó a entender patrones que venían de generaciones atrás. Siento una paz que no conocía.",
      rating: 5,
      initials: "ME",
    },
    {
      name: "Carlos Alberto",
      role: "Taller Grupal",
      content:
        "Participar como representante fue una experiencia increíble. Sentí en mi cuerpo emociones que no eran mías y entendí cómo funciona el campo familiar. Muy recomendable.",
      rating: 5,
      initials: "CA",
    },
    {
      name: "Luciana y Pedro",
      role: "Sesión de Pareja",
      content:
        "Nuestra relación estaba en crisis y las constelaciones nos mostraron que arrastrábamos historias de nuestras familias. Hoy tenemos herramientas para construir nuestra propia historia.",
      rating: 5,
      initials: "LP",
    },
    {
      name: "Sofía Martínez",
      role: "Sesión Individual Online",
      content:
        "Tenía dudas sobre hacer la sesión online, pero fue igual de profunda. La flexibilidad de poder hacerlo desde casa me ayudó a estar más relajada y receptiva.",
      rating: 5,
      initials: "SM",
    },
    {
      name: "Roberto García",
      role: "Constelación Presencial",
      content:
        "La experiencia presencial con las figuras fue muy poderosa. Pude ver claramente las dinámicas de mi familia y encontrar mi lugar. Muy agradecido.",
      rating: 5,
      initials: "RG",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get visible testimonials (3 for desktop, 1 for mobile with carousel)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section id="testimonios" className="section-padding bg-background section-glow overflow-hidden" ref={ref}>
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-primary w-72 h-72 top-10 left-1/4" />
      <div className="glow-orb glow-orb-secondary w-80 h-80 bottom-10 right-10" style={{ animationDelay: '2.5s' }} />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Testimonios
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            Historias de <span className="text-primary">transformación</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Cada persona que llega a una constelación tiene su propia historia.
            Estas son algunas experiencias de quienes ya iniciaron su camino de sanación.
          </p>
        </motion.div>

        {/* Desktop: Show 3 cards */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {getVisibleTestimonials().map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${currentIndex}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-soft border border-border/50 relative hover-lift card-glow transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 sm:w-10 sm:h-10 text-sage-light" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                  <span className="font-display text-sm sm:text-base font-semibold text-white">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm sm:text-base">
                    {testimonial.name}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Single card carousel */}
        <div className="md:hidden">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 relative card-glow"
          >
            <Quote className="absolute top-4 right-4 w-6 h-6 md:w-8 md:h-8 text-sage-light opacity-30" />

            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-accent text-accent"
                />
              ))}
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">
              "{testimonials[currentIndex].content}"
            </p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <span className="font-display text-sm font-semibold text-white">
                  {testimonials[currentIndex].initials}
                </span>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Carousel Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary flex items-center justify-center hover-lift transition-smooth active:scale-95"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          </button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                  ? "bg-primary w-6 sm:w-8"
                  : "bg-border hover:bg-muted-foreground"
                  }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary flex items-center justify-center hover-lift transition-smooth active:scale-95"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
