"use client";

import { SectionHeader } from "@/app/components/utils/section-header";

export default function TechStack() {
  return (
    <div id="tech-stack-zone">
      <div id="tech-stack-header">
        <h1 className="text-7xl font-bold text-center">TECH STACK</h1>
        <p className="hidden md:block text-center text-sm text-gray-500">
          (hint: press any key to see the tech stack)
        </p>
      </div>
      <section
        id="tech-stack"
        className="relative z-[2] w-full h-screen md:h-[50dvh] pointer-events-none"
      >
        <SectionHeader id="tech-stack" title="" desc="" />
      </section>
    </div>
  );
}
