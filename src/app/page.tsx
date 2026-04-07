import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-background">
      <Navbar />
      <Hero />
      <Marquee />
      <TechStack />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
