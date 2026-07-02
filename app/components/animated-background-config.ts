import {
  getViewportHeight,
  getViewportWidth,
  type Viewport,
} from "@/app/components/hooks/use-viewport";

export type Section = "hero" | "techStack" | "hidden";

export type KeyboardSection = "hero" | "techStack";

/** DOM anchors the keyboard scroll system is allowed to bind to. */
export const KEYBOARD_SECTION_IDS = {
  hero: "#hero",
  techStackHeader: "#tech-stack-header",
  techStack: "#tech-stack",
  boundary: "#keyboard-boundary",
  techStackZone: "#tech-stack-zone",
} as const;

/** Push the tech-stack keyboard below the header block in scene space. */
export const getTechStackHeaderOffsetY = (): number => {
  if (typeof document === "undefined") return 0;
  const header = document.querySelector<HTMLElement>(
    KEYBOARD_SECTION_IDS.techStackHeader,
  );
  if (!header) return 0;
  return -header.getBoundingClientRect().height * 0.5;
};

type TransformProfile = {
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
};

type SectionStates = {
  mobile: TransformProfile;
  tablet: TransformProfile;
  desktop: TransformProfile;
};

/** Base transforms at the reference viewport for each breakpoint. */
export const STATES: Record<KeyboardSection, SectionStates> = {
  hero: {
    desktop: {
      scale: { x: 0.20, y: 0.20, z: 0.20 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    tablet: {
      scale: { x: 0.38, y: 0.38, z: 0.38 },
      position: { x: 0, y: 10, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.24, y: 0.24, z: 0.24 },
      position: { x: 0, y: 30, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
  techStack: {
    desktop: {
      scale: { x: 0.22, y: 0.22, z: 0.22 },
      position: { x: 0, y: -310, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 10,
        z: 0,
      },
    },
    tablet: {
      scale: { x: 0.26, y: 0.26, z: 0.26 },
      position: { x: 0, y: -120, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 9,
        z: 0,
      },
    },
    mobile: {
      scale: { x: 0.24, y: 0.24, z: 0.24 },
      position: { x: 0, y: -90, z: 0 },
      rotation: {
        x: 0,
        y: Math.PI / 8,
        z: 0,
      },
    },
  },
};

const MOBILE_REF_WIDTH = 390;
const MOBILE_REF_HEIGHT = 844;
const TABLET_REF_WIDTH = 820;
const TABLET_REF_HEIGHT = 1180;
const DESKTOP_REF_WIDTH = 1280;
const DESKTOP_REF_HEIGHT = 900;

const REF_BY_VIEWPORT: Record<
  Viewport,
  { width: number; height: number; minScale: number; maxScale: number }
> = {
  mobile: { width: MOBILE_REF_WIDTH, height: MOBILE_REF_HEIGHT, minScale: 0.55, maxScale: 1.0 },
  tablet: { width: TABLET_REF_WIDTH, height: TABLET_REF_HEIGHT, minScale: 0.58, maxScale: 0.98 },
  desktop: { width: DESKTOP_REF_WIDTH, height: DESKTOP_REF_HEIGHT, minScale: 0.68, maxScale: 1.1 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Scale from both width and height so the keyboard grows/shrinks with the
 * viewport and never overflows a short or narrow screen.
 */
const getViewportSizeRatio = (viewport: Viewport) => {
  const { width: refWidth, height: refHeight, minScale, maxScale } =
    REF_BY_VIEWPORT[viewport];
  const wRatio = getViewportWidth() / refWidth;
  const hRatio = getViewportHeight() / refHeight;
  return clamp(Math.min(wRatio, hRatio), minScale, maxScale);
};

/** Vertical bias that tracks viewport height at every breakpoint. */
const getViewportPositionY = (
  baseY: number,
  viewport: Viewport,
  section: KeyboardSection,
) => {
  const { height: refHeight } = REF_BY_VIEWPORT[viewport];
  const heightDelta = getViewportHeight() - refHeight;

  const yFactor =
    section === "hero"
      ? viewport === "mobile"
        ? 0.05
        : viewport === "tablet"
          ? 0.04
          : 0.04
      : viewport === "mobile"
        ? 0.03
        : 0.04;

  return baseY + heightDelta * yFactor;
};

export const getKeyboardState = ({
  section,
  viewport,
}: {
  section: KeyboardSection;
  viewport: Viewport;
}) => {
  const baseTransform = STATES[section][viewport];
  const scaleOffset = getViewportSizeRatio(viewport);

  let position = {
    x: baseTransform.position.x,
    y: getViewportPositionY(baseTransform.position.y, viewport, section),
    z: baseTransform.position.z,
  };

  if (section === "techStack") {
    position = {
      ...position,
      y: position.y + getTechStackHeaderOffsetY(),
    };
  }

  return {
    ...baseTransform,
    scale: {
      x: Math.abs(baseTransform.scale.x * scaleOffset),
      y: Math.abs(baseTransform.scale.y * scaleOffset),
      z: Math.abs(baseTransform.scale.z * scaleOffset),
    },
    position,
  };
};
