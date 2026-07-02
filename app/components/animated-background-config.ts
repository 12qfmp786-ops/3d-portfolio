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

export const STATES: Record<KeyboardSection, SectionStates> = {
  hero: {
    desktop: {
      scale: { x: 0.20, y: 0.20, z: 0.20 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    tablet: {
      scale: { x: 0.28, y: 0.28, z: 0.28 },
      position: { x: 0, y: -100, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    mobile: {
      scale: { x: 0.42, y: 0.42, z: 0.42 },
      position: { x: 0, y: 0, z: 0 },
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

const getScaleOffset = (viewport: Viewport) => {
  const { width, height, minScale, maxScale } = REF_BY_VIEWPORT[viewport];
  const wRatio = getViewportWidth() / width;
  if (viewport === "mobile") {
    return clamp(wRatio, minScale, maxScale);
  }
  const hRatio = getViewportHeight() / height;
  return clamp(Math.min(wRatio, hRatio), minScale, maxScale);
};

const getResponsivePosition = (
  base: TransformProfile["position"],
  viewport: Viewport,
) => {
  const { width: refWidth, height: refHeight } = REF_BY_VIEWPORT[viewport];
  const width = getViewportWidth();
  const height = getViewportHeight();

  const wRatio = clamp(width / refWidth, 0.75, 1.15);
  const x = base.x * wRatio;

  const heightDelta = height - refHeight;
  let y = base.y;

  if (viewport === "mobile") {
    y -= heightDelta * 0.14;
  } else if (viewport === "tablet") {
    y -= heightDelta * 0.11;
  } else {
    y += heightDelta * 0.04;
  }

  return { x, y, z: base.z };
};

export const getKeyboardState = ({
  section,
  viewport,
}: {
  section: KeyboardSection;
  viewport: Viewport;
}) => {
  const baseTransform = STATES[section][viewport];
  const scaleOffset = getScaleOffset(viewport);
  let position = getResponsivePosition(baseTransform.position, viewport);

  if (section === "hero" && viewport === "mobile") {
    const wRatio = clamp(
      getViewportWidth() / REF_BY_VIEWPORT.mobile.width,
      0.75,
      1.15,
    );
    position = {
      x: baseTransform.position.x * wRatio,
      y: baseTransform.position.y,
      z: baseTransform.position.z,
    };
  }

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
