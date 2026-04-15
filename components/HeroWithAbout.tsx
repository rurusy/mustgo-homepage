"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import AboutPanel from "@/components/AboutPanel";

export default function HeroWithAbout() {
  const [aboutOpen, setAboutOpen] = useState(false);
  return (
    <>
      <Hero onOpenAbout={() => setAboutOpen(true)} />
      <AboutPanel open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}
