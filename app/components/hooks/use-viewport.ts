import * as React from "react";

export type Viewport = "mobile" | "tablet" | "desktop";

/** Layout width — use innerWidth so scale matches DevTools / layout viewport on real devices. */
export function getViewportWidth(): number {
  if (typeof window === "undefined") return 1280;
  return window.innerWidth;
}

/** Layout height — innerHeight stays stable when the mobile browser chrome shows/hides. */
export function getViewportHeight(): number {
  if (typeof window === "undefined") return 900;
  return window.innerHeight;
}

export function getViewport(width = getViewportWidth()): Viewport {
  if (width <= 767) return "mobile";
  if (width <= 1024) return "tablet";
  return "desktop";
}

export function useViewport(): Viewport {
  const [viewport, setViewport] = React.useState<Viewport>(() =>
    typeof window !== "undefined" ? getViewport() : "desktop"
  );

  React.useEffect(() => {
    const update = () => setViewport(getViewport());
    update();
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });
    window.visualViewport?.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return viewport;
}

export function isCompactViewport(viewport: Viewport): boolean {
  return viewport === "mobile" || viewport === "tablet";
}
