import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container-custom px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-semibold mb-4">
              Constelaciones Familiares
            </h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Acompañamiento terapéutico profesional para sanar tu historia familiar
              y transformar tu presente.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-background/70 hover:text-background text-sm transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#sobre-mi" className="text-background/70 hover:text-background text-sm transition-colors">
                  Sobre Mí
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-background/70 hover:text-background text-sm transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#reservar" className="text-background/70 hover:text-background text-sm transition-colors">
                  Reservar Cita
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>contacto@constelaciones.com</li>
              <li>+54 11 1234-5678</li>
              <li>Lunes a Viernes 9:00 - 20:00</li>
              <li>Sábados 10:00 - 15:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © {currentYear} Constelaciones Familiares. Todos los derechos reservados.
          </p>
          <p className="text-background/60 text-sm flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-accent fill-accent" /> para tu bienestar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
