import WhatIDo from "@/app/components/utils/WhatIDo";
import Career from "@/app/components/utils/Career";
import Projects from "@/app/components/utils/projects";
import Contact from "@/app/components/utils/Contact";
import Footer from "@/app/components/footer/footer";

/**
 * Sections rendered below the keyboard zone. No AnimatedBackground or
 * keyboard scroll triggers are attached to this tree.
 */
export default function StaticPageSections() {
  return (
    <>
      <WhatIDo />
      <Career />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
