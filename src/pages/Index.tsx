import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Constellations from "@/components/Constellations";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="overflow-hidden">
      <Header />
      <Hero />
      <About />
      <Constellations />
      <Services />
      <Gallery />
      <Testimonials />
      <Booking />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
