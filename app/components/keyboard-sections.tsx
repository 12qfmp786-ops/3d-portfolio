"use client";

import { PropsWithChildren } from "react";
import Landing from "@/app/components/utils/Landing";
import TechStack from "@/app/components/utils/tech-Stack";

/**
 * Landing + Tech Stack — the only sections that drive keyboard scroll animations.
 * Pair with AnimatedBackground (rendered outside #smooth-wrapper).
 * Static sections must be rendered after #keyboard-boundary via StaticPageSections.
 */
export default function KeyboardSections({ children }: PropsWithChildren) {
  return (
    <>
      <Landing>{children}</Landing>
      <TechStack />
      <div id="keyboard-boundary" aria-hidden="true" className="h-px w-full" />
    </>
  );
}
