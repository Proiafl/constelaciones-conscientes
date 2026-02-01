import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, Instagram, MessageCircle } from "lucide-react";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+54 11 1234-5678",
      href: "https://wa.me/5411123456789",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contacto@constelaciones.com",
      href: "mailto:contacto@constelaciones.com",
      color: "bg-sage-light text-primary",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@constelaciones.familiares",
      href: "https://instagram.com/constelaciones.familiares",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: "+54 11 1234-5678",
      href: "tel:+5411123456789",
      color: "bg-terracotta-light text-accent",
    },
  ];

  return (
    <section id="contacto" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-accent font-medium text-sm uppercase tracking-wider mb-4">
            Contacto
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            ¿Tienes <span className="text-primary">preguntas</span>?
          </h2>
          <p className="text-muted-foreground text-lg">
            Estoy aquí para acompañarte. Contáctame por el canal que prefieras
            y te responderé a la brevedad.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.label}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-card rounded-3xl p-6 shadow-soft border border-border/50 text-center card-hover group"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${method.color}`}
              >
                <method.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {method.label}
              </h3>
              <p className="text-sm text-muted-foreground">{method.value}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
