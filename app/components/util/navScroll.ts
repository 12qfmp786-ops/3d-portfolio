import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export function getSmoother() {
  return ScrollSmoother.get();
}

export function refreshScrollSmoother() {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh(true);
    getSmoother()?.refresh(true);
  });
}

export function scrollToSection(target: string) {
  const instance = getSmoother();
  if (!instance || !target) return;

  const section = document.querySelector(target);
  if (!section) return;

  instance.paused(false);
  ScrollTrigger.refresh(true);
  instance.scrollTo(target, true, "top top");

  const hash = target === "#hero" ? "" : target;
  window.history.replaceState(
    window.history.state,
    "",
    window.location.pathname + window.location.search + hash
  );
}

export function initScrollSmoother() {
  if (ScrollSmoother.get()) return ScrollSmoother.get()!;

  const wrapper = document.querySelector("#smooth-wrapper");
  const content = document.querySelector("#smooth-content");
  if (!wrapper || !content) return undefined;

  const instance = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.7,
    speed: 1.7,
    effects: true,
    autoResize: true,
    ignoreMobileResize: true,
  });

  instance.scrollTop(0);
  instance.paused(true);

  refreshScrollSmoother();

  return instance;
}

export function unpauseScrollSmoother() {
  getSmoother()?.paused(false);
}
