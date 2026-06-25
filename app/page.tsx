"use client";
import { LoadingProvider } from "@/app/components/context/LoadingProvider";
import { useDevInitialFX } from "@/app/components/hooks/useDevInitialFX";
import { useScrollSmoother } from "@/app/components/hooks/useScrollSmoother";
import Landing from "@/app/components/utils/Landing";
import Navbar from "@/app/components/utils/navbar";
import WhatIDo from "@/app/components/utils/WhatIDo";
import TechStack from "@/app/components/utils/tech-Stack";
import "@/app/components/index.css";
import MainContainer from "@/app/components/utils/MainContainer";
import Career from "@/app/components/utils/Career";
import SocialIcons from "@/app/components/utils/SocialIcons";
import Contact from "@/app/components/utils/Contact";
import Projects from "@/app/components/utils/projects";
import AnimatedBackground from "@/app/components/animated-background";

function HomeContent() {
  useDevInitialFX();
  useScrollSmoother();

  return (
    <>
      <div id="smooth-wrapper">
        <AnimatedBackground />
        <div id="smooth-content">
          <Landing>
            <MainContainer />
          </Landing>
          <TechStack />
          <WhatIDo />
          <Career />
          <Projects />
          <Contact />
       
        </div>
      </div>
      <Navbar />
      <SocialIcons />
    </>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-black font-sans dark:bg-black">
      <LoadingProvider>
        <HomeContent />
      </LoadingProvider>
    </div>
  );
}
