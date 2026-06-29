"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/app/components/data/constants";
import { sleep } from "@/app/components/lib/utils";
import { getViewport, isCompactViewport, useViewport } from "@/app/components/hooks/use-viewport";
import { useLoading } from "@/app/components/context/LoadingProvider";
import { Section, getKeyboardState } from "@/app/components/animated-background-config";
import { useSounds } from "@/app/components/hooks/use-sounds";
import { usePerfProfile } from "@/app/components/hooks/use-perf-profile";
import { LAYOUT_READY_EVENT } from "@/app/components/util/initialFX";

gsap.registerPlugin(ScrollTrigger);

function setSplineVariable(app: Application, name: string, value: string) {
  try {
    if (app.getVariable(name) === undefined) return;
    app.setVariable(name, value);
  } catch {
    /* variable not defined in scene export */
  }
}

const KeyboardScene = ({ maxDpr }: { maxDpr: number }) => {
  const { isLoading } = useLoading();
  const viewport = useViewport();
  const isCompact = isCompactViewport(viewport);
  const splineContainer = useRef<HTMLDivElement>(null);
  const keyboardSceneRef = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  // Animation controllers refs
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void }>(null);
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>(null);

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") !== undefined && splineApp.getVariable("desc") !== undefined) {
        setSplineVariable(splineApp, "heading", "");
        setSplineVariable(splineApp, "desc", "");
      }
    } else {
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== e.target.name) {
        const skill = SKILLS[e.target.name as SkillNames];
        if (skill) {
          if (selectedSkillRef.current) playReleaseSound();
          playPressSound();
          setSelectedSkill(skill);
          selectedSkillRef.current = skill;
        }
      }
    }
  };

  const handleSplineInteractions = () => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    splineApp.addEventListener("keyUp", () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      setSplineVariable(splineApp, "heading", "");
      setSplineVariable(splineApp, "desc", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        setSplineVariable(splineApp, "heading", skill.label);
        setSplineVariable(splineApp, "desc", skill.shortDescription);
      }
    });
    splineApp.addEventListener("mouseHover", handleMouseHover);
  };

  const applyKeyboardLayout = (section: Section = activeSection) => {
    if (!splineApp) return;
    syncSplineCanvasSize(splineApp, keyboardSceneRef.current);
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;
    const state = getKeyboardState({ section, viewport: getViewport() });
    gsap.set(kbd.scale, state.scale);
    gsap.set(kbd.position, state.position);
    gsap.set(kbd.rotation, state.rotation);
  };

  const refreshKeyboardLayout = () => {
    applyKeyboardLayout();
    const scene = keyboardSceneRef.current;
    if (scene) {
      const { width, height } = scene.getBoundingClientRect();
      if (
        width >= window.innerWidth * 0.9 &&
        height >= window.innerHeight * 0.9
      ) {
        setLayoutReady(true);
      }
    }
    ScrollTrigger.refresh(true);
  };

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const createSectionTimeline = (
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    const applyState = (section: Section) => {
      const state = getKeyboardState({ section, viewport: getViewport() });
      gsap.to(kbd.scale, { ...state.scale, duration: 1 });
      gsap.to(kbd.position, { ...state.position, duration: 1 });
      gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
    };

    return gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        scroller: "#smooth-wrapper",
        start,
        end,
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: () => {
          setActiveSection(targetSection);
          applyState(targetSection);
        },
        onEnterBack: () => {
          setActiveSection(targetSection);
          applyState(targetSection);
        },
        onLeave: () => {
          setActiveSection(targetSection);
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          applyState(prevSection);
        },
      },
    });
  };

  const setupScrollAnimations = (): gsap.core.Timeline[] => {
    if (!splineApp || !keyboardSceneRef.current) return [];

    applyKeyboardLayout("hero");

    // Section transitions
    return [
      createSectionTimeline("#hero", "hero", "hero", "top top", "bottom 40%"),
      createSectionTimeline("#tech-stack", "techStack", "hero"),
      createSectionTimeline("#skills", "skills", "techStack"),
      createSectionTimeline("#experience", "experience", "skills"),
      createSectionTimeline("#projects", "projects", "experience", "top 70%"),
      createSectionTimeline("#contact", "contact", "projects", "top 30%"),
    ].filter(Boolean) as gsap.core.Timeline[];
  };

  const getBongoAnimation = () => {
    const framesParent = splineApp?.findObjectByName("bongo-cat");
    const frame1 = splineApp?.findObjectByName("frame-1");
    const frame2 = splineApp?.findObjectByName("frame-2");

    if (!frame1 || !frame2 || !framesParent) {
      return { start: () => { }, stop: () => { } };
    }

    let interval: NodeJS.Timeout;
    const start = () => {
      let i = 0;
      framesParent.visible = true;
      interval = setInterval(() => {
        if (i % 2) {
          frame1.visible = false;
          frame2.visible = true;
        } else {
          frame1.visible = true;
          frame2.visible = false;
        }
        i++;
      }, 100);
    };
    const stop = () => {
      clearInterval(interval);
      framesParent.visible = false;
      frame1.visible = false;
      frame2.visible = false;
    };
    return { start, stop };
  };

  const getKeycapsAnimation = () => {
    if (!splineApp) return { start: () => { }, stop: () => { } };

    let tweens: gsap.core.Tween[] = [];
    const removePrevTweens = () => tweens.forEach((t) => t.kill());

    const start = () => {
      removePrevTweens();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          const t = gsap.to(keycap.position, {
            y: Math.random() * 200 + 200,
            duration: Math.random() * 2 + 2,
            delay: idx * 0.6,
            repeat: -1,
            yoyo: true,
            yoyoEase: "none",
            ease: "elastic.out(1,0.3)",
          });
          tweens.push(t);
        });
    };

    const stop = () => {
      removePrevTweens();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        const t = gsap.to(keycap.position, {
          y: 0,
          duration: 4,
          repeat: 1,
          ease: "elastic.out(1,0.7)",
        });
        tweens.push(t);
      });
      setTimeout(removePrevTweens, 1000);
    };

    return { start, stop };
  };

  const updateKeyboardTransform = async () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    refreshKeyboardLayout();

    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    refreshKeyboardLayout();
    const currentState = getKeyboardState({ section: activeSection, viewport });
    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );

    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");

    await sleep(900);

    if (isCompact) {
      const mobileKeyCaps = allObjects.filter((obj) => obj.name === "keycap-mobile");
      mobileKeyCaps.forEach((keycap) => { keycap.visible = true; });
    } else {
      const desktopKeyCaps = allObjects.filter((obj) => obj.name === "keycap-desktop");
      desktopKeyCaps.forEach(async (keycap, idx) => {
        await sleep(idx * 70);
        keycap.visible = true;
      });
    }

    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      keycap.visible = true;
      gsap.fromTo(
        keycap.position,
        { y: 200 },
        { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
    });

    await sleep(800);
    refreshKeyboardLayout();
    setLayoutReady(true);
  };

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    handleSplineInteractions();
    const timelines = setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    ScrollTrigger.refresh(true);
    return () => {
      bongoAnimationRef.current?.stop()
      keycapAnimationsRef.current?.stop()
      // Kill the section ScrollTriggers so they don't orphan when the scene
      // unmounts (e.g. toggling reduced motion) and fire on the disposed app.
      timelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    }

  }, [splineApp, viewport]);

  // Re-apply keyboard layout on viewport resize (mobile, tablet, desktop)
  useEffect(() => {
    if (!splineApp) return;

    let frameId = 0;

    const updateKeyboardLayout = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => refreshKeyboardLayout());
    };

    updateKeyboardLayout();

    const layoutFallback = window.setTimeout(() => setLayoutReady(true), 800);

    window.addEventListener("resize", updateKeyboardLayout, { passive: true });
    window.addEventListener("orientationchange", updateKeyboardLayout, {
      passive: true,
    });
    window.visualViewport?.addEventListener("resize", updateKeyboardLayout, {
      passive: true,
    });
    window.addEventListener(LAYOUT_READY_EVENT, updateKeyboardLayout);

    const scene = keyboardSceneRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && scene) {
      resizeObserver = new ResizeObserver(updateKeyboardLayout);
      resizeObserver.observe(scene);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updateKeyboardLayout);
      window.removeEventListener("orientationchange", updateKeyboardLayout);
      window.visualViewport?.removeEventListener("resize", updateKeyboardLayout);
      window.removeEventListener(LAYOUT_READY_EVENT, updateKeyboardLayout);
      resizeObserver?.disconnect();
    };
  }, [splineApp, viewport, activeSection]);

  // Handle keyboard text visibility based on theme and section
  useEffect(() => {
    if (!splineApp) return;
    const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight = splineApp.findObjectByName("text-mobile");

    if (!textDesktopDark || !textDesktopLight || !textMobileDark || !textMobileLight) return;

    const setVisibility = (
      dDark: boolean,
      dLight: boolean,
      mDark: boolean,
      mLight: boolean
    ) => {
      textDesktopDark.visible = dDark;
      textDesktopLight.visible = dLight;
      textMobileDark.visible = mDark;
      textMobileLight.visible = mLight;
    };

    if (activeSection !== "skills" && activeSection !== "techStack") {
      setVisibility(false, false, false, false);
    } else {
      isCompact
        ? setVisibility(false, false, true, false)
        : setVisibility(true, false, false, false);
    }
  }, [splineApp, isCompact, activeSection]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    setSplineVariable(splineApp, "heading", selectedSkill.label);
    setSplineVariable(splineApp, "desc", selectedSkill.shortDescription);
  }, [selectedSkill]);

  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;

    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: kbd.rotation.y + Math.PI / 8,
        duration: 20,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "sine.inOut",
        delay: 2.5,
        paused: true,
      });

      teardownKeyboard = gsap.fromTo(
        kbd.rotation,
        { y: 0, x: -Math.PI, z: 0 },
        {
          y: -Math.PI / 2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          delay: 2.5,
          immediateRender: false,
          paused: true,
        }
      );
    }

    const manageAnimations = async () => {
      // Reset text if not in skills
      if (activeSection !== "skills" && activeSection !== "techStack") {
        setSplineVariable(splineApp, "heading", "");
        setSplineVariable(splineApp, "desc", "");
      }

      // Handle Rotate/Teardown Tweens
      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      // Handle Bongo Cat
      if (activeSection === "projects") {
        await sleep(300);
        bongoAnimationRef.current?.start();
      } else {
        await sleep(200);
        bongoAnimationRef.current?.stop();
      }

      // Handle Contact Section Animations
      if (activeSection === "contact") {
        await sleep(600);
        teardownKeyboard?.restart();
        keycapAnimationsRef.current?.start();
      } else {
        await sleep(600);
        teardownKeyboard?.pause();
        keycapAnimationsRef.current?.stop();
      }
    };

    manageAnimations();

    return () => {
      rotateKeyboard?.kill();
      teardownKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  useEffect(() => {
    document.body.dataset.keyboardSection = activeSection;
    return () => {
      delete document.body.dataset.keyboardSection;
    };
  }, [activeSection]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    // Rebuild the URL from the current pathname so the hash is always *replaced*
    // rather than appended. Using router.push("/" + hash) stacked fragments on
    // refresh (e.g. "/#skills#skills#skills") because the existing hash in the
    // address bar was never stripped first. replaceState also avoids polluting
    // browser history with an entry per scrolled-through section.
    const hash =
      activeSection === "hero"
        ? ""
        : activeSection === "techStack"
          ? "#tech-stack"
          : `#${activeSection}`;
    const url = window.location.pathname + window.location.search + hash;
    window.history.replaceState(window.history.state, "", url);

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection]);

  // Cap the renderer's pixel ratio once the scene is ready, and clean up the
  // resize listener on unmount / DPR change (previously added in onLoad and
  // never removed).
  useEffect(() => {
    if (!splineApp) return;
    return capSplinePixelRatio(splineApp, maxDpr, keyboardSceneRef.current);
  }, [splineApp, maxDpr]);

  // Pause WebGL while the tab is hidden (reference behaviour)
  useEffect(() => {
    if (!splineApp) return;
    const onVisibility = () => {
      if (document.hidden) splineApp.stop();
      else splineApp.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [splineApp]);

  return portalTarget
    ? createPortal(
        <div
          className={`keyboard-scene${layoutReady ? " keyboard-scene--ready" : ""}`}
          ref={keyboardSceneRef}
        >
          <Suspense fallback={null}>
            <Spline
              className="keyboard-spline-root pointer-events-auto"
              ref={splineContainer}
              renderOnDemand
              onLoad={(app: Application) => {
                setSplineApp(app);
                requestAnimationFrame(() => {
                  syncSplineCanvasSize(app, keyboardSceneRef.current);
                  requestAnimationFrame(() => {
                    syncSplineCanvasSize(app, keyboardSceneRef.current);
                    ScrollTrigger.refresh(true);
                  });
                });
              }}
              scene="/assets/skills-keyboard.splinecode"
            />
          </Suspense>
        </div>,
        portalTarget
      )
    : null;
};

/**
 * Gate the heavy WebGL scene behind device/preference detection.
 *
 * The gate lives here in the parent (not inside KeyboardScene) on purpose: when
 * 3D is disabled — e.g. the user toggles reduced motion — KeyboardScene fully
 * UNMOUNTS, tearing down its Spline app, GSAP tweens, ScrollTriggers and reveal
 * state. Re-enabling remounts it from a clean slate. (Gating with an internal
 * early-return instead kept the component mounted, so it came back with stale
 * `keyboardRevealed` state and never re-initialised the keycaps.)
 *
 * Waiting for `ready` also avoids a flash-mount that would fetch the heavy
 * runtime chunk + scene before detection has run; the Preloader bypasses its
 * splash when 3D is disabled.
 */
const AnimatedBackground = () => {
  const { disable3D, maxDpr, ready } = usePerfProfile();
  const { isLoading } = useLoading();
  if (!ready || disable3D || isLoading) return null;
  return <KeyboardScene maxDpr={maxDpr} />;
};

/**
 * Keep the WebGL canvas locked to the full layout viewport. On real mobile
 * devices the Spline ResizeObserver can measure a narrowed parent (flex /
 * scroll-wrapper timing) and render the scene into a small left-aligned canvas.
 */
function syncSplineCanvasSize(
  app: Application,
  scene: HTMLDivElement | null
) {
  if (!scene) return;

  const rect = scene.getBoundingClientRect();
  const w = Math.round(rect.width || window.innerWidth);
  const h = Math.round(rect.height || window.innerHeight);
  if (w <= 0 || h <= 0) return;

  app.setSize(w, h);
}

/**
 * Cap the Spline/Three.js renderer's pixel ratio. The scene is published with
 * pixelRatio=0 ("device"), so on a 2–3x screen it renders 4–9x the pixels of a
 * 1x canvas — a huge GPU cost. We clamp it and reapply on resize, since Spline
 * re-reads devicePixelRatio when the canvas resizes. Returns a disposer that
 * removes the resize listener (so it isn't leaked across reloads/unmounts).
 */
function capSplinePixelRatio(
  app: Application,
  maxDpr: number,
  scene: HTMLDivElement | null
) {
  const apply = () => {
    try {
      const renderer = (app as unknown as { _renderer?: { setPixelRatio?: (n: number) => void } })
        ._renderer;
      if (renderer?.setPixelRatio) {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
      }
    } catch {
      /* internal API moved — fail silent, scene still renders */
    }
    syncSplineCanvasSize(app, scene);
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
  return () => window.removeEventListener("resize", apply);
}

export default AnimatedBackground;
