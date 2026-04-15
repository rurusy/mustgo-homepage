import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroWithAbout from "@/components/HeroWithAbout";
import NumbersBar from "@/components/NumbersBar";
import Problem from "@/components/Problem";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main id="main-content" className="flex flex-col flex-1">
          <HeroWithAbout />
          <NumbersBar />
          <Problem />
          <Services />
          <Testimonials />
          <Contact />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
