import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <Hero />
      <About />
      <Marquee />
      <TechStack />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
