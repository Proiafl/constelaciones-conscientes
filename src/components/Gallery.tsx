import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import familyComplete from "@/assets/family-complete.jpg";
import familyChildren from "@/assets/family-children.jpg";
import therapistCouple from "@/assets/therapist-couple.jpg";

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const images = [
    {
      src: familyComplete,
      alt: "Familia completa - vínculos familiares",
      caption: "Los vínculos familiares nos sostienen",
    },
    {
      src: therapistCouple,
      alt: "Pareja - conexión y armonía",
      caption: "El amor como fuerza sanadora",
    },
    {
      src: familyChildren,
      alt: "Madre e hijos - legado familiar",
      caption: "El legado que transmitimos",
    },
  ];

  return (
    <section className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Galería
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            El <span className="text-primary">amor familiar</span> sana
          </h2>
          <p className="text-muted-foreground text-lg">
            Las constelaciones familiares nos ayudan a reconocer, honrar y sanar
            los vínculos con quienes nos precedieron y con quienes compartimos la vida.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={image.alt}
              className="group relative rounded-3xl overflow-hidden shadow-soft"
              style={{ isolation: 'isolate' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="w-full h-full"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-display text-lg text-background text-center">
                    {image.caption}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
