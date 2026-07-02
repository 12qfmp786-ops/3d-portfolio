"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/app/components/data/constants";
import { sleep } from "@/app/components/lib/utils";
import { getViewport, isCompactViewport, useViewport } from "@/app/components/hooks/use-viewport";
import { useLoading } from "@/app/components/context/LoadingProvider";
import {
  Section,
  KeyboardSection,
  KEYBOARD_SECTION_IDS,
  getKeyboardState,
} from "@/app/components/animated-background-config";
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
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const activeSectionRef = useRef<Section>("hero");

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);

  const getKeyboardScene = () =>
    document.querySelector<HTMLDivElement>(".keyboard-scene");

  // --- Event Handlers ---

  const handleMouseHover = (e: SplineEvent) => {
    if (!splineApp || activeSectionRef.current === "hidden" || selectedSkillRef.current?.name === e.target.name) return;

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
      if (!splineApp || activeSectionRef.current === "hidden" || isInputFocused()) return;
      playReleaseSound();
      setSplineVariable(splineApp, "heading", "");
      setSplineVariable(splineApp, "desc", "");
    });
    splineApp.addEventListener("keyDown", (e) => {
      if (!splineApp || activeSectionRef.current === "hidden" || isInputFocused()) return;
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
    if (!splineApp || section === "hidden") return;
    syncSplineCanvasSize(splineApp, splineContainer.current);
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;
    const state = getKeyboardState({ section, viewport: getViewport() });
    gsap.set(kbd.scale, state.scale);
    gsap.set(kbd.position, state.position);
    gsap.set(kbd.rotation, state.rotation);
  };

  const refreshKeyboardLayout = () => {
    if (splineApp) {
      syncSplineCanvasSize(splineApp, splineContainer.current);
    }
    if (activeSectionRef.current === "hero") {
      applyKeyboardLayout("hero");
    }
    const scene = getKeyboardScene();
    if (scene) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (
        width >= window.innerWidth * 0.9 &&
        height >= window.innerHeight * 0.9
      ) {
        setLayoutReady(true);
      }
    }
    if (activeSectionRef.current !== "hidden") {
      ScrollTrigger.refresh(true);
    }
  };

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  const setSection = (section: Section) => {
    if (activeSectionRef.current === section) return;
    activeSectionRef.current = section;
    setActiveSection(section);
  };

  const freezeKeyboardAtTechStack = () => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;
    const techState = getKeyboardState({
      section: "techStack",
      viewport: getViewport(),
    });
    gsap.set(kbd.scale, techState.scale);
    gsap.set(kbd.position, techState.position);
    gsap.set(kbd.rotation, techState.rotation);
  };

  const showKeyboardScene = () => {
    const scene = getKeyboardScene();
    if (scene) gsap.set(scene, { autoAlpha: 1 });
    if (splineApp && !document.hidden) splineApp.play();
    setKeyboardScrollPaused(false);
  };

  const hideKeyboardScene = () => {
    const scene = getKeyboardScene();
    if (scene) gsap.set(scene, { autoAlpha: 0 });
    splineApp?.stop();
    setKeyboardScrollPaused(true);
  };

  const setKeyboardScrollPaused = (paused: boolean) => {
    const enter = ScrollTrigger.getById("tech-stack-enter");
    if (!enter) return;
    if (paused) enter.disable(false, false);
    else enter.enable(false, false);
  };

  const scrollTriggersRef = useRef<(gsap.core.Timeline | ScrollTrigger)[]>([]);

  const killScrollAnimations = () => {
    scrollTriggersRef.current.forEach((item) => {
      if (item instanceof ScrollTrigger) {
        item.kill();
      } else {
        item.scrollTrigger?.kill();
        item.kill();
      }
    });
    scrollTriggersRef.current = [];
  };

  useEffect(() => {
    const scene = getKeyboardScene();
    if (!scene) return;
    scene.classList.toggle("keyboard-scene--ready", layoutReady);
  }, [layoutReady]);

  const setupScrollAnimations = (): (gsap.core.Timeline | ScrollTrigger)[] => {
    if (!splineApp || !getKeyboardScene()) return [];

    const heroEl = document.querySelector(KEYBOARD_SECTION_IDS.hero);
    const techStackEl = document.querySelector(KEYBOARD_SECTION_IDS.techStack);
    const techStackZoneEl = document.querySelector(KEYBOARD_SECTION_IDS.techStackZone);
    if (!heroEl || !techStackEl || !techStackZoneEl) return [];

    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return [];

    applyKeyboardLayout("hero");
    showKeyboardScene();

    const vp = getViewport();
    const heroState = getKeyboardState({ section: "hero", viewport: vp });
    const techState = getKeyboardState({ section: "techStack", viewport: vp });

    const triggers: (gsap.core.Timeline | ScrollTrigger)[] = [
      ScrollTrigger.create({
        trigger: KEYBOARD_SECTION_IDS.hero,
        scroller: "#smooth-wrapper",
        start: "top top",
        end: "bottom top",
        onEnter: () => setSection("hero"),
        onEnterBack: () => setSection("hero"),
        onLeaveBack: () => setSection("hero"),
      }),
      ScrollTrigger.create({
        id: "tech-stack-visibility",
        trigger: KEYBOARD_SECTION_IDS.techStackZone,
        scroller: "#smooth-wrapper",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          showKeyboardScene();
          setSection("techStack");
        },
        onEnterBack: () => {
          showKeyboardScene();
          setSection("techStack");
        },
        onLeave: () => {
          freezeKeyboardAtTechStack();
          hideKeyboardScene();
          setSection("hidden");
        },
        onLeaveBack: () => {
          showKeyboardScene();
          setSection("hero");
        },
      }),
    ];

    const techStackTimeline = gsap.timeline({
      scrollTrigger: {
        id: "tech-stack-enter",
        trigger: KEYBOARD_SECTION_IDS.techStack,
        scroller: "#smooth-wrapper",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    techStackTimeline
      .fromTo(
        kbd.scale,
        { ...heroState.scale },
        { ...techState.scale, ease: "none" },
        0
      )
      .fromTo(
        kbd.position,
        { ...heroState.position },
        { ...techState.position, ease: "none" },
        0
      )
      .fromTo(
        kbd.rotation,
        { ...heroState.rotation },
        { ...techState.rotation, ease: "none" },
        0
      );

    triggers.push(techStackTimeline);

    return triggers;
  };

  const mountScrollAnimations = () => {
    killScrollAnimations();
    scrollTriggersRef.current = setupScrollAnimations();
    ScrollTrigger.refresh(true);
  };

  const getKeySection = (section: Section): KeyboardSection =>
    section === "hidden" ? "techStack" : section;

  const updateKeyboardTransform = async () => {
    if (!splineApp || activeSection === "hidden") return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    refreshKeyboardLayout();

    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    refreshKeyboardLayout();
    const currentState = getKeyboardState({
      section: getKeySection(activeSection),
      viewport,
    });
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
    mountScrollAnimations();

    const retryScrollSetup = () => {
      if (ScrollTrigger.getById("tech-stack-visibility")) return;
      if (!document.querySelector(KEYBOARD_SECTION_IDS.techStackZone)) return;
      mountScrollAnimations();
    };

    window.addEventListener(LAYOUT_READY_EVENT, retryScrollSetup);

    return () => {
      window.removeEventListener(LAYOUT_READY_EVENT, retryScrollSetup);
      killScrollAnimations();
    };
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

    const scene = splineContainer.current;
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
  }, [splineApp, viewport]);

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

    if (activeSection !== "techStack") {
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

  // Hero idle rotation only; keyboard is fully disabled when hidden
  useEffect(() => {
    if (!splineApp || activeSection === "hidden") return;

    let rotateKeyboard: gsap.core.Tween | undefined;
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
    }

    if (activeSection !== "techStack") {
      setSplineVariable(splineApp, "heading", "");
      setSplineVariable(splineApp, "desc", "");
    }

    if (activeSection === "hero") {
      rotateKeyboard?.restart();
    } else {
      rotateKeyboard?.pause();
    }

    return () => {
      rotateKeyboard?.kill();
    };
  }, [activeSection, splineApp]);

  // Past Tech Stack: freeze transform, pause WebGL, disable scrub triggers
  useEffect(() => {
    if (!splineApp) return;

    const kbd = splineApp.findObjectByName("keyboard");

    if (activeSection === "hidden") {
      freezeKeyboardAtTechStack();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      setSplineVariable(splineApp, "heading", "");
      setSplineVariable(splineApp, "desc", "");
      splineApp.stop();
      setKeyboardScrollPaused(true);
      return;
    }

    if (kbd) kbd.visible = true;
    if (!document.hidden) splineApp.play();
    setKeyboardScrollPaused(false);

    if (activeSection === "hero") {
      applyKeyboardLayout("hero");
    }
  }, [activeSection, splineApp]);

  useEffect(() => {
    document.body.dataset.keyboardSection = activeSection;
    return () => {
      delete document.body.dataset.keyboardSection;
    };
  }, [activeSection]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    if (activeSection === "hidden") return;

    const hash = activeSection === "hero" ? "" : "#tech-stack";
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
    return capSplinePixelRatio(splineApp, maxDpr, splineContainer.current);
  }, [splineApp, maxDpr]);

  // Pause WebGL while the tab is hidden (reference behaviour)
  useEffect(() => {
    if (!splineApp) return;
    const onVisibility = () => {
      if (document.hidden) splineApp.stop();
      else if (activeSectionRef.current !== "hidden") splineApp.play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [splineApp]);

  return (
    <Suspense fallback={null}>
      <Spline
        className="keyboard-spline-root pointer-events-auto h-full w-full"
        ref={splineContainer}
        renderOnDemand
        onLoad={(app: Application) => {
          setSplineApp(app);
          const pin = () => syncSplineCanvasSize(app, splineContainer.current);
          requestAnimationFrame(() => {
            pin();
            requestAnimationFrame(() => {
              pin();
              ScrollTrigger.refresh(true);
            });
          });
          if (getViewport() === "mobile") {
            let frames = 0;
            const bootstrapPin = () => {
              pin();
              if (++frames < 45) requestAnimationFrame(bootstrapPin);
            };
            requestAnimationFrame(bootstrapPin);
          }
        }}
        scene="/assets/skills-keyboard.splinecode"
      />
    </Suspense>
  );
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
 * On mobile, Spline's internal ResizeObserver can measure a narrowed parent and
 * render into a small left-aligned WebGL buffer. Lock the renderer to the layout
 * viewport instead. Desktop keeps Spline's default sizing behaviour.
 */
function pinSplineCanvasToViewport(
  app: Application,
  splineRoot: HTMLDivElement | null
) {
  if (!splineRoot || getViewport() !== "mobile") return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width <= 0 || height <= 0) return;

  app.setSize(width, height);

  splineRoot.querySelectorAll("canvas").forEach((node) => {
    if (!(node instanceof HTMLCanvasElement)) return;
    node.style.width = "100%";
    node.style.height = "100%";
    node.style.margin = "0";
    node.style.left = "0";
    node.style.top = "0";
    node.style.transform = "none";
  });
}

function syncSplineCanvasSize(
  app: Application,
  splineRoot: HTMLDivElement | null
) {
  pinSplineCanvasToViewport(app, splineRoot);
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
  splineRoot: HTMLDivElement | null
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
    syncSplineCanvasSize(app, splineRoot);
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
  if (getViewport() === "mobile") {
    window.addEventListener("orientationchange", apply, { passive: true });
    window.visualViewport?.addEventListener("resize", apply, { passive: true });
    window.visualViewport?.addEventListener("scroll", apply, { passive: true });
  }
  return () => {
    window.removeEventListener("resize", apply);
    window.removeEventListener("orientationchange", apply);
    window.visualViewport?.removeEventListener("resize", apply);
    window.visualViewport?.removeEventListener("scroll", apply);
  };
}

export default AnimatedBackground;
