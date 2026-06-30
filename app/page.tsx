"use client";
import { LoadingProvider } from "@/app/components/context/LoadingProvider";
import { useDevInitialFX } from "@/app/components/hooks/useDevInitialFX";
import { useScrollSmoother } from "@/app/components/hooks/useScrollSmoother";
import AnimatedBackground from "@/app/components/animated-background";
import KeyboardSections from "@/app/components/keyboard-sections";
import StaticPageSections from "@/app/components/static-page-sections";
import Navbar from "@/app/components/utils/navbar";
import "@/app/components/index.css";
import MainContainer from "@/app/components/utils/MainContainer";
import SocialIcons from "@/app/components/utils/SocialIcons";

function HomeContent() {
  useDevInitialFX();
  useScrollSmoother();

  return (
    <>
      {/* Outside smooth-wrapper so position:fixed tracks the viewport, not a transformed scroll layer */}
      <AnimatedBackground />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <KeyboardSections>
            <MainContainer />
          </KeyboardSections>
          <StaticPageSections />
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
