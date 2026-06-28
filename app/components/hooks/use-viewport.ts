import * as React from "react";

export type Viewport = "mobile" | "tablet" | "desktop";

/** Layout width — prefers visualViewport on real mobile browsers (address bar, pinch-zoom). */
export function getViewportWidth(): number {
  if (typeof window === "undefined") return 1280;
  return window.visualViewport?.width ?? window.innerWidth;
}

/** Layout height — prefers visualViewport so keyboard scale tracks the visible area. */
export function getViewportHeight(): number {
  if (typeof window === "undefined") return 900;
  return window.visualViewport?.height ?? window.innerHeight;
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
