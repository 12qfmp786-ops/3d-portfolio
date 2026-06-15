import { useEffect } from "react";

export const skipLoadingInDev =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_SKIP_LOADING === "true";

export function useDevInitialFX() {
  useEffect(() => {
    if (!skipLoadingInDev) return;

    const timer = window.setTimeout(() => {
      import("@/app/components/util/initialFX").then((module) => {
        module.initialFX();
      });
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);
}
