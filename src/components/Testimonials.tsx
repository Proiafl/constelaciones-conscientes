import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      name: "María Elena",
      role: "Sesión Individual",
      content:
        "Después de años de terapia tradicional, una sola sesión de constelación me ayudó a entender patrones que venían de generaciones atrás. Siento una paz que no conocía.",
      rating: 5,
    },
    {
      name: "Carlos Alberto",
      role: "Taller Grupal",
      content:
        "Participar como representante fue una experiencia increíble. Sentí en mi cuerpo emociones que no eran mías y entendí cómo funciona el campo familiar. Muy recomendable.",
      rating: 5,
    },
    {
      name: "Luciana y Pedro",
      role: "Sesión de Pareja",
      content:
        "Nuestra relación estaba en crisis y las constelaciones nos mostraron que arrastrábamos historias de nuestras familias. Hoy tenemos herramientas para construir nuestra propia historia.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonios" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Testimonios
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Historias de <span className="text-primary">transformación</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Cada persona que llega a una constelación tiene su propia historia.
            Estas son algunas experiencias de quienes ya iniciaron su camino de sanación.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="bg-card rounded-3xl p-8 shadow-soft border border-border/50 relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-sage-light" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center">
                  <span className="font-display text-lg font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
