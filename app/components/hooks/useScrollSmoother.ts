"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useLoading } from "@/app/components/context/LoadingProvider";
import {
  initScrollSmoother,
  refreshScrollSmoother,
} from "@/app/components/util/navScroll";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

export function useScrollSmoother() {
  const { isLoading } = useLoading();

  useEffect(() => {
    initScrollSmoother();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    refreshScrollSmoother();
  }, [isLoading]);

  useEffect(() => {
    const handleResize = () => ScrollSmoother.refresh(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
}
