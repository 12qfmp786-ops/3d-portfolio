"use client";
import { LoadingProvider } from "@/app/components/context/LoadingProvider";
import { useDevInitialFX } from "@/app/components/hooks/useDevInitialFX";
import Landing from "@/app/components/utils/Landing";
import Navbar from "@/app/components/utils/navbar";
import WhatIDo from "@/app/components/utils/WhatIDo";
import "@/app/components/index.css";
import MainContainer from "@/app/components/utils/MainContainer";
import Career from "@/app/components/utils/Career";
import SocialIcons from "@/app/components/utils/SocialIcons";
import Contact from "@/app/components/utils/Contact";
import Projects from "@/app/components/utils/projects"
import AnimatedBackground from "@/app/components/animated-background";

export default function Home() {
  useDevInitialFX();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-black font-sans dark:bg-black">
      <LoadingProvider>
        <div id="smooth-wrapper">
          <AnimatedBackground />
          <div id="smooth-content">
            <Landing>
              <Navbar />
              <MainContainer />
            </Landing>
            <WhatIDo />
            <Career />
            <Projects />
            <Contact />
          </div>
        </div>
        <SocialIcons />
      </LoadingProvider>
    </div>
  );
}
