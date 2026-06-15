import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initCareerLineFX() {
  const timeline = document.querySelector(".career-timeline");
  const careerInfo = document.querySelector(".career-info");

  if (!timeline || !careerInfo) return () => {};

  const tween = gsap.to(timeline, {
    maxHeight: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: careerInfo,
      scroller: "#smooth-wrapper",
      start: "top 75%",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  ScrollTrigger.refresh(true);

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
