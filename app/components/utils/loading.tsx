"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../styles/Loading.css";
import { useLoading } from "@/app/components/context/LoadingProvider";

const MARQUEE_ITEMS = [
  "A Creative Developer",
  "A Creative Designer",
  "A Creative Developer",
  "A Creative Designer",
];

const Loading = () => {
  const { setIsLoading } = useLoading();
  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"loading" | "welcome" | "exit">("loading");
  const timelineStarted = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const setCenter = () => {
      const rect = wrap.getBoundingClientRect();
      wrap.style.setProperty("--mouse-x", `${rect.width * 0.15}px`);
      wrap.style.setProperty("--mouse-y", `${rect.height * 0.35}px`);
    };

    setCenter();
    requestAnimationFrame(setCenter);
    window.addEventListener("resize", setCenter);
    return () => window.removeEventListener("resize", setCenter);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  useEffect(() => {
    if (timelineStarted.current) return;
    timelineStarted.current = true;

    const progress = { value: 0 };
    const wrap = wrapRef.current;
    const overlay = overlayRef.current;

    const updatePercent = () => {
      if (percentRef.current) {
        percentRef.current.textContent = `${Math.round(progress.value)}%`;
      }
    };

    const master = gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    master.to(progress, {
      value: 92,
      duration: 7.2,
      ease: "power1.out",
      onUpdate: updatePercent,
    });

    master.to(progress, {
      value: 100,
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: updatePercent,
    });

    master.to({}, { duration: 0.6, onComplete: () => setPhase("welcome") });

    master.to({}, { duration: 1.05 });

    master.call(() => setPhase("exit"));

    if (wrap) {
      master.to(wrap, {
        scale: 55,
        duration: 0.85,
        ease: "power3.inOut",
        force3D: true,
      });
    }

    if (overlay) {
      master.to(
        overlay,
        {
          opacity: 0,
          duration: 0.35,
          ease: "power1.out",
        },
        "-=0.2"
      );
    }

    master.call(() => {
      setIsLoading(false);
    });

    return () => {
      master.kill();
    };
  }, [setIsLoading]);

  return (
    <div className="loading-overlay" ref={overlayRef}>
      <div className="loading-header" aria-hidden="true">
        <a href="/#" className="loader-title" data-cursor="disable" />
        <div className={`loaderGame ${phase === "exit" ? "loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(8)].map((_, index) => (
                <div className="loaderGame-line" key={index} />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>

      <div className="loading-screen">
        <div className="loading-marquee" aria-hidden="true">
          <div className="loading-marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, index) => (
              <span key={`${text}-${index}`}>{text}</span>
            ))}
          </div>
        </div>

        <div
          ref={wrapRef}
          className={`loading-wrap ${phase === "exit" ? "loading-clicked" : ""}`}
          onMouseMove={handleMouseMove}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${phase !== "loading" ? "loading-complete" : ""}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span ref={percentRef}>0%</span>
                </div>
              </div>
              <div className="loading-box" />
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
